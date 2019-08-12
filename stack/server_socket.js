// WebSocket
const os = require('os');
const ifaces = os.networkInterfaces();

const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer);
const redisAdapter = require('socket.io-redis');

const redisHost = 'localhost'; // 'redis-master.default.svc';
const socketPort = 5000;

let randomOffset = Math.floor(Math.random() * 10);
let intervalOffset = (30+randomOffset) * Math.pow(10,3);

io.adapter(redisAdapter({ host: redisHost, port: 6379 }));
io.on('connection', client => {
  client.on('test000', function(message) {
    console.log('Message from the client: ' + message);
  })
});
setInterval(() => {
  let log0 = "Sono il server " + getPrivateIp();
  console.log(log0);
  io.emit("okok", log0);
}, intervalOffset);

const getPrivateIp = function() {
  return Object.values(ifaces).flat().find(val => {
    return (val.family == 'IPv4' && val.internal == false);
  }).address;
};

// Web Socket listen
socketServer.listen(socketPort);