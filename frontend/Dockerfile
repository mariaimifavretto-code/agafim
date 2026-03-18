# 1. Estágio de Dependências
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copia arquivos de definição de pacotes e o lockfile (formato texto)
COPY package.json bun.lock* ./

# Instalação limpa das dependências
RUN bun install --frozen-lockfile

# 2. Estágio de Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copia as dependências instaladas e o código-fonte
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria do Astro se desejar
ENV ASTRO_TELEMETRY_DISABLED=1

# Gera a pasta ./dist com o adapter node em modo standalone
RUN bun run build

# 3. Estágio de Produção (Imagem Final)
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Configurações de ambiente para o servidor
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Segurança: Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001 -G nodejs

# Copia apenas a pasta dist gerada (onde está o servidor compilado)
COPY --from=builder --chown=astro:nodejs /app/dist ./dist

USER astro

EXPOSE 4321

# O Bun executa o entry point gerado pelo adaptador de Node
# Isso garante performance superior ao Node.js puro
CMD ["bun", "./dist/server/entry.mjs"]