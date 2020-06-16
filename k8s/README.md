# K8S version

This configuration will use a service interfacing a deployment with 3 replicas of socket-server application.
The back part of Redis is handled by a classic Redis Master/Slave configuration.

## Websocket Deployment/Service (folder wsk/)

The service is packed and exposed from static version via a Docker image deployed on private registry.
The exposed port of the container / pod is 5000. The service is exposed via a `NodePort` on port 30000.

The key point of the service is `sessionAffinity: ClientIP` which will mimic Sticky connection for the service.

* Note: In general Round Robin among PODs is not guaranteed using a simple solution like NodePort. In order to mimic Round Robin policy, this configuration should be added:

      sessionAffinityConfig:
        clientIP:
          timeoutSeconds: 10

## Redis Deployment/Service (folder redis/)

A Master-Slave K8S for Redis solution that is maintaining in-sync websockets through Pub/Sub, using the endpoint:

* **redis-master.default.svc.cluster.local`**

## Setup and Run

### microservices

    # Launch Redis Deployment and Services
    cd redis/
    kubectl create -f redis-master-deployment.yaml, redis-slave-deployment.yaml
    kubectl create -f redis-master-service.yaml, redis-slave-service.yaml

    # Launch Websocket Deployment and Services
    cd ../wsk
    kubectl create -f wsk-deployment.yaml
    kubectl create -f wsk-service.yamll

### client

The client endpoint for `NodePort Service` is: *<http://localhost:30000>*

For any new client open a new terminal and run:

    node ../stack/client_socket.js
