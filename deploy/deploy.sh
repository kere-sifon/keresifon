#!/usr/bin/env bash
# Build, push and roll out keresifon to homelab-k8s.
# Used by GitHub Actions (kere-sifon self-hosted runner) and locally from the Mac.
#   deploy/deploy.sh            build + push + deploy
#   deploy/deploy.sh build      build + push only
#   deploy/deploy.sh apply      deploy an existing tag (TAG=... or current git sha)
#   deploy/deploy.sh secrets    create/refresh the namespace and pull secret only
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

REGISTRY="${REGISTRY:-nexus-lan.keresifon.com}"
IMAGE="${IMAGE:-$REGISTRY/docker-hosted/keresifon}"
NAMESPACE="keresifon"
APP_URL="${APP_URL:-http://192.168.2.242:3000/}"
KEYCHAIN_SERVICE="${KEYCHAIN_SERVICE:-nexus-k8s-pull}"   # macOS Keychain item holding the k8s-pull password
export KUBECONFIG="${KUBECONFIG:-$HOME/homelab-k8s/kubeconfig}"

# Tag = short git sha, with -dirty-<time> when the tree has uncommitted changes.
if [[ -z "${TAG:-}" ]]; then
  TAG="$(git rev-parse --short HEAD)"
  if [[ -n "$(git status --porcelain)" ]]; then TAG="$TAG-dirty-$(date +%Y%m%d%H%M%S)"; fi
fi

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

build() {
  log "Building $IMAGE:$TAG (linux/amd64) and pushing"
  docker buildx build --platform linux/amd64 -t "$IMAGE:$TAG" --push .
}

sync_secrets() {
  if [[ "${SYNC_SECRETS:-1}" == "0" ]]; then
    echo "SYNC_SECRETS=0: leaving cluster secrets as they are"; return 0
  fi
  kubectl apply -f deploy/k8s/namespace.yaml >/dev/null

  # keresifon is a static marketing site with no app env, so only the registry pull secret is needed.
  if ! kubectl -n "$NAMESPACE" get secret nexus-pull >/dev/null 2>&1; then
    log "Creating nexus-pull secret"
    local pw="${NEXUS_PULL_PASSWORD:-}"
    if [[ -z "$pw" ]]; then
      pw="$(security find-generic-password -s "$KEYCHAIN_SERVICE" -w 2>/dev/null)" || {
        echo "No k8s-pull password. Store it once with:"
        echo "  security add-generic-password -s $KEYCHAIN_SERVICE -a k8s-pull -w"
        exit 1
      }
    fi
    kubectl -n "$NAMESPACE" create secret docker-registry nexus-pull \
      --docker-server="$REGISTRY" --docker-username=k8s-pull --docker-password="$pw" >/dev/null
  fi
}

apply() {
  sync_secrets
  log "Applying manifests with image $IMAGE:$TAG"
  # Render once with the new tag so the Deployment never rolls back to the tag in git.
  kubectl kustomize deploy/k8s \
    | sed -E "s#(image: )$IMAGE:[^[:space:]]+#\1$IMAGE:$TAG#" \
    | kubectl apply -f -

  log "Waiting for rollout"
  if ! kubectl -n "$NAMESPACE" rollout status deploy/keresifon --timeout=5m; then
    echo "Rollout failed. Recent events:"
    kubectl -n "$NAMESPACE" get events --sort-by=.lastTimestamp | tail -15
    echo "Roll back with: kubectl -n $NAMESPACE rollout undo deploy/keresifon"
    exit 1
  fi

  log "Health check $APP_URL"
  for _ in {1..10}; do
    if curl -fsS -o /dev/null "$APP_URL"; then echo "OK: $IMAGE:$TAG is live"; return 0; fi
    sleep 3
  done
  echo "Health check failed"; exit 1
}

case "${1:-all}" in
  build)   build ;;
  secrets) sync_secrets ;;
  apply)   apply ;;
  all)     build; apply ;;
  *) echo "usage: $0 [all|build|apply|secrets]"; exit 2 ;;
esac
