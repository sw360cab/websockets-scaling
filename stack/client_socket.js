const uuid = require('uuid');
const io = require('socket.io-client');
const client = io('http://localhost:30080', {
  // port: 5000 - when using direct connection
  // port: 80 - when using Haproxy or Treafik Reverse Proxy
  // port: 30000 - when using plain k8s with NodePort
  // port: 30080, when using Traefik Ingress in k8s
  path: '/wsk', // when using Traefik Ingress
  // path: '/', // for all other scenarios
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
  transports: ['websocket']
});

const clientId = uuid.v4()

client.on('connect', function(){
  console.log("Connected!", clientId);
  setTimeout(function() {
    console.log('Sending first message');
    client.emit('test000', clientId);
  }, 500);
});

client.on('okok', function(message) {
  console.log('The server has a message for you:', message);
})

client.on('disconnect', function(){
  console.log("Disconnected!");
  process.exit(0);
});

client.on('error', function(err){
  console.error(err);
  process.exit(1);
});

setInterval(function() {
  console.log('Sending repeated message');
  client.emit('test000', clientId);
}, 5000);