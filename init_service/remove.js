const Service = require('node-windows').Service;
const path = require('path')

// Create a new service object
var svc = new Service({
  name:'GABot Node',
  script: path.join(__dirname, '..', 'index.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();