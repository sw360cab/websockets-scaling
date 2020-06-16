# Scaling websockets

## Intro

Purpose of this is achieving a scalable environment when WebSocket are involved.
The pattern to reproduce is a Multi-Server to Multi-client communication via websocket.

The result should be a client connected to a specific server host and keeping its connection bound to it (`sticky` connection).
Whereas the server hosts will broadcast messages in turn and all the connected clients should receive them.
The latter will be achieved leveraging the pub/sub paradigm of `Redis`.

The application is made of server and client part. Both are based `socket.io` library.

### Server

* it employs a dedicated adapter implementing native Redis support.
* an instance will advertise periodically its private ip. **NOTE that this message should be received by ALL the clients connected.**

### Client

* it is configured to employ native websockets, without attempting to use naïfes solutions as http polling.

      { transports: ['websocket'] }

* it will send a message to a single server instance at connection time. **NOTE that this message should be received only by a single server instance.**

## Stack of Microservices Scenario

See [Stack](stack/README.md) configuration.

## Kubernates Scenario

See [Kubernates](k8s/README.md) configuration.

## References

* [Scaling Websockets Tutorial](https://hackernoon.com/scaling-websockets-9a31497af051)
* [Socket.io - Using Multiple Nodes](https://socket.io/docs/using-multiple-nodes/)
* [Scaling Node.js Socket Server with Nginx and Redis](https://blog.jscrambler.com/scaling-node-js-socket-server-with-nginx-and-redis/)
* [Deploying a real time notification system on Kubernetes](https://medium.com/@faiyaz26/deploying-a-real-time-notification-system-on-kubernetes-part-2-1a28b4321dfc)
