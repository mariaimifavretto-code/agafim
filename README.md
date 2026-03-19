# AGAFIM Website (Astro + Payload CMS)

Este repositório contém o website da AGAFIM (Associação Gaúcha de Auditores Fiscais da Receita Estadual do Rio Grande do Sul) com:

- `frontend/`: Site criado com **Astro** (server-side rendering, porta interna 4321 → 3000), incluindo navegação responsiva e páginas institucionais
- `agafim-cms/`: **Payload CMS v3.79.1** para gerenciar notícias, denúncias e usuários (porta 3001)
- `docker-compose.yml`: Configuração completa para executar tudo em containers Docker
- `postgres_data/`: Volume para dados PostgreSQL

## 🚀 Como executar

### Opção 1: Docker Compose (Recomendado)

```bash
# Clonar e navegar para o diretório
cd /path/to/agafim

# Construir e iniciar todos os serviços
docker-compose up --build

# Ou executar em background
docker-compose up -d --build
```

**Serviços disponíveis:**
- **Website (Astro)**: http://localhost:3000 (porta interna 4321)
- **Payload CMS Admin**: http://localhost:3001
- **PostgreSQL DB**: localhost:5432

### Opção 2: Desenvolvimento Local

#### Payload CMS (agafim-cms)

```bash
cd agafim-cms
bun install
bun dev
```

#### Frontend (Astro)

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Configuração de ambiente

Para desenvolvimento local, configure as variáveis de ambiente em agafim-cms/ (DATABASE_URL=postgresql://..., etc.):

As variáveis de ambiente já estão configuradas no `docker-compose.yml` para uso em containers (veja DATABASE_URL, PAYLOAD_PUBLIC_SERVER_URL, etc.).

## 🐳 Arquitetura Docker

- **Frontend**: Astro com server-side rendering em Node.js (porta 4321 → 3000), PAYLOAD_URL=http://backend:3001
- **Payload CMS**: v3.79.1 com Next.js admin (porta 3001), conecta ao PostgreSQL
- **DB**: PostgreSQL 15 (service 'db', porta 5432), credenciais payload/sua_senha_aqui
- **Rede**: `agafim-network`
- **Volumes**: `postgres_data` para persistência do banco

## 🛠️ Comandos Docker úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f payload-cms
docker-compose logs -f frontend

# Parar serviços
docker-compose down

# Limpar dados (remove volumes)
docker-compose down -v

# Reconstruir e reiniciar
docker-compose up --build -d
```

## 📁 Estrutura do projeto

```
agafim/
├── frontend/           # Astro frontend (SSR, porta 4321)
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis (ex: Layout, Navbar)
│   │   ├── pages/      # Páginas institucionais (denuncias, noticias, etc.)
│   │   └── lib/        # API client para Payload (api.ts)
│   ├── public/         # Assets estáticos (logo, estatuto PDF)
│   └── Dockerfile
├── agafim-cms/         # Payload CMS v3 + Next.js admin (porta 3001)
│   ├── src/
│   │   ├── collections/ # News, Denuncias, Posts, Users
│   │   ├── app/         # Rotas Next.js (frontend + payload admin)
│   │   └── payload.config.ts
│   ├── Dockerfile
│   └── package.json    # payload@3.79.1, @payloadcms/*
├── docker-compose.yml  # Frontend + payload-cms + db (postgres:15)
├── postgres_data/      # Volume DB persistente
└── README.md
```

## 🎯 Funcionalidades implementadas

- ✅ **Navegação responsiva** com ícones Lucide
- ✅ **Páginas institucionais** populadas com conteúdo do Estatuto
- ✅ **Sistema de notícias** integrado com Payload CMS (collections/News)
- ✅ **Formulário de denúncias** com envio para Payload (collections/Denuncias)
- ✅ **API client** em frontend/src/lib/api.ts para Payload REST/GraphQL
- ✅ **Containerização** completa com Docker
- ✅ **Persistência de dados** via volumes Docker

## 🔄 Próximos passos

- [ ] Configurar provedor de e-mail para notificações de denúncias
- [ ] Implementar sistema de autenticação para área de membros
- [ ] Adicionar mais tipos de conteúdo (eventos, documentos)
- [ ] Configurar CI/CD para deploy automático
- [ ] Otimizar performance e SEO

## � Troubleshooting

### Payload CMS não inicia
- Verifique se a porta 3001 está livre: `lsof -i :3001`
- Verifique DB (porta 5432): `docker-compose logs db`
- Limpe dados: `docker-compose down -v`
- Verifique logs: `docker-compose logs payload-cms`

### Frontend não carrega
- Confirme que payload-cms e db estão rodando: `docker-compose ps`
- Verifique logs: `docker-compose logs frontend`
- Teste conectividade: `curl http://localhost:3000`

### Conflito de portas
- Modifique as portas no `docker-compose.yml` se 3000, 3001 ou 5432 estiverem ocupadas

### Reset completo
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

## 🚀 Deploy em produção

Para deploy em produção:

1. **Configure variáveis de ambiente** para produção (banco PostgreSQL, secrets, etc.)
2. **Configure domínio** no `astro.config.mjs` e `docker-compose.yml`
3. **Adicione SSL** com reverse proxy (nginx, traefik)
4. **Configure backup** do volume `postgres_data`
5. **Monitore logs** e recursos dos containers

### Exemplo de docker-compose.prod.yml
```yaml
version: '3.8'
services:
  frontend:
    environment:
      - SITE_URL=https://www.agafim.rs.gov.br
      - PAYLOAD_URL=http://backend:3001
    # ... resto da configuração
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da AGAFIM e seu uso é restrito aos associados e colaboradores autorizados.
