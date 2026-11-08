#!/usr/bin/env bash
# Generate a least-privilege kubeconfig for the github-deployer ServiceAccount and
# print it to stdout. Run this with your ADMIN kubeconfig active (it reads the SA
# token secret created by rbac.yaml). Store the result as the KUBECONFIG_HOMELAB
# GitHub secret, base64-encoded:
#
#   deploy/ci/make-kubeconfig.sh | base64 | gh secret set KUBECONFIG_HOMELAB
#
# If the runner reaches the cluster on a different address than your admin context,
# override it:  API_SERVER=https://192.168.2.10:6443 deploy/ci/make-kubeconfig.sh
set -euo pipefail

NAMESPACE="${NAMESPACE:-keresifon}"
SA="${SA:-github-deployer}"
SECRET="${SECRET:-github-deployer-token}"
CLUSTER_NAME="${CLUSTER_NAME:-homelab-k8s}"

# API server the GitHub runner will reach. Defaults to the current kubeconfig's.
API_SERVER="${API_SERVER:-$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.server}')}"
[ -n "$API_SERVER" ] || { echo "Could not determine API server; set API_SERVER=..." >&2; exit 1; }

# The token controller populates the secret moments after rbac.yaml is applied.
token=""
for _ in $(seq 1 10); do
  token="$(kubectl -n "$NAMESPACE" get secret "$SECRET" -o jsonpath='{.data.token}' 2>/dev/null | base64 -d || true)"
  [ -n "$token" ] && break
  sleep 2
done
[ -n "$token" ] || {
  echo "Secret $NAMESPACE/$SECRET has no token. Did you 'kubectl apply -f deploy/ci/rbac.yaml'?" >&2
  exit 1
}

# ca.crt is already base64 in the secret — exactly what certificate-authority-data wants.
ca="$(kubectl -n "$NAMESPACE" get secret "$SECRET" -o jsonpath='{.data.ca\.crt}')"
[ -n "$ca" ] || { echo "Secret $NAMESPACE/$SECRET has no ca.crt" >&2; exit 1; }

cat <<EOF
apiVersion: v1
kind: Config
clusters:
  - name: ${CLUSTER_NAME}
    cluster:
      server: ${API_SERVER}
      certificate-authority-data: ${ca}
users:
  - name: ${SA}
    user:
      token: ${token}
contexts:
  - name: ${SA}@${CLUSTER_NAME}
    context:
      cluster: ${CLUSTER_NAME}
      user: ${SA}
      namespace: ${NAMESPACE}
current-context: ${SA}@${CLUSTER_NAME}
EOF
