import {
  cleanupOutdatedCaches,
  precacheAndRoute,
} from 'workbox-precaching';

import { registerRoute } from 'workbox-routing';

import {
  CacheFirst,
  NetworkFirst,
} from 'workbox-strategies';

import { CacheableResponsePlugin } from 'workbox-cacheable-response';

import { ExpirationPlugin } from 'workbox-expiration';


// ======================================================
// WORKBOX
// ======================================================

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();


// ======================================================
// CACHE DAS FONTES DO GOOGLE
// ======================================================

registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com',

  new CacheFirst({
    cacheName: 'google-fonts-cache',

    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),

      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);


// ======================================================
// CACHE DAS FONTES GOOGLE ESTÁTICAS
// ======================================================

registerRoute(
  ({ url }) => url.hostname === 'fonts.gstatic.com',

  new CacheFirst({
    cacheName: 'gstatic-fonts-cache',

    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),

      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);


// ======================================================
// CACHE DA API
// ======================================================

registerRoute(
  ({ url }) =>
    url.hostname === 'localhost' &&
    url.port === '8001',

  new NetworkFirst({
    cacheName: 'api-cache',

    networkTimeoutSeconds: 10,

    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),

      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24,
      }),
    ],
  }),
);


// ======================================================
// ATUALIZAÇÃO DO SERVICE WORKER
// ======================================================

self.addEventListener('message', (event) => {

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

});


// ======================================================
// ATIVAÇÃO
// ======================================================

self.addEventListener('activate', (event) => {

  event.waitUntil(
    self.clients.claim(),
  );

});


// ======================================================
// RECEBIMENTO DE PUSH
// ======================================================

self.addEventListener('push', (event) => {

  console.log('PUSH RECEBIDO');


  let payload = {
    event: 'unknown',
    message: 'Você recebeu uma atualização.',
  };


  if (event.data) {

    try {

      payload = event.data.json();

    } catch {

      payload = {
        event: 'unknown',
        message: event.data.text(),
      };

    }

  }


  const {
    title,
    body,
  } = buildNotificationContent(payload);


  event.waitUntil(

    Promise.all([

      // -----------------------------------------------
      // NOTIFICAÇÃO DO SISTEMA
      // -----------------------------------------------

      self.registration
        .showNotification(title, {
          body: body,
          data: payload,
          vibrate: [200, 100, 200],
        })
        .catch((error) => {

          console.error(
            'Erro ao mostrar notificação:',
            error,
          );

        }),


      // -----------------------------------------------
      // ENVIA O PUSH PARA O APP ABERTO
      // -----------------------------------------------

      self.clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })

        .then((clients) => {

          clients.forEach((client) => {

            client.postMessage({

              type: 'PUSH_RECEIVED',

              title: title,

              body: body,

              payload: payload,

            });

          });

        }),

    ]),

  );

});


// ======================================================
// CONTEÚDO DAS NOTIFICAÇÕES
// ======================================================

function buildNotificationContent(payload) {

  switch (payload.event) {


    case 'task_created':

      return {

        title: 'Nova tarefa criada',

        body:
          payload.task?.title ??
          'Uma nova tarefa foi adicionada.',

      };


    case 'task_updated': {

      const task = payload.task;


      if (task?.done) {

        return {

          title: 'Tarefa concluída ✓',

          body:
            task.title ??
            'Tarefa concluída.',

        };

      }


      return {

        title: 'Tarefa atualizada',

        body:
          task?.title ??
          'Uma tarefa foi modificada.',

      };

    }


    case 'task_deleted':

      return {

        title: 'Tarefa removida',

        body: 'Uma tarefa foi excluída.',

      };


    default:

      return {

        title: 'Gerenciador de Tarefas',

        body:
          payload.message ??
          'Você tem uma atualização.',

      };

  }

}


// ======================================================
// CLIQUE NA NOTIFICAÇÃO
// ======================================================

self.addEventListener(
  'notificationclick',
  (event) => {

    event.notification.close();


    event.waitUntil(

      self.clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })

        .then((clientList) => {


          // -----------------------------------------
          // APP JÁ ESTÁ ABERTO
          // -----------------------------------------

          for (const client of clientList) {

            if (

              client.url.includes(
                self.registration.scope,
              )

              &&

              'focus' in client

            ) {

              client.postMessage({

                type:
                  'PUSH_NOTIFICATION_CLICKED',

                payload:
                  event.notification.data,

              });


              return client.focus();

            }

          }


          // -----------------------------------------
          // APP ESTÁ FECHADO
          // -----------------------------------------

          if (self.clients.openWindow) {

            return self.clients.openWindow(
              '/tarefas-pwa/',
            );

          }

        }),

    );

  },
);