# AGAFIM Website (Astro + Payload CMS)

Este repositório contém o website da AGAFIM (Associação Gaúcha de Auditores Fiscais da Receita Estadual do Rio Grande do Sul) com:

- `frontend/`: Site criado com **Astro** (server-side rendering), incluindo navegação responsiva e páginas institucionais
- `agafim-cms/`: **Payload CMS** para gerenciar notícias, denúncias e usuários
- `docker-compose.yml`: Configuração completa para executar tudo em containers Docker

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
- **Website**: http://localhost:3000

### Opção 2: Desenvolvimento Local

#### Backend (Payload CMS)

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

Para desenvolvimento local, copie o arquivo de exemplo de variáveis de ambiente:

```bash
cd backend
cp .env.example .env
```

As variáveis de ambiente já estão configuradas no `docker-compose.yml` para uso em containers.

## 🐳 Arquitetura Docker

- **Frontend**: Astro com server-side rendering, executando em Node.js
- **Backend**: Strapi v5 com SQLite (dados persistidos em volume Docker)
- **Rede**: Comunicação interna entre containers via `agafim-network`
- **Volumes**: Dados do banco persistem em `backend_data`

## 🛠️ Comandos Docker úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
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
├── frontend/           # Astro frontend
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── pages/      # Páginas do site
│   │   └── lib/        # Utilitários e API
│   ├── public/         # Assets estáticos
│   └── Dockerfile
├── backend/            # Strapi CMS
│   ├── src/
│   │   └── api/        # Content Types e rotas
│   ├── config/         # Configurações Strapi
│   └── Dockerfile
├── docker-compose.yml  # Configuração Docker
└── README.md
```

## 🎯 Funcionalidades implementadas

- ✅ **Navegação responsiva** com ícones Lucide
- ✅ **Páginas institucionais** populadas com conteúdo do Estatuto
- ✅ **Sistema de notícias** integrado com Strapi
- ✅ **Formulário de denúncias** com envio para Strapi
- ✅ **API REST** para integração frontend/backend
- ✅ **Containerização** completa com Docker
- ✅ **Persistência de dados** via volumes Docker

## 🔄 Próximos passos

- [ ] Configurar provedor de e-mail para notificações de denúncias
- [ ] Implementar sistema de autenticação para área de membros
- [ ] Adicionar mais tipos de conteúdo (eventos, documentos)
- [ ] Configurar CI/CD para deploy automático
- [ ] Otimizar performance e SEO

## � Troubleshooting

### Backend não inicia
- Verifique se a porta 1337 está livre: `lsof -i :1337`
- Limpe os dados do banco: `docker-compose down -v`
- Verifique logs: `docker-compose logs backend`

### Frontend não carrega
- Confirme que o backend está rodando: `docker-compose ps`
- Verifique logs do frontend: `docker-compose logs frontend`
- Teste conectividade: `curl http://localhost:3000`

### Conflito de portas
- Modifique as portas no `docker-compose.yml` se 3000 ou 1337 estiverem ocupadas

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
4. **Configure backup** do volume `backend_data`
5. **Monitore logs** e recursos dos containers

### Exemplo de docker-compose.prod.yml
```yaml
version: '3.8'
services:
  frontend:
    environment:
      - SITE_URL=https://www.agafim.rs.gov.br
      - STRAPI_URL=http://backend:1337
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
