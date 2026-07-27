# syntax=docker/dockerfile:1

# Multi-stage build for a Next.js standalone production image.

FROM node:20-alpine AS base
# libc6-compat is needed by some native deps (e.g. sharp used by next/image)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# --- Install dependencies ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build the app ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Production runner ---
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output bundles a minimal server + only the node_modules it needs.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
