# Static Microservices Scenario

This leverages **docker-compose** and deploys the following services:

* redis (pub/sub)
* socket-server application (2 instances)
* Traefik ad reverse proxy (with dynamic configuration)

## Traefik

Traefik is employed as proxy for Websockets connections.
It dynamically configures itself leveraging `Docker Labels` on websocket service image

## Setup and Run

### Microservices

    docker-compose up -d
    # scaling websocket service
    docker-compose up -d --scale socket-server=2 socket-server

### Swarm Mode

    docker stack deploy --compose-file docker-compose.yml wsk

### client

The client endpoint is `<http://localhost:80>`, path is `wsk/`.

For any new client open a new terminale and run:

    node client_socket.js
