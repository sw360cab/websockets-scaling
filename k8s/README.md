# K8S version

This configuration will use a service interfacing a deployment with 3 replicas of socket-server application.
The back part of Redis is handled by a classic Redis Master/Slave configuration.

## Websocket Deployment/Service (folder wsk/)

The service is packed and exposed from static version via a docker image deployed on private registry.
The port of the container is 5000. In an early version the service will be exposed via a NodePort on port 30000.

The key point of the service is `sessionAffinity: ClientIP` which will mimic Sticky connection for the service.

* Note: In general Round Robin among PODs is not guaranteed using a simple solution like NodePort. In order to mimic Round Robin policy, this configuration should be added:

      sessionAffinityConfig:
        clientIP:
          timeoutSeconds: 10

## Redis Deployment/Service (folder redis/)

A Master-Slave K8S for Redis  solution that is maintaing in-sync websockets through Pub/Sub, using the endpoint:

* **redis-master.default.svc.cluster.local**

## Setup and Run

### microservices

    # Launch Redis Deployment and Services
    cd redis/
    kubectl create -f redis-master-deployment.yaml, redis-slave-deployment.yaml
    kubectl create -f redis-master-service.yaml, redis-slave-service.yaml

    # Launch Websocket Deployment and Services
    cd ../wsk
    kubectl create -f wsk-deployment.yaml
    kubectl create -f wsk-service.yaml

### client

For any new client open a new terminale and run:

    node client_socket.js
