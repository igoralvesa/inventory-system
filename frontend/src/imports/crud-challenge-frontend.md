Quero gerar um frontend WEB muito simples (sem invenções) para um desafio de CRUD. O backend já está pronto. O foco é funcionalidade e código limpo.

Tech stack obrigatório

React + TypeScript

Projeto rodando com Bun:

usar bun install e bun dev

Pode usar Vite como bundler (normal), mas Bun é o runtime/package manager.

HTTP client via TanStack Query para todas as chamadas.

Estilo: simples. Use shadcn/ui apenas quando necessário (Button, Input, Dialog/Modal, Table, Toast). Nada de design exagerado.

Sem Redux.

Backend

Base URL: http://localhost:8080/api

CORS liberado para qualquer client em dev

Content-Type: application/json

IDs: UUID string

Decimais: enviar como número (ex.: 99.90, 2.5)

Erros:

400 (validation): mostrar mensagem simples no UI

404: mostrar mensagem simples

DELETE: 204 sem body

Páginas / Rotas

/raw-materials

/products

/production-suggestion

Layout: header simples + navegação (links para as 3 páginas). Responsividade básica.

Tipos / DTOs (use exatamente)
RawMaterial

Create/Update body: { name: string; stockQuantity: number }

Response: { id: string; name: string; stockQuantity: number }

Product

Create/Update body: { name: string; price: number }

Response: { id: string; name: string; price: number }

ProductMaterial (BOM)

Base path: /products/{productId}/materials

POST body: { rawMaterialId: string; requiredQuantity: number }

PUT body: mesmo do POST

Response item: { rawMaterialId: string; rawMaterialName: string; requiredQuantity: number }

Production Suggestion

GET /production/suggestion response:
{ suggestedProduction: { productId: string; productName: string; quantity: number; unitPrice: number }[]; totalRevenue: number }

Endpoints (use exatamente)

Raw Materials:

GET /raw-materials

GET /raw-materials/{id}

POST /raw-materials

PUT /raw-materials/{id}

DELETE /raw-materials/{id}

Products:

GET /products

GET /products/{id}

POST /products

PUT /products/{id}

DELETE /products/{id}

Product Materials:

GET /products/{productId}/materials

POST /products/{productId}/materials

PUT /products/{productId}/materials/{rawMaterialId}

DELETE /products/{productId}/materials/{rawMaterialId}

Suggestion:

GET /production/suggestion

UI requirements by page
1) Raw Materials

Listagem em tabela (GET /raw-materials)

Form simples para criar

Editar (pode ser modal com campos preenchidos)

Deletar com confirmação (Dialog ou confirm)

Campos:

name (obrigatório)

stockQuantity (number >= 0)

2) Products

Listagem em tabela (GET /products)

Form create/edit/delete

Ao abrir “Edit” do produto, incluir uma seção “Materials (BOM)” na mesma tela/modal (não precisa página separada):

listar materiais do produto (GET materials)

adicionar material (POST)

atualizar requiredQuantity (PUT)

remover (DELETE)

Para adicionar: dropdown/select com raw materials disponíveis (GET /raw-materials)

Campos produto:

name (obrigatório)

price (number >= 0)

Campos BOM:

rawMaterialId (selecionado)

requiredQuantity (number > 0)

3) Production Suggestion

Ao entrar, carregar automaticamente (TanStack Query)

Botão “Refresh”

Tabela com: productName, quantity, unitPrice, subtotal (quantity * unitPrice)

Mostrar totalRevenue destacado.

TanStack Query (obrigatório)

useQuery para:

raw materials list

products list

materials list por productId

production suggestion

useMutation para create/update/delete.

Após mutation, invalidate as queries relevantes:

raw materials list

products list

product materials do product

suggestion (quando mudar stock ou BOM)

Organização do código (clean)

src/api/client.ts: wrapper de fetch com JSON + tratamento de erro (lançar erro com mensagem)

src/api/rawMaterials.ts, products.ts, productMaterials.ts, suggestion.ts

src/pages/*

src/components/*

src/types.ts

Evitar overengineering: sem camadas extras desnecessárias.

Entregável

Projeto pronto para rodar localmente com:

bun install

bun dev

Sem placeholders fake: chamar a API real nos endpoints acima.