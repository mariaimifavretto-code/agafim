# 1. Estágio de Dependências
FROM oven/bun:1-alpine AS deps
# Adiciona dependências necessárias para pacotes nativos
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 2. Estágio de Build
FROM oven/bun:1-alpine AS builder
# build-base e vips-dev são CRÍTICOS para o sharp (processamento de fotos)
RUN apk add --no-cache vips-dev build-base

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# O Payload 3.0 gera o build via Next.js
RUN bun run build

# 3. Estágio de Produção
FROM oven/bun:1-alpine AS runner
# vips é necessário em runtime para o processamento de imagens continuar funcionando
RUN apk add --no-cache vips
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 payloadjs

# No modo standalone, o Next.js copia as dependências necessárias para esta pasta
COPY --from=builder /app/public* ./public/
COPY --from=builder --chown=payloadjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=payloadjs:nodejs /app/.next/static ./.next/static

USER payloadjs

EXPOSE 3001

# O Next.js standalone gera um server.js que engloba o Payload
CMD ["bun", "server.js"]