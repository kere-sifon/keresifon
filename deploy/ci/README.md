# CI deploy pipeline

`.github/workflows/deploy.yml` builds the image, pushes it to the homelab Nexus
registry, and rolls it out to **homelab-k8s** on every merge to `main` — running
on a **self-hosted runner** on the home LAN.

```
merge to main ──► self-hosted runner
                    ├─ docker login nexus-lan.keresifon.com
                    ├─ deploy/deploy.sh all   (SYNC_SECRETS=0)
                    │    ├─ docker buildx build --platform linux/amd64 --push
                    │    ├─ kubectl apply -k deploy/k8s   (as github-deployer)
                    │    └─ rollout status + curl health check
                    └─ remove kubeconfig
```

## Security model

The runner authenticates as the **`github-deployer`** ServiceAccount, whose Role
(`rbac.yaml`) is namespaced to `keresifon` and can manage only Deployments,
ReplicaSets, and Services, and read Pods/logs/events. It **cannot read or write
Secrets** and has **no cluster-scoped rights**. Because of that, the pipeline runs
with `SYNC_SECRETS=0`: the namespace and the `nexus-pull` image-pull secret are
created once by an admin, not by CI.

## One-time setup (admin)

Run these with your **admin** kubeconfig.

1. **Namespace + pull secret** — either run the script locally once:
   ```bash
   deploy/deploy.sh secrets
   ```
   (creates the `keresifon` namespace and the `nexus-pull` docker-registry secret
   from the `nexus-k8s-pull` Keychain item), or create them by hand with
   `kubectl apply -f deploy/k8s/namespace.yaml` and
   `kubectl -n keresifon create secret docker-registry nexus-pull ...`.

2. **RBAC** — create the deployer identity and its token:
   ```bash
   kubectl apply -f deploy/ci/rbac.yaml
   ```

3. **Deployer kubeconfig → GitHub secret**:
   ```bash
   deploy/ci/make-kubeconfig.sh | base64 | gh secret set KUBECONFIG_HOMELAB
   # If the runner reaches the API server on a different address:
   #   API_SERVER=https://192.168.2.10:6443 deploy/ci/make-kubeconfig.sh | base64 | gh secret set KUBECONFIG_HOMELAB
   ```

4. **Nexus push credentials → GitHub secrets** (a user allowed to push to
   `docker-hosted`):
   ```bash
   gh secret set NEXUS_USERNAME --body '<push-user>'
   gh secret set NEXUS_PASSWORD --body '<push-password>'
   ```

5. **Self-hosted runner** — register a runner with the labels
   **`self-hosted`** and **`homelab`** (matching `runs-on` in `deploy.yml`). It
   must have:
   - Docker with `buildx`, trusting `nexus-lan.keresifon.com`'s TLS cert;
   - `kubectl`;
   - LAN access to the Nexus registry, the cluster API server, and
     `192.168.2.242:3000` (the health check).

## GitHub secrets

| Secret              | What it is                                                    |
| ------------------- | ------------------------------------------------------------- |
| `KUBECONFIG_HOMELAB`| base64 of the `github-deployer` kubeconfig (from `make-kubeconfig.sh`) |
| `NEXUS_USERNAME`    | Nexus user with push access to `docker-hosted`                |
| `NEXUS_PASSWORD`    | password for that user                                        |

`NEXUS_PULL_PASSWORD` is **not** needed in CI — the pull secret is managed
out-of-band (see step 1).

## Manual / targeted deploys

`deploy.yml` also has a `workflow_dispatch` trigger. Leave `tag` blank to build
the current commit, or pass an existing tag to roll it out without rebuilding
(maps to `TAG=<tag> deploy/deploy.sh apply`).

## Rotating the deployer credentials

- **Kubeconfig / token**: delete and re-apply the token secret, then regenerate:
  ```bash
  kubectl -n keresifon delete secret github-deployer-token
  kubectl apply -f deploy/ci/rbac.yaml
  deploy/ci/make-kubeconfig.sh | base64 | gh secret set KUBECONFIG_HOMELAB
  ```
- **Nexus password**: update it in Nexus, then re-run `gh secret set NEXUS_PASSWORD`.

## Troubleshooting

- **Job never starts** → no runner with both `self-hosted` and `homelab` labels is
  online.
- **`forbidden` on apply** → RBAC not applied, or the kubeconfig points at the
  wrong namespace/cluster; re-run steps 2–3.
- **`ImagePullBackOff`** → the `nexus-pull` secret is missing or wrong (step 1),
  or the runner trusts the registry cert but the nodes don't.
- **Push denied** → `NEXUS_USERNAME`/`NEXUS_PASSWORD` lack push rights to
  `docker-hosted`.
