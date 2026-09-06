# LangConnect — host, login e microfrontend

**Este arquivo é o handoff do CMS.** Não mistura com o roadmap de produto da plataforma (blocos I/J, runtime JWT, Azure, cadastro de agent).

**Atualizado:** 06/09/2026  
**Repos:** [Salvadus/langconnect](https://github.com/Salvadus/langconnect) (este) · [Salvadus/plataforma-ia](https://github.com/Salvadus/plataforma-ia) (MFE)  
**Espelho no MFE:** `plataforma-ia/HOST-CMS.md`

---

## O que isto é

O **LangConnect** é o host Next.js: Google login + monta o MFE Vite por **Module Federation** (não é iframe).

A plataforma (times, agents, chat) continua no MFE e no Python. Este host só:

1. Autentica com Google (Auth.js)
2. Decide `system_admin` vs `team_user` (`ADMIN_EMAILS`)
3. Entrega sessão ao MFE (`userEmail`, `userName`, `userMatricula`)
4. Carrega `remoteEntry.js` e chama `mount`

NextAuth **não** protege a API Python. O MFE manda `X-User-Email` (+ `X-User-Matricula` se for usuário de time).

---

## URLs no ar (homolog)

| Peça | URL |
|---|---|
| CMS / login | https://langconnect-three.vercel.app |
| MFE Vite | https://plataforma-ia-umber.vercel.app |
| API Python | https://plataforma-ia-back.onrender.com |

Local: CMS `http://localhost:3000` · MFE `http://localhost:5173`.

---

## Contrato de sessão (CMS → MFE)

O CMS monta `HostSessionInput` e passa no `mount`:

| Campo | Origem | Uso |
|---|---|---|
| `userEmail` | Google email | Header `X-User-Email`. Sem email = sem sessão. |
| `userName` | Google name | Header do MFE |
| `userMatricula` | Google `sub` (POC, **não** é matrícula RH) | Header `X-User-Matricula` se `team_user` |
| `mode` | `ADMIN_EMAILS` contém o email → `system_admin`; senão `team_user` | Python: só email (ou sem header) = ADM fail-open. Time precisa email + matrícula. |

`ADMIN_EMAILS` vazio = **ninguém** é admin. Lista atual de homolog: `salvadordalia1@gmail.com`.

MFE **sem** essa sessão (abrir `:5173` ou a URL da Vercel do MFE sozinho) → **Acesso negado** + botão Entrar → `{VITE_CMS_ORIGIN}/login`.

Sair no MFE dispara `mfe:signOut` (mesmo window = `CustomEvent`; iframe fallback = `postMessage`). O CMS chama `signOut({ callbackUrl: "/login" })`.

---

## Module Federation

- MFE expõe `./mount` em `remoteEntry.js` (`@module-federation/vite`).
- CMS carrega `{NEXT_PUBLIC_MFE_PLATAFORMA_IA_URL}/remoteEntry.js` (`@module-federation/runtime`).
- Catálogo: `src/mfe/catalog.ts`, nome `plataformaIa`.
- Em **dev** (origin localhost), o CMS injeta o preamble Vite (`/@react-refresh` + `/@vite/client`) antes do `loadRemote`.
- Em **produção** o preamble **não** roda: `/@vite/client` na Vercel devolve `index.html` e o loader travava (MFE “não carrega”, pior no celular).

`VITE_MFE_ORIGIN` vira `base` + `publicPath` do remote. Sem isso no deploy, o `remoteEntry` aponta para `localhost:5173`.

---

## Arquivos que mexemos (CMS)

| Caminho | Papel |
|---|---|
| `src/auth.ts` | Auth.js + Google (`prompt: select_account`) + `trustHost` + credenciais explícitas |
| `app/api/auth/[...nextauth]/route.ts` | Handlers GET/POST |
| `middleware.ts` | Protege só `/plataforma/*` |
| `src/session/toHostProps.ts` | Google → props do MFE |
| `src/mfe/*` | Catálogo, runtime, preamble |
| `src/components/mfe-loader` | Monta o remote + escuta signOut |
| `src/components/landing` | Tela de login (logo + Entrar) |
| `src/views/plataforma` | Gate + `MfeLoader` |
| `public/logo-langconect.png` | Logo recortado, fundo transparente |

MFE (outro repo): `src/mfe-mount.tsx`, `src/session/HostSessionGate.tsx`, `src/session/handshake.ts`, `vite.config.ts` (federation).

---

## Variáveis

### CMS (Vercel projeto `langconnect`)

| Variável | Tipo Vercel | Homolog |
|---|---|---|
| `AUTH_SECRET` | Secret | Novo por ambiente (≥ 32 chars). **Não** é do MFE. |
| `AUTH_URL` | Config | `https://langconnect-three.vercel.app` (sem `/`) |
| `AUTH_TRUST_HOST` | Config | `true` |
| `AUTH_GOOGLE_ID` | Config | Client ID do Google |
| `AUTH_GOOGLE_SECRET` | Secret | Client secret (`GOCSPX-…`) |
| `ADMIN_EMAILS` | Config | `salvadordalia1@gmail.com` |
| `NEXT_PUBLIC_MFE_PLATAFORMA_IA_URL` | Config | `https://plataforma-ia-umber.vercel.app` |

Local: `cms/.env.local` (não commitar). `AUTH_URL=http://localhost:3000`.

Se `AUTH_URL` na Vercel ficar `localhost`, o Auth.js quebra no callback. O `src/auth.ts` tenta corrigir isso quando `VERCEL` está setado.

### MFE (Vercel projeto `plataforma-ia`)

| Variável | Homolog |
|---|---|
| `VITE_API_URL` | `https://plataforma-ia-back.onrender.com` |
| `VITE_MFE_ORIGIN` | `https://plataforma-ia-umber.vercel.app` |
| `VITE_CMS_ORIGIN` | `https://langconnect-three.vercel.app` |

**Não** cadastrar em produção: `VITE_SESSION_MODE`, `VITE_USER_EMAIL`, `VITE_USER_MATRICULA` (POC local). `VITE_*` entra no **build** — depois de mudar, Redeploy sem cache.

---

## Google Cloud (mesmo client do local)

Client de homolog: `1066093719215-510cvaasjkfcfi3u2kljk27gj5970ns6.apps.googleusercontent.com`

Console novo: [https://console.cloud.google.com/auth/clients](https://console.cloud.google.com/auth/clients)

**Origens JavaScript**

- `http://localhost:3000`
- `https://langconnect-three.vercel.app`

**URIs de redirecionamento** (exato, sem `/` no fim)

- `http://localhost:3000/api/auth/callback/google`
- `https://langconnect-three.vercel.app/api/auth/callback/google`

Não deixar URI vazia (`example.com`). **Salvar**. Propagação: 5 min até algumas horas.

Tela em **Testing**: incluir o Gmail em **Test users**.

O MFE **não** entra no Google — OAuth é só no CMS.

---

## CORS (Python / Mongo)

Lista em `platform_settings` (não é env da Vercel). Com federation, o `Origin` do browser é o **CMS**.

Cadastrado em 06/09/2026:

- `https://plataforma-ia-umber.vercel.app`
- `https://langconnect-three.vercel.app`
- `allow_localhost_any_port: true`

Sem a origem do CMS: login funciona, MFE monta, `Failed to fetch` nas APIs.

Rota ADM: `PUT /system/settings/cors` (header `X-User-Email` de um admin).

---

## UI (só host / shell)

- Marca **LangConnect** (não “CMS” / “Plataforma AI” na cara do usuário)
- Login: logo ~56px + botão roxo `#b8a1d7`
- Header do MFE: preto, logo, nome, **Sair**
- FAB **Agentes Chat** (roxo `#5c3d8a`), escondido com o painel aberto e em `/usuario-nao-cadastrado`
- Footer `#b8a1d7`, © 2026 LangConnect
- `team_user` sem times → `/usuario-nao-cadastrado`
- Mobile do MFE: **não** ajustar agora (título/botões sobrepõem)

---

## Erros que já vimos

| Sintoma | Causa |
|---|---|
| Vercel build `auth.ts` TS2322 `user.id` | Tipo do Auth.js — já corrigido no `main` |
| `/api/auth/error?error=Configuration` | Falta `AUTH_SECRET` / Google ID/secret, ou `AUTH_URL` = localhost |
| `redirect_uri_mismatch` | URI não está **neste** `client_id`, ou Google ainda não propagou |
| Acesso negado no MFE sozinho | Esperado. Entrar → CMS |
| `Failed to fetch` depois do login | CORS sem origem do CMS |

---

## Como subir de novo

1. Push `langconnect` `main` → Vercel rebuilda o CMS  
2. Push `plataforma-ia` `main` → Vercel rebuilda o MFE  
3. Conferir env nos **dois** projetos  
4. Google: URIs do host novo, se a URL mudar  
5. CORS: incluir a origem nova do CMS  

Não commitar `.env` / `.env.local`.

---

## Fora deste doc (plataforma)

Roadmap de produto, envelope, cadastro, runtime, I/J, Azure: `plataforma-ia/ROADMAP.md` e `CONTINUIDADE.md`. Não reabrir aqui.
