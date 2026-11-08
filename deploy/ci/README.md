# CI deploy pipeline

`.github/workflows/deploy.yml` builds the image, pushes it to the homelab Nexus
registry, and rolls it out to **homelab-k8s** on every merge to `main`. It runs
on the org's self-hosted runner **`gh-runner-02`** on the home LAN
(`runs-on: [self-hosted, linux, x64, homelab]`), because GitHub-hosted runners
can't reach Nexus or the cluster API.

```
merge to main ──► gh-runner-02 (LAN)
                    ├─ docker login nexus-lan.keresifon.com
                    ├─ deploy/deploy.sh all   (SYNC_SECRETS=0)
                    │    ├─ docker buildx build --platform linux/amd64 --push
                    │    ├─ kubectl apply -k deploy/k8s   (as github-deployer)
                    │    └─ rollout status + curl health check
                    └─ remove kubeconfig, docker logout
```

## Security model

The runner authenticates as the **`github-deployer`** ServiceAccount, whose Role
(`rbac.yaml`) is namespaced to `keresifon` and can manage only Deployments,
ReplicaSets, and Services, and read Pods/logs/events. It **cannot read or write
Secrets** and has **no cluster-scoped rights**. Because of that, the pipeline runs
with `SYNC_SECRETS=0`: the namespace and the `nexus-pull` image-pull secret are
created once from the Mac, not by CI.

This repo is **public** and the runner sits on the LAN. A fork PR can add its own
workflow targeting the runner, so keep fork-PR workflows on "Require approval for
all outside collaborators" (or restrict `gh-runner-02`'s runner group to selected
repositories).

## One-time setup (from the Mac, admin kubeconfig)

```bash
export KUBECONFIG="$HOME/homelab-k8s/kubeconfig"

# 1. Namespace + nexus-pull secret (password from the nexus-k8s-pull Keychain item)
deploy/deploy.sh secrets

# 2. Deployer identity and its token
kubectl apply -f deploy/ci/rbac.yaml

# 3. Deployer kubeconfig -> GitHub secret (the script base64-encodes it)
deploy/ci/make-kubeconfig.sh | gh secret set KUBE_CONFIG_B64 -R kere-sifon/keresifon

# 4. Nexus push credentials (user with docker-hosted-push; prompts for the password)
gh secret set NEXUS_PUSH_USER     -R kere-sifon/keresifon --body kere-docker
gh secret set NEXUS_PUSH_PASSWORD -R kere-sifon/keresifon
```

Then push to `main`, or run the **Deploy** workflow manually.

## GitHub secrets

| Secret                | What it is                                                     |
| --------------------- | -------------------------------------------------------------- |
| `KUBE_CONFIG_B64`     | base64 `github-deployer` kubeconfig (from `make-kubeconfig.sh`) |
| `NEXUS_PUSH_USER`     | Nexus user with push access to `docker-hosted`                 |
| `NEXUS_PUSH_PASSWORD` | password for that user                                         |

The `k8s-pull` password is **not** stored in GitHub; the pull secret is managed
from the Mac (step 1).

## Manual / targeted deploys

`deploy.yml` also has a `workflow_dispatch` trigger. Leave `tag` blank to build
the current commit, or pass an existing tag to roll it out without rebuilding
(`TAG=<tag> deploy/deploy.sh apply`).

## Rotating the deployer credentials

- **Kubeconfig / token**:
  ```bash
  kubectl -n keresifon delete secret github-deployer-token
  kubectl apply -f deploy/ci/rbac.yaml
  deploy/ci/make-kubeconfig.sh | gh secret set KUBE_CONFIG_B64 -R kere-sifon/keresifon
  ```
- **Nexus password**: update it in Nexus, then re-run
  `gh secret set NEXUS_PUSH_PASSWORD -R kere-sifon/keresifon`.

## Troubleshooting

- **`Username and password required`** at Nexus login → `NEXUS_PUSH_USER` /
  `NEXUS_PUSH_PASSWORD` are not set on this repo (step 4).
- **Job never starts** → `gh-runner-02` is offline, or its runner group doesn't
  include this repo.
- **`forbidden` on apply** → RBAC not applied, or the kubeconfig points at the
  wrong namespace/cluster; re-run steps 2–3.
- **`ImagePullBackOff`** → the `nexus-pull` secret is missing or wrong (step 1).
- **Push denied** → the push user lacks `docker-hosted-push`.
