# Inventory System

Sistema de controle de estoque de insumos para produção industrial, desenvolvido como teste prático para vaga de desenvolvedor júnior na Projedata.

A aplicação permite gerenciar produtos, matérias-primas e as associações entre eles, além de calcular automaticamente quais produtos podem ser produzidos com o estoque disponível, priorizando os de maior valor.

---

## Tecnologias

| Camada      | Tecnologia                                      |
|-------------|------------------------------------------------|
| Back-end    | Java 25 + Quarkus 3.32.1 + Hibernate ORM Panache |
| Banco de dados | Oracle XE 21c (via Docker)                  |
| Migrações   | Flyway                                          |
| Front-end   | React 18 + TypeScript + Vite                   |
| Estado/Data | TanStack React Query v5                        |
| UI          | Tailwind CSS v4 + Radix UI + shadcn/ui         |
| Infra       | Docker + Docker Compose                        |

---

## Estrutura do Projeto

```
inventory-system/
├── inventory-api/                  # Back-end (Quarkus)
│   ├── src/main/java/com/igoralmeida/
│   │   ├── entity/                 # Entidades JPA
│   │   │   ├── Product.java
│   │   │   ├── RawMaterial.java
│   │   │   ├── ProductMaterial.java
│   │   │   └── ProductMaterialId.java
│   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── ProductCreateRequest.java
│   │   │   ├── ProductResponse.java
│   │   │   ├── RawMaterialCreateRequest.java
│   │   │   ├── RawMaterialResponse.java
│   │   │   ├── ProductMaterialRequest.java
│   │   │   ├── ProductMaterialResponse.java
│   │   │   └── ProductionSuggestionResponse.java
│   │   ├── resource/               # Controllers REST (JAX-RS)
│   │   │   ├── ProductResource.java
│   │   │   ├── RawMaterialResource.java
│   │   │   ├── ProductMaterialResource.java
│   │   │   └── ProductionSuggestionResource.java
│   │   ├── service/                # Regras de negócio
│   │   │   ├── ProductService.java
│   │   │   ├── RawMaterialService.java
│   │   │   ├── BillOfMaterialsService.java
│   │   │   └── SuggestionService.java
│   │   └── exception/
│   │       └── ValidationExceptionMapper.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/oracle/
│   │       ├── V1__create_tables.sql
│   │       └── V2__change_ids_to_uuid.sql
│   ├── Dockerfile
│   └── docker-compose.yml          # Sobe todos os serviços
│
└── frontend/                       # Front-end (React)
    ├── src/
    │   ├── app/
    │   │   ├── api/                # Clientes HTTP por recurso
    │   │   │   ├── client.ts
    │   │   │   ├── products.ts
    │   │   │   ├── rawMaterials.ts
    │   │   │   ├── productMaterials.ts
    │   │   │   └── suggestion.ts
    │   │   ├── pages/              # Telas da aplicação
    │   │   │   ├── ProductsPage.tsx
    │   │   │   ├── RawMaterialsPage.tsx
    │   │   │   └── ProductionSuggestionPage.tsx
    │   │   ├── components/
    │   │   │   ├── Layout.tsx
    │   │   │   └── ui/             # Componentes base (Radix + shadcn)
    │   │   ├── types.ts
    │   │   ├── routes.ts
    │   │   └── App.tsx
    │   └── styles/
    ├── Dockerfile
    └── nginx.conf
```

---

## Banco de Dados

O schema é criado e versionado pelo **Flyway** automaticamente na inicialização do back-end.

### Tabelas

#### `PRODUCT`
| Coluna | Tipo              | Descrição                     |
|--------|-------------------|-------------------------------|
| ID     | VARCHAR2(36) PK   | UUID gerado pela aplicação    |
| NAME   | VARCHAR2(255)     | Nome do produto               |
| PRICE  | NUMBER(19,4)      | Valor unitário (>= 0)         |

#### `RAW_MATERIAL`
| Coluna         | Tipo              | Descrição                          |
|----------------|-------------------|------------------------------------|
| ID             | VARCHAR2(36) PK   | UUID gerado pela aplicação         |
| NAME           | VARCHAR2(255)     | Nome da matéria-prima              |
| STOCK_QUANTITY | NUMBER(19,4)      | Quantidade em estoque (>= 0)       |

#### `PRODUCT_MATERIAL` (Bill of Materials)
| Coluna            | Tipo              | Descrição                                          |
|-------------------|-------------------|----------------------------------------------------|
| PRODUCT_ID        | VARCHAR2(36) FK   | Referência para PRODUCT (ON DELETE CASCADE)        |
| RAW_MATERIAL_ID   | VARCHAR2(36) FK   | Referência para RAW_MATERIAL (ON DELETE CASCADE)   |
| REQUIRED_QUANTITY | NUMBER(19,4)      | Quantidade necessária por unidade do produto (> 0) |

**Chave primária composta**: `(PRODUCT_ID, RAW_MATERIAL_ID)`

---

## API REST

Base URL: `http://localhost:8080/api`

### Produtos — `/api/products`

| Método | Endpoint            | Descrição                        |
|--------|---------------------|----------------------------------|
| GET    | `/api/products`     | Lista todos os produtos          |
| GET    | `/api/products/{id}`| Busca produto por ID             |
| POST   | `/api/products`     | Cria novo produto                |
| PUT    | `/api/products/{id}`| Atualiza produto existente       |
| DELETE | `/api/products/{id}`| Remove produto                   |

**Payload (POST/PUT):**
```json
{
  "name": "Produto A",
  "price": 150.00
}
```

### Matérias-Primas — `/api/raw-materials`

| Método | Endpoint                 | Descrição                           |
|--------|--------------------------|-------------------------------------|
| GET    | `/api/raw-materials`     | Lista todas as matérias-primas      |
| GET    | `/api/raw-materials/{id}`| Busca matéria-prima por ID          |
| POST   | `/api/raw-materials`     | Cria nova matéria-prima             |
| PUT    | `/api/raw-materials/{id}`| Atualiza matéria-prima existente    |
| DELETE | `/api/raw-materials/{id}`| Remove matéria-prima                |

**Payload (POST/PUT):**
```json
{
  "name": "Aço Inox",
  "stockQuantity": 500.00
}
```

### Bill of Materials — `/api/products/{productId}/materials`

| Método | Endpoint                                                   | Descrição                                          |
|--------|------------------------------------------------------------|----------------------------------------------------|
| GET    | `/api/products/{productId}/materials`                      | Lista matérias-primas associadas ao produto        |
| POST   | `/api/products/{productId}/materials`                      | Adiciona matéria-prima ao produto                  |
| PUT    | `/api/products/{productId}/materials/{rawMaterialId}`      | Atualiza quantidade necessária                     |
| DELETE | `/api/products/{productId}/materials/{rawMaterialId}`      | Remove associação                                  |

**Payload (POST/PUT):**
```json
{
  "rawMaterialId": "uuid-da-materia-prima",
  "requiredQuantity": 2.5
}
```

### Sugestão de Produção — `/api/production/suggestion`

| Método | Endpoint                       | Descrição                                               |
|--------|--------------------------------|---------------------------------------------------------|
| GET    | `/api/production/suggestion`   | Retorna sugestão de produção com receita total estimada |

**Resposta:**
```json
{
  "suggestions": [
    {
      "productId": "uuid",
      "productName": "Produto A",
      "quantity": 10,
      "unitPrice": 150.00
    }
  ],
  "totalRevenue": 1500.00
}
```

---

## Algoritmo de Sugestão de Produção

O sistema determina quais produtos produzir e em que quantidade usando o seguinte algoritmo (implementado em `SuggestionService.java`):

1. **Ordenação por valor**: todos os produtos são ordenados pelo preço unitário em ordem decrescente (produtos mais caros têm prioridade).
2. **Cálculo da quantidade máxima**: para cada produto, calcula-se a maior quantidade inteira produzível com o estoque atual — limitada pela matéria-prima mais escassa entre as necessárias.
3. **Dedução do estoque**: após sugerir a produção de um produto, as quantidades de matéria-prima são deduzidas do estoque virtual, afetando os cálculos dos produtos subsequentes.
4. **Receita total**: soma do `preço × quantidade` de todos os produtos sugeridos.

Dessa forma, a resposta maximiza o valor gerado priorizando os produtos mais caros, dentro das restrições do estoque disponível.

---

## Requisitos Atendidos

### Requisitos Não Funcionais

| Requisito | Descrição                                                    | Status |
|-----------|--------------------------------------------------------------|--------|
| RNF001    | Plataforma Web (Chrome, Firefox, Edge)                       | ✅     |
| RNF002    | Separação back-end (API) e front-end                         | ✅     |
| RNF003    | Front-end responsivo                                         | ✅     |
| RNF004    | Persistência em SGBD — Oracle XE 21c                        | ✅     |
| RNF005    | Back-end com Quarkus                                         | ✅     |
| RNF006    | Front-end com React                                          | ✅     |
| RNF007    | Código em inglês (back-end, front-end, tabelas e colunas)    | ✅     |

### Requisitos Funcionais

| Requisito | Descrição                                                              | Status |
|-----------|------------------------------------------------------------------------|--------|
| RF001     | CRUD de produtos no back-end                                           | ✅     |
| RF002     | CRUD de matérias-primas no back-end                                    | ✅     |
| RF003     | CRUD de associação produto ↔ matéria-prima no back-end                 | ✅     |
| RF004     | Consulta de sugestão de produção com base no estoque                   | ✅     |
| RF005     | Interface gráfica para CRUD de produtos no front-end                   | ✅     |
| RF006     | Interface gráfica para CRUD de matérias-primas no front-end            | ✅     |
| RF007     | Interface para associar matérias-primas a produtos (dentro da tela de produtos) | ✅ |
| RF008     | Interface para listar sugestão de produção e receita total             | ✅     |

---

## Como Rodar com Docker

Todos os serviços (Oracle, back-end e front-end) são gerenciados pelo `docker-compose.yml` localizado dentro de `inventory-api/`.

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado e em execução
- [Docker Compose](https://docs.docker.com/compose/) (incluso no Docker Desktop)

### Subindo a aplicação

```bash
cd inventory-api
docker compose up -d
```

Na primeira execução, o Docker irá:
1. Baixar a imagem `gvenzl/oracle-xe:21-slim-faststart` (~2 GB)
2. Compilar o back-end (Maven multi-stage build)
3. Compilar e servir o front-end (Node + Nginx)

> **Atenção:** o Oracle XE pode levar entre 2 e 5 minutos para inicializar completamente na primeira vez. O back-end aguarda o healthcheck do banco antes de iniciar.

### Acessos

| Serviço    | URL                          |
|------------|------------------------------|
| Front-end  | http://localhost:3000        |
| API        | http://localhost:8080/api    |
| Oracle DB  | localhost:1521 — XEPDB1      |

**Credenciais do banco:**
- Usuário: `system`
- Senha: `oracle`

### Parando os serviços

```bash
docker compose down
```

Para remover também o volume com os dados do banco:

```bash
docker compose down -v
```

### Verificando logs

```bash
# Todos os serviços
docker compose logs -f

# Apenas o back-end
docker compose logs -f backend

# Apenas o banco
docker compose logs -f oracle
```

---

## Desenvolvimento Local (sem Docker)

### Back-end

Requisitos: Java 21+, Maven 3.9+, Oracle acessível.

```bash
cd inventory-api
./mvnw quarkus:dev
```

Configure as variáveis de conexão em `src/main/resources/application-dev.properties`.

### Front-end

Requisitos: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

O front-end em modo dev aponta para `http://localhost:8080/api` por padrão.
