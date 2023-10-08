/* eslint-disable linebreak-style */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    // server dijalankan di localhost:9000
    port: 9000,
    host: 'localhost',
  });

  // memanggil program routes
  server.route(routes);

  await server.start();
  // menyatakan server berjalan di port dan host tertentu
  console.log(`Server Running On ${server.info.uri}`);
};

// memanggil function init untuk menjalankan server
init();
