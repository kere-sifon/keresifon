# Kubernetes deployment

The portfolio is a Next.js app built as a **standalone** image and served on
container port `3000`.

## 1. Build & push the image

Always build a **multi-arch** image so it runs on both amd64 and arm64 nodes
(OpenShift/EKS clusters are frequently arm64):

```bash
# From the repo root
export IMAGE=ghcr.io/kere-sifon/keresifon:latest   # change to your registry / tag

docker buildx build --platform linux/amd64,linux/arm64 -t "$IMAGE" --push .
```

> A plain `docker build` produces a single-arch image for your local machine
> only. On Apple Silicon that's arm64; pushing it to an amd64 cluster (or vice
> versa) causes `ErrImagePull: no image found ... for architecture`.

## 2. Point the manifests at your image

Edit the `image:` in `deployment.yaml`, or override it with kustomize:

```bash
cd k8s
kustomize edit set image ghcr.io/kere-sifon/keresifon="$IMAGE"
```

## 3. Deploy

```bash
kubectl apply -k k8s/
# or into a dedicated namespace:
kubectl create namespace portfolio --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -k k8s/ -n portfolio
```

## 4. Verify

```bash
kubectl rollout status deployment/keresifon
oc get pods,svc,route -l app=keresifon   # kubectl on OpenShift also works
kubectl port-forward svc/keresifon 8080:80   # then open http://localhost:8080
```

## Image pull

The `ghcr.io/kere-sifon/keresifon` package is **public**, so no image pull
secret is required. If you ever make it private again, add an `imagePullSecrets`
entry to the deployment and create the secret:

```bash
kubectl -n keresifon create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io \
  --docker-username=<github-user> \
  --docker-password=<token-with-read:packages>
```

## Deploy with ArgoCD (GitOps)

ArgoCD watches this repo and syncs `k8s/` to the cluster. Apply the Application
once (into the `argocd` namespace):

```bash
kubectl apply -f argocd/application.yaml
```

ArgoCD then:

- reads `k8s/kustomization.yaml` from `main`,
- creates the `keresifon` namespace (`CreateNamespace=true`),
- keeps the cluster in sync (`prune` + `selfHeal`).

To update the app, push a new image and bump the tag in
`k8s/kustomization.yaml` — ArgoCD rolls it out on the next sync.

## What's included

| File              | Purpose                                                        |
| ----------------- | ------------------------------------------------------------- |
| `deployment.yaml` | 2 replicas, rolling updates, non-root, probes on `/`          |
| `service.yaml`    | ClusterIP exposing port 80 → container 3000                   |
| `route.yaml`      | OpenShift Route (edge TLS), auto-generated host for local testing |
| `hpa.yaml`        | Autoscale 2→6 pods at 70% CPU                                 |
| `kustomization.yaml` | Ties it together; central image tag override               |

## Notes

- The container listens on `PORT=3000` and `HOSTNAME=0.0.0.0` (set in the
  Dockerfile). The Service maps 80 → 3000.
- `route.yaml` defines an **OpenShift Route** with edge TLS termination and
  HTTP→HTTPS redirect. It has no `spec.host`, so OpenShift generates one for
  local testing (e.g. `keresifon-<namespace>.apps-crc.testing`); run
  `oc get route keresifon` to see it. For production, set `spec.host` and add a
  cert/key to the `tls` block (or use cert-manager). On a non-OpenShift cluster,
  use an Ingress instead.
- The HPA requires the **metrics-server** to be installed in the cluster.
- `readOnlyRootFilesystem` is enabled; Next.js standalone does not write to disk
  at runtime, so no writable volume is required.
