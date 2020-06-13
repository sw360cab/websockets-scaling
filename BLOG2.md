# Scaling Websockets in the Cloud (Part 2). Introducing Traefik: the all-in-one dynamic and flexible solution suitable for both Docker stack and Kubernetes cluster


`Traefik` is
It has a multipurpose structure so that it can be employed as a standalone service but, thanks to the concepts of `Providers`, it works smoothly in a fully `Docker` environment or as a `Kubernetes` resource, likely in many others.


It can have a static and a Dynamcic Configuration


Dashboard

Going back to what explained before


The above image explain tha basic blocks of `Traefik`:

* entrypoints
* routers
* middlewares
* services

`Tip`: take a moment to understand basic concepts and different kind and blocks of configuration in `Traefik`, you will become immediately friends. Otherwise it may happen that it gives you hard time. Deal with it at the end you will cope and win together.

### Traefik in Docker

Traefik can be defined as a single service in your compose file.



Interested services will be dynamically reachable using the concept of [Docker Labels](https://docs.docker.com/compose/compose-file/#labels). This list will contain all the definitions allowing Traefik to discover the interested service

`Tip`: If any sort of troubleshooting is needed add options to enbale access logging and debug level detail

```yaml
  - "--accesslog"
  - "--log.level=DEBUG"
```

### Traefik in Kubernetes

Traefik in Kubernetes may act as an `Ingress` resource, the entrypoint to a specific service, that can be bound to a domain name and port. In version 2.2 Traefik improved is terminology, so that the state of the art way is defining an `Ingress Route` through a Kubernetes `CRD` (Custom Resource Definition).
In this environment Traefik require the definition of the followings:

- CRD
- RBAC (Role-Based Access Control) defining the items:
  - ServiceAccount
  - ClusterRole (with access to specific api groups in K8S)
  - ClusterRoleBinding (binding the previous two items)
- a Deployment (of the Traefik Pods)

```Yaml
serviceAccountName: traefik-ingress-controller
containers:
  - name: traefik
    image: traefik:v2.2
    args:
      - --api.insecure
      - --accesslog
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.kubernetescr
```

- a Service (exposing the entrypoint to the external world)
- an IngressRoute. Which is the core of our configuration specifing the router rules, the service to be bound, the entrypoint of reference and eventually extra-rules of middlewares

```yaml
kind: IngressRoute
apiVersion: traefik.containo.us/v1alpha1
metadata:
  name: simpleingressroute
  namespace: default
spec:
  entryPoints:
    - web
  routes:
  # - match: Host(`your.example.com`) && PathPrefix(`/notls`)
  - match: PathPrefix(`/`)
    kind: Rule
    services:
    - name: wsk-svc
      port: 3000
```

`Tip`: whether your service will have access from a predifined domain the router match ruls will be something like:

```yaml
- match: Host(`your.example.com`) && PathPrefix(`/`)
```

### Going beyond

`Socket.io` by default will expose the default websocket endpoint adding a `/socket.io` suffix at the end. This is quite strange when you start reaching your websocket in a complex environment.

The solution is fixing the path of the websocket in the application.

```Javascript
const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer, {
  path: '/'
})
```

`Tip` You may not be able to expose your service on a root endpoint ('/'). Defining an endpoint different from root is not so easy, especially when clients connect. Some extra work is needed also in Traefik. On the repository code this scenario is covered.

## References

* [sw360cab/websockets-scaling: A tutorial to scale Websockets both via Docker Swarm and Kubernetes](https://github.com/sw360cab/websockets-scaling)
* [Concepts - Traefik](https://docs.traefik.io/getting-started/concepts/ "Concepts - Traefik")
* [Docker - Traefik](https://docs.traefik.io/providers/docker/ "Docker - Traefik")
* [Docker - Traefik](https://docs.traefik.io/routing/providers/docker/ "Docker - Traefik")
* [Docker - Traefik](https://docs.traefik.io/reference/dynamic-configuration/docker/ "Docker - Traefik")
* [Kubernetes IngressRoute - Traefik](https://docs.traefik.io/routing/providers/kubernetes-crd/ "Kubernetes IngressRoute - Traefik")
