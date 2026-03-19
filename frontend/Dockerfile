# 1. Estágio de Dependências
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copia apenas os arquivos de manifesto para aproveitar o cache
COPY package.json bun.lock ./

# Instalação com --frozen-lockfile garante que as versões sejam idênticas ao seu dev
RUN bun install --frozen-lockfile

# 2. Estágio de Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Traz as node_modules do estágio anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria e roda o build
ENV ASTRO_TELEMETRY_DISABLED=1
RUN bun run build

# 3. Estágio de Produção (Imagem Final super leve)
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# O Astro 6 + Adaptador Node lê estas ENVs automaticamente
ENV HOST=0.0.0.0
ENV PORT=4321

# Segurança: Usuário sem privilégios
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001 -G nodejs

# Copia apenas o resultado do build
COPY --from=builder --chown=astro:nodejs /app/dist ./dist

USER astro

EXPOSE 4321

# Execução direta com Bun para melhor performance de SSR
CMD ["bun", "./dist/server/entry.mjs"]