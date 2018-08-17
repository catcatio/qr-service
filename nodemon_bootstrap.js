var nodemon = require('nodemon');

nodemon({ script: 'src/index.js' })
.on('start', () => {
  console.log('nodemon started');
})
.on('crash', () => {
  console.error('app crashed');
  // exit nodemon and let pm2 handling it
  process.exit();
});
