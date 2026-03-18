# Baseado no exemplo oficial do Next.js adaptado para Bun
# Para funcionar, mantenha `output: 'standalone'` no seu next.config.mjs

FROM oven/bun:1-alpine AS base

# 1. Instalar dependências apenas quando necessário
FROM base AS deps
# libc6-compat é necessária para algumas bibliotecas nativas no Alpine
RUN apk add --no-cache libc6-compat 
RUN apk add --no-cache nodejs npm
WORKDIR /app

# Copia os arquivos de definição de pacotes e o lockfile do Bun
COPY package.json bun.lock* yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f bun.lock ]; then bun install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile não encontrado. Para garantir builds reproduzíveis, use um lockfile." && exit 1; \
  fi

# 2. Rebuild do código-fonte
FROM base AS builder
RUN apk add --no-cache vips-dev build-base

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria se desejar
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f bun.lock ]; then bun run build; \
  elif [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile não encontrado." && exit 1; \
  fi

# 3. Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1 

# Criação de usuário para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public* ./public/
# Set das permissões para o cache do Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Aproveita o output standalone para reduzir o tamanho da imagem
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001
ENV PORT=3001

# No standalone, o Next gera um server.js. 
# Podemos rodar com 'bun server.js' para máxima performance.
CMD ["bun", "server.js"]