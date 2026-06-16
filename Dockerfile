# syntax=docker/dockerfile:1

# ---------- Base ----------
# Debian slim (glibc): compatible con los binarios prebuilt de varias deps.
FROM node:20-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---------- Dependencias ----------
FROM base AS deps
# Solo manifiestos primero para aprovechar la cache de capas.
COPY package.json pnpm-lock.yaml ./
# Sin `--mount=type=cache`: Railway rechaza ids de cache arbitrarios. Era solo
# una optimización de velocidad, no un requisito.
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM base AS build
# Variables públicas: Next las "inlinea" en tiempo de build, así que hay que
# pasarlas como --build-arg (en Railway: Variables de build del servicio).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_CLOUDINARY_UPLOAD_PRESET
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_CLOUDINARY_UPLOAD_PRESET=$NEXT_CLOUDINARY_UPLOAD_PRESET
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---------- Runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Output "standalone": server mínimo autocontenido + estáticos + public.
COPY --chown=node:node --from=build /app/.next/standalone ./
COPY --chown=node:node --from=build /app/.next/static ./.next/static
COPY --chown=node:node --from=build /app/public ./public

USER node
EXPOSE 3000

# Healthcheck: la home responde 200 (sin curl/wget, usamos node).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000)+'/',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
