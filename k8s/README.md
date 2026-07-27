# Kubernetes deployment

The portfolio is a Next.js app built as a **standalone** image and served on
container port `3000`.

## 1. Build & push the image

```bash
# From the repo root
export IMAGE=ghcr.io/kere-sifon/keresifon:latest   # change to your registry

docker build -t "$IMAGE" .
docker push "$IMAGE"
```

If you build on Apple Silicon but your cluster runs amd64 nodes, build a
multi-arch (or amd64) image:

```bash
docker buildx build --platform linux/amd64 -t "$IMAGE" --push .
```

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
kubectl get pods,svc,ingress -l app=keresifon
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
| `ingress.yaml`    | nginx ingress + TLS for `keresifon.com` / `www.keresifon.com` |
| `hpa.yaml`        | Autoscale 2→6 pods at 70% CPU                                 |
| `kustomization.yaml` | Ties it together; central image tag override               |

## Notes

- The container listens on `PORT=3000` and `HOSTNAME=0.0.0.0` (set in the
  Dockerfile). The Service maps 80 → 3000.
- `ingress.yaml` assumes an **nginx** ingress controller and (optionally)
  cert-manager for TLS. Adjust `ingressClassName`, host names, and annotations
  for your cluster. If you don't have cert-manager, remove the `tls:` block or
  provide the `keresifon-tls` secret yourself.
- The HPA requires the **metrics-server** to be installed in the cluster.
- `readOnlyRootFilesystem` is enabled; Next.js standalone does not write to disk
  at runtime, so no writable volume is required.
