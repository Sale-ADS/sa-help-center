# syntax=docker/dockerfile:1.7

# ---- deps: install npm dependencies with cache ----
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Native build toolchain for sharp / @takumi-rs/image-response
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts


# ---- builder: compile MDX + Next.js build ----
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# fumadocs-mdx precompiles content/, then next build produces .next/standalone
RUN npx fumadocs-mdx && npm run build


# ---- runner: minimal runtime image ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ARG GIT_COMMIT_SHA=unknown
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV GIT_COMMIT_SHA=${GIT_COMMIT_SHA}

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
