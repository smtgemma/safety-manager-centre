# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24
ARG PNPM_VERSION=10.28.1

# ── base ──────────────────────────────────────────────────────────────────────
# Debian slim (glibc) on purpose: Next standalone + google's native deps are
# best-trodden on glibc, and this avoids needing build tools on the VPS.
FROM node:${NODE_VERSION}-slim AS base
# pnpm is installed from npm rather than corepack so the build does not depend
# on corepack still shipping with the chosen Node release.
RUN npm install -g pnpm@${PNPM_VERSION}
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

# ── deps ──────────────────────────────────────────────────────────────────────
# Manifests only, so this layer is reused whenever the lockfile is unchanged.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ── builder ───────────────────────────────────────────────────────────────────
# Deliberately built with NO credentials: secrets are injected at runtime via
# compose `env_file`, so rebuilding the image never needs the Google service key.
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ── runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Long options only: this base image's adduser 3.134 treats -g (gecos/gid/group)
# and -S (shell/system) as ambiguous and exits non-zero, which fails the build.
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs nextjs

# standalone output does not copy public/ or .next/static itself, so they have to
# be placed alongside the generated server.js by hand.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
