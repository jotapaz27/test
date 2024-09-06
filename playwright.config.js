const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test', // Directorio donde se almacenan las pruebas
  timeout: 30000, // Tiempo máximo para cada prueba
  retries: 2, // Reintentar pruebas fallidas hasta 2 veces
  reporter: [
    ['list'],  // Muestra la salida en la consola
    ['html', { open: 'never' }]  // Genera un reporte HTML y no lo abre automáticamente
  ],
  use: {
    baseURL: 'http://localhost:3000', // URL base de tu API
    trace: 'on-first-retry', // Habilita un rastreo (trace) en caso de fallos
    // Habilitar el registro de las solicitudes y respuestas
    // Se puede utilizar la función `onRequest` y `onResponse`
    launchOptions: {
      headless: true, // Puedes cambiar a false si deseas ver el navegador
    },
  },
  projects: [
    {
      name: 'API Testing',
      use: {
        // Interceptar solicitudes y registrar request y response
        contextOptions: {
          recordVideo: {
            dir: './videos/' // Si quieres grabar videos de las pruebas, se almacenan aquí
          },
          viewport: { width: 1280, height: 720 },
          // Habilitar rastreo completo para cada prueba
          trace: 'on', // Activa el rastreo completo para ver las solicitudes y respuestas.
        },
      },
    },
  ],
});