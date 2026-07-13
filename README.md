# 🛡️ Albion Online Market Dashboard

Um painel analítico de inteligência de mercado para o jogo **Albion Online**. A aplicação permite monitorar preços atuais, comparar valores mínimos de venda e máximos de compra entre diferentes cidades e analisar o histórico temporal de flutuação econômica de itens específicos.

Construído sob uma arquitetura modular moderna no ecossistema do Next.js, com tipagem 100% estrita em TypeScript e estilização moderna via Tailwind CSS e Shadcn UI.

---

## 🚀 Funcionalidades Principais

* **Seleção de Servidores Global:** Alternância em tempo real entre os servidores *West (Américas)*, *East (Ásia)* e *Europe*.
* **Busca Otimizada de Itens:** Autocomplete inteligente com suporte a nomes em Português (PT-BR) e identificação automática de Tiers (ex: T4, T8).
* **Tabela de Preços Dinâmica:** Ordenação customizável por colunas, seletor de qualidade por cidade e destaque visual automático para as melhores oportunidades de lucro (menor preço de venda e maior preço de compra).
* **Análise Comparativa em Gráfico:** Gráficos de barras interativos comparando instantaneamente a oferta e a procura entre as principais localizações.
* **Histórico Temporal Econômico:** Gráfico de linha temporal detalhando a flutuação histórica do preço médio e volume de itens de acordo com filtros de cidade e qualidade.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode, Sem uso de `any`)
* **Biblioteca de UI:** [Shadcn UI](https://ui.shadcn.com/) & [Radix Primitives](https://www.radix-ui.com/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Gráficos:** [Recharts](https://recharts.org/)
* **Ícones:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
* **Cliente HTTP:** [Axios](https://axios-http.com/)

---

## 📂 Arquitetura do Projeto

O projeto adota os princípios de separação de responsabilidades (Clean Architecture Principles), descentralizando a página principal e isolando lógicas de negócios de componentes visuais:

```text
src/
├── app/
│   ├── page.tsx               # Orquestrador da visualização principal (View)
│   ├── layout.tsx             # Estrutura e metadados globais da aplicação
│   └── globals.css            # Configurações do Tailwind e variáveis de tema oklch
├── components/
│   ├── MarketHeader/          # Componente do topo (Filtro de servidor e Busca)
│   ├── HistoryTabContent/     # Filtros internos e container do gráfico histórico
│   ├── PriceTable/            # Tabela complexa de ordenação e linhas de dados
│   ├── PriceBarChart/         # Componente wrapper do gráfico de barras atual
│   ├── PriceHistoryChart/     # Componente wrapper do gráfico de linha temporal
│   └── ui/                    # Primitivos reutilizáveis do Shadcn UI (Card, Select, Tabs...)
├── hooks/
│   ├── useMarketData.ts       # Custom hook responsável pelas chamadas de API e manipulação de estados do domínio
│   ├── useItemSearch.ts       # Mecanismo de filtragem e debounce do arquivo local de itens
│   └── useSortableData.ts     # Lógica agnóstica para ordenação algorítmica de tabelas
├── lib/
│   ├── api.ts                 # Integração e assinaturas de chamadas com as APIs do Albion Online
│   ├── searchUtils.ts         # Utilitários para tratamento de Tiers e nomes únicos de itens
│   └── tableUtils.tsx         # Regras de negócio de destaque para lucro e formatação monetária
└── types/
    └── types.ts               # Centralização das interfaces e contratos estritos do TypeScript
```
## 🔧 Configuração e Instalação
Siga os passos abaixo para rodar a aplicação no seu ambiente local:

1. Clonar o Repositório
```text
git clone https://github.com/Diofbjr/albionmarket
cd nome-do-repositorio
```
2. Instalar as Dependências

Recomenda-se a utilização do npm ou yarn em conformidade com o ecossistema do Next.js 15:
```text
npm install
```
3. Base de Dados de Itens (Obrigatório)

Certifique-se de que o arquivo estático contendo os dicionários de itens mapeados (items.json) esteja localizado no diretório correspondente para o funcionamento correto do useItemSearch:
```text
public/data/items.json
```
4. Executar em Ambiente de Desenvolvimento
```text
npm run dev
```
Abra http://localhost:3000 no seu navegador para visualizar o painel.

## 📊 Estrutura de Tipos Consumida (API)
A camada de dados foi projetada para lidar de maneira segura com retornos genéricos e tipagens estritas da API de histórico do Albion. Os principais contratos definidos em src/types/types.ts incluem:

PriceRowFromApi: Modelo plano da API de cotação atual.

ApiHistoryLocationGroup: Agrupamento hierárquico por localizações retornado no histórico.

CityPrices: Estrutura interna otimizada para chaveamento rápido indexado por qualidade ([quality: number]).

## 📝 Licença
Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para obter mais detalhes.

