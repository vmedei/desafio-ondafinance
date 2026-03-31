# Desafio Front-End — Onda Finance

Aplicação web (mock) que simula um **internet banking** enxuto: login, dashboard, transferências, extrato com filtros e detalhe de movimentação, tema e configurações. O foco está em **organização de código**, **UX consistente**, **tipagem** e padrões de mercado (camada de API, cache, formulários).

## Visão geral (estado atual)

| Área | O que foi feito |
|------|------------------|
| **Rotas** | `createBrowserRouter`: `/login`, área autenticada em `/app` com *layout* (`AppShell` + `<Outlet />`), rotas filhas para dashboard, transferência, transações (lista + detalhe por `:id`), configurações e 404. |
| **Autenticação (mock)** | Sessão em **Zustand** (token + usuário); rotas protegidas via componente dedicado; fluxo de login/logout integrado ao Axios (header `Authorization`). |
| **Dados** | **TanStack Query** para contas, transações (com **filtro por conta** e **intervalo de datas** via query string), detalhe e mutação de transferência; chaves de query alinhadas aos filtros para cache correto. |
| **API** | Funções em `src/api/banking.ts` sobre **Axios**; em desenvolvimento um **adapter mock** simula latência e validações básicas, mantendo o front desacoplado (fácil trocar por API real). |
| **Formulários** | **React Hook Form + Zod**: transferência com máscaras (CPF/CNPJ e valor em R$), validação de documento e valor; padrão reutilizável de inputs mascarados. |
| **UI / UX** | **Tailwind** + componentes estilo shadcn (**Radix**): diálogos, dropdowns, *sheet* (menu lateral no mobile), calendário para período; **tema** claro / escuro / sistema com persistência; **animações** de entrada e `prefers-reduced-motion` onde aplicável. |
| **Design** | Tokens e convenções documentados em `DESIGN_SYSTEM.md` e `src/index.css` (cor primária da marca, sombras, motion). |
| **Componentes** | Peças reutilizáveis (ex.: exibição de saldo com ocultar/mostrar **persistido** entre páginas, filtros de transações, *layout* com sidebar desktop e *drawer* no mobile). |
| **Testes** | **Vitest** + Testing Library em trechos críticos (ex.: máscaras, regras do mock). |

### Destaques para quem avalia o código

- **Separação de responsabilidades**: rotas leves, hooks de dados em `features/`, tipos compartilhados em `types/`, cliente HTTP isolado.
- **Experiência de uso**: navegação lateral responsiva, filtros de extrato sem recarregar a página inteira (cache do React Query), feedback de carregamento e erro nas listas.
- **Manutenibilidade**: TypeScript estrito, validação declarativa com Zod, componentes acessíveis (Radix + rótulos/aria onde cabe).
- **Documentação**: README com visão de produto e seção de **segurança** (conceitual, pensada para contexto financeiro).

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS + CVA
- shadcn/ui + Radix UI
- React Router 7 (`createBrowserRouter`)
- TanStack Query (React Query)
- Zustand (com `persist` para tema e preferências de UI)
- React Hook Form + Zod
- Axios (adapter mock local)
- Vitest + Testing Library

## CI/CD e publicação (GitHub Pages)

- Workflow em [`.github/workflows/ci.yml`](.github/workflows/ci.yml): em cada *push* na branch **`main`** roda **lint**, **testes** e **build**; se tudo passar, faz **deploy automático** para **GitHub Pages**.
- Passo a passo completo (ativar Pages, URL, repositório `usuario.github.io`, *troubleshooting*): [`docs/publicacao-github-pages.md`](docs/publicacao-github-pages.md).

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção com o mesmo `base` do GitHub Pages (substitua `nome-do-repo` pelo nome do seu repositório):

```bash
set VITE_BASE_PATH=/nome-do-repo/
npm run build
```

No PowerShell use `$env:VITE_BASE_PATH="/nome-do-repo/"; npm run build`. Em Linux/macOS: `VITE_BASE_PATH=/nome-do-repo/ npm run build`.

## Testes

```bash
npm run test
```

ou

```bash
npm run test:run
```

## Funcionalidades principais

- **Login** (mock): sessão persistida; redirecionamento para a área logada.
- **Dashboard**: abas por conta, saldo (com opção de ocultar **global** e persistida), transações recentes e atalho para transferir.
- **Transferência**: seleção de conta, favorecido, banco, valor com máscara BRL e validação de CPF/CNPJ (11 ou 14 dígitos).
- **Transações**: filtro por conta, **intervalo de datas** (calendário), lista clicável para o detalhe.
- **Detalhe da transação**: valor em destaque, tipo (crédito/débito/transferência), conta vinculada.
- **Configurações**: tema (dropdown alinhado ao restante do app) e logout.
- **Tema**: claro, escuro ou seguindo o sistema — aplicado no `document` e persistido.

## Melhorias futuras

Ideias naturais de evolução após o escopo do desafio, sem desmerecer o que já está entregue:

- **Internacionalização (i18n)**: extrair textos para catálogos (ex.: `react-i18next` ou `lingui`), locale por usuário ou navegador, formatação de datas e moeda por região.
- **Testes E2E com Playwright**: cobrir fluxos críticos (login mock, transferência, filtros de extrato, navegação mobile com *sheet*) em CI, compondo o que hoje é coberto só por testes unitários/integração leves.
- **Backend e persistência real**: substituir o **adapter mock** por uma API autenticada (REST ou GraphQL) e banco relacional/NoSQL; manter a camada em `src/api` como contrato estável entre front e servidor.
- **Observabilidade e erros**: integração com serviço de *reporting* de erros no cliente (ex.: Sentry) e correlação com versão de *build* / ambiente.
- **Acessibilidade em auditoria**: revisão sistemática com axe/Playwright a11y, foco em formulários financeiros e leitores de tela.

## Segurança

> Escopo **conceitual**: as medidas abaixo descrevem como um aplicativo deste tipo seria endurecido em produção. **Não** fazem parte da implementação deste repositório (front mock).

### Engenharia reversa

O front-end em JavaScript é sempre inspecionável no navegador; a defesa combina **redução de superfície** e **ausência de segredos no cliente**.

- **Build de produção**: minificação, tree-shaking e **sem publicar source maps** para o público (ou restringir maps a ambientes internos), dificultando leitura casual do código.
- **Nenhum segredo no bundle**: chaves de API, credenciais ou regras proprietárias não devem ficar em variáveis acessíveis no cliente; regras críticas permanecem no **backend**, com o app consumindo apenas APIs autenticadas.
- **Integridade e distribuição**: na Web, **Subresource Integrity (SRI)** em assets servidos por CDN quando aplicável; em apps nativos ou híbridos, assinatura de binários e canal seguro de atualização.
- **Headers e políticas**: **Content-Security-Policy (CSP)** restritiva, proteção contra **clickjacking** (`frame-ancestors` / `X-Frame-Options`), `Referrer-Policy` adequada, reduzindo abuso de injeção e framing.
- **Autoridade no servidor**: validação de sessão/token **no backend**, **rate limiting**, detecção de abuso — o cliente não é fonte da verdade para permissões ou regras de negócio sensíveis.

### Vazamento de dados

Proteção combina **trânsito**, **armazenamento**, **gestão de credenciais** e **governança** de dados.

- **Em trânsito**: **HTTPS/TLS** obrigatório; **HSTS** no servidor; em clientes móveis, **certificate pinning** quando o modelo de ameaça justificar.
- **Em repouso e backups**: criptografia de bases e backups, controle de acesso (RBAC), segregação de ambientes e trilhas de auditoria para acessos administrativos.
- **Sessão e tokens**: preferência por **cookies HttpOnly + Secure + SameSite** ou tokens de curta duração com **refresh** controlado; evitar armazenar segredos de longo prazo em `localStorage` para cenários de alto risco sem análise explícita de risco.
- **Minimização e LGPD**: coletar e retê apenas o necessário; não registrar **dados pessoais ou financeiros** em texto claro em logs de produção; mascarar identificadores em APM/observabilidade.
- **Segredos e CI/CD**: credenciais em **vault** ou secrets do pipeline; **nunca** versionar `.env` com segredos reais.
- **Cadeia de suprimentos**: auditoria de dependências (SCA), atualizações de segurança e revisão de permissões de pacotes.

Em resumo: o front entrega experiência, mas **segurança sustentável** exige backend confiável, transporte cifrado, dados mínimos e operação disciplinada — não apenas dificultar a leitura do código no DevTools.
