# Stack Docker version

This leverages **docker-compose** and deploys the following services:

* redis (pub/sub)
* socket-server application (2 instances)
* HAProxy to balance requests (with static configuration)

`Note`: socket-server application is deployed explicitly twice to allow a fully static configuration of HAProxy.

## HAProxy

HAProxy is employed as proxy for Websockets connections. The important parts of configuration are:

    cookie io prefix indirect nocache

Using the `io cookie` set upon handshake.

and:

    server ws0 socket-server:3000 check cookie ws0
    server ws1 socket-server:3001 check cookie ws1

to set balanced host configuration.

## Setup and Run

### Microservices

    docker-compose up -d
    # scaling websocket service
    docker-compose up -d --scale socket-server=2 socket-server

### Swarm Mode

    docker stack deploy --compose-file docker-compose.yml wsk

### client

The client endpoint is `<http://localhost:80>`.

For any new client open a new terminale and run:

    node client_socket.js
