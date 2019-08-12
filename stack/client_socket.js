const uuid = require('uuid');
const io = require('socket.io-client');
const client = io('http://localhost:5000', { // 30000
  transports: ['websocket']
});

const clientId = uuid.v4()

client.on('connect', function(){
  console.log("Connected!", clientId);
});

client.on('okok', function(message) {
  console.log('The server has a message for you: ' + message);
  //client.emit('test000', clientId);
})

client.on('disconnect', function(){
  console.log("Disconnected!");
  process.exit(0);
});

setTimeout(function() {
  client.emit('test000', clientId);
}, 5000);