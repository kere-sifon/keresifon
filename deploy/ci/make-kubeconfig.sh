#!/usr/bin/env bash
# Prints a kubeconfig for the github-deployer service account, base64-encoded for the
# KUBE_CONFIG_B64 GitHub secret. Run with your admin kubeconfig:
#   deploy/ci/make-kubeconfig.sh | gh secret set KUBE_CONFIG_B64 -R kere-sifon/keresifon
# Override API_SERVER if the runner reaches the cluster on a different address.
set -euo pipefail
export KUBECONFIG="${KUBECONFIG:-$HOME/homelab-k8s/kubeconfig}"
NS=keresifon
SECRET=github-deployer-token

SERVER="${API_SERVER:-$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')}"
[ -n "$SERVER" ] || { echo "Could not determine API server; set API_SERVER=..." >&2; exit 1; }

# The token controller populates the secret moments after rbac.yaml is applied.
TOKEN=""
for _ in $(seq 1 10); do
  TOKEN="$(kubectl -n "$NS" get secret "$SECRET" -o jsonpath='{.data.token}' 2>/dev/null | base64 --decode || true)"
  [ -n "$TOKEN" ] && break
  sleep 2
done
[ -n "$TOKEN" ] || {
  echo "Secret $NS/$SECRET has no token. Did you 'kubectl apply -f deploy/ci/rbac.yaml'?" >&2
  exit 1
}
# ca.crt is already base64 in the secret — exactly what certificate-authority-data wants.
CA="$(kubectl -n "$NS" get secret "$SECRET" -o jsonpath='{.data.ca\.crt}')"

cat <<KCFG | base64 | tr -d '\n'
apiVersion: v1
kind: Config
clusters:
  - name: homelab
    cluster:
      server: $SERVER
      certificate-authority-data: $CA
users:
  - name: github-deployer
    user:
      token: $TOKEN
contexts:
  - name: github-deployer@homelab
    context: {cluster: homelab, user: github-deployer, namespace: $NS}
current-context: github-deployer@homelab
KCFG
