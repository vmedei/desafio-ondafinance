# Publicar o site no GitHub Pages (passo a passo)

Este projeto está preparado para **GitHub Pages** com **GitHub Actions**: cada *push* na branch `main` executa CI (lint, testes, build) e, se tudo passar, publica o site automaticamente.

## Pré-requisitos

- Conta no [GitHub](https://github.com).
- Repositório com este código (novo ou já existente).
- A URL pública será no formato **`https://<usuário>.github.io/<nome-do-repositório>/`** quando o repositório for **público** ou com Pages habilitado no plano adequado.

## 1. Enviar o código para o GitHub

Se ainda não tiver remoto:

```bash
git init
git add .
git commit -m "feat: app Onda Finance"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git push -u origin main
```

Substitua `SEU_USUARIO` e `NOME_DO_REPO`.

## 2. Ativar o GitHub Pages (fonte: GitHub Actions)

1. No repositório, vá em **Settings** → **Pages** (menu lateral).
2. Em **Build and deployment** → **Source**, escolha **GitHub Actions** (não “Deploy from a branch”).
3. Salve se houver botão de confirmar.

Pronto: o workflow `.github/workflows/ci.yml` já está no repositório e fará o deploy após o primeiro *push* na `main` (desde que o CI passe).

## 3. Primeiro deploy e URL

1. Faça um *push* para `main` (ou dispare o workflow manualmente em **Actions** → **CI** → **Run workflow**, se disponível).
2. Acompanhe em **Actions**: o job **quality** roda lint, testes e build; em seguida o job **deploy** envia a pasta `dist` para o Pages.
3. Em **Settings** → **Pages**, o campo mostrará algo como:  
   **`https://SEU_USUARIO.github.io/NOME_DO_REPO/`**

Abra essa URL no navegador. O primeiro deploy pode levar 1–2 minutos.

## 4. O que o CI/CD faz

| Etapa | Descrição |
|--------|-----------|
| **quality** | `npm ci` → `npm run lint` → `npm run test:run` → `npm run build` com `VITE_BASE_PATH` igual a `/<nome-do-repo>/` (necessário para assets e rotas no subcaminho). |
| **deploy** | Só roda em *push* na `main`, depois que **quality** passa. Gera o build, copia `index.html` para `404.html` (para o React Router ao dar F5 em rotas internas), publica com **upload-pages-artifact** + **deploy-pages**. |

Qualquer atualização na `main` repete o fluxo: **qualidade primeiro, deploy em seguida**.

## 5. Repositório especial `usuario.github.io`

Se o repositório se chama exatamente **`SEU_USUARIO.github.io`**, o site fica na raiz: **`https://SEU_USUARIO.github.io/`** (sem subpasta).

Nesse caso o `base` do Vite deve ser **`/`**, não `/<nome-do-repo>/`.

**Opção A:** no workflow do job **deploy** (e no **Build (validação)** de **quality**), altere a variável `VITE_BASE_PATH` para:

```yaml
env:
  VITE_BASE_PATH: /
```

**Opção B:** use uma [variável do repositório](https://docs.github.com/pt/actions/learn-github-actions/variables) `VITE_BASE_PATH` e ajuste o workflow para ler essa variável (ou documente o uso manual).

O projeto já usa `import.meta.env.BASE_URL` no React Router (`basename`) para compatibilidade com subpasta.

## 6. Troubleshooting

| Problema | O que verificar |
|----------|-------------------|
| Página em branco | Console do navegador (F12): erros 404 em `/assets/...` indicam `base` errado; confira se a URL que você abre bate com `/<nome-do-repo>/`. |
| **404** ao dar F5 em `/app/transacoes` | O workflow copia `index.html` para `404.html`; confira se o job **deploy** rodou com sucesso. |
| Workflow falha no **lint** ou **testes** | Rode `npm run lint` e `npm run test:run` localmente e corrija antes do *push*. |
| Deploy não aparece | Pages com **Source** = **GitHub Actions**; permissões do workflow (`pages: write`, `id-token: write`) já estão no YAML. |

## 7. Arquivos relevantes

- `vite.config.ts` — `base` via `VITE_BASE_PATH`.
- `src/routes/router.tsx` — `basename` derivado de `import.meta.env.BASE_URL`.
- `.github/workflows/ci.yml` — CI + deploy automático na `main`.

## Referências

- [GitHub Pages com Actions](https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Workflow do deploy estático](https://docs.github.com/pt/actions/use-cases-and-examples/deploying/deploying-github-pages)
