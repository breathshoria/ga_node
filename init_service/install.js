const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'GABot Node',
  description: 'The Great Acceptor Telegram point handler',
  script: path.join(__dirname, '..', 'index.js'),
  scriptOptions:'nodemon -L',
});

svc.on('install',function(){
  svc.start();
  console.log('The service exists: ',svc.exists);
});

svc.install();
