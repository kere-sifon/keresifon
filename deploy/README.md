# Deploying keresifon

The site runs as a Next.js **standalone** container on **homelab-k8s**, built for
`linux/amd64`, pushed to the self-hosted **Nexus** registry, and rolled out with
`deploy/deploy.sh`. The same script is used locally from the Mac and by the
GitHub Actions pipeline (`.github/workflows/deploy.yml`) on a self-hosted runner.

## Topology

| Thing            | Value                                              |
| ---------------- | -------------------------------------------------- |
| Registry         | `nexus-lan.keresifon.com/docker-hosted/keresifon`  |
| Namespace        | `keresifon` (Pod Security: `restricted`)           |
| Service          | `LoadBalancer`, pinned to `192.168.2.242:3000` via Cilium LB-IPAM |
| App URL (health) | `http://192.168.2.242:3000/`                       |
| Image tag        | short git SHA (`-dirty-<ts>` when the tree is dirty) |
| Pull secret      | `nexus-pull` (docker-registry, user `k8s-pull`)    |

The LoadBalancer IP is pinned so the Cloudflare tunnel mapping never has to
change. Keep it distinct from the other homelab apps (finance `.241`,
quephase `.240`).

## Files

| Path                        | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `deploy.sh`                 | build + push + apply + rollout wait + health check  |
| `k8s/namespace.yaml`        | `keresifon` namespace (applied out-of-band)         |
| `k8s/deployment.yaml`       | 2 replicas, non-root, read-only rootfs, probes on `/` |
| `k8s/service.yaml`          | LoadBalancer with the pinned LAN IP                 |
| `k8s/kustomization.yaml`    | bundles deployment + service (no namespace)         |
| `ci/rbac.yaml`              | least-privilege `github-deployer` ServiceAccount    |
| `ci/make-kubeconfig.sh`     | emits the deployer kubeconfig for the CI secret     |
| `ci/README.md`              | one-time CI / RBAC / runner setup                   |

## Local deploy (from the Mac)

Prerequisites:

- Docker with `buildx`, logged in to `nexus-lan.keresifon.com`.
- `kubectl` with an **admin** kubeconfig at `~/homelab-k8s/kubeconfig`
  (or set `KUBECONFIG`).
- The `k8s-pull` registry password stored once in the macOS Keychain:
  ```bash
  security add-generic-password -s nexus-k8s-pull -a k8s-pull -w
  ```

Commands:

```bash
deploy/deploy.sh            # build + push + roll out (default)
deploy/deploy.sh build      # build + push only
deploy/deploy.sh apply      # roll out an existing tag (TAG=... or current SHA)
deploy/deploy.sh secrets    # create/refresh the namespace + nexus-pull secret
```

Useful overrides (env vars): `TAG`, `REGISTRY`, `IMAGE`, `APP_URL`,
`KUBECONFIG`, `SYNC_SECRETS=0` (skip namespace/secret management).

## Image tags

`deploy.sh` tags each build with the short git SHA and renders the manifest with
that tag at apply time, so a rollout never silently reverts to the tag committed
in `k8s/deployment.yaml`. To redeploy a known-good image:

```bash
TAG=<sha> deploy/deploy.sh apply
```

## Rollback

```bash
kubectl -n keresifon rollout undo deploy/keresifon          # previous revision
kubectl -n keresifon rollout undo deploy/keresifon --to-revision=N
# or redeploy a specific image:
TAG=<known-good-sha> deploy/deploy.sh apply
```

## CI deploy

Merges to `main` trigger `.github/workflows/deploy.yml`, which runs this same
script on the homelab self-hosted runner with `SYNC_SECRETS=0`. See
[`ci/README.md`](ci/README.md) for the one-time admin setup (namespace, pull
secret, RBAC, kubeconfig secret, runner).
