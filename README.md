# PS4 Web Installer 13.50 — v0.2

Site estático para GitHub Pages, utilizável pelo navegador do PS4.

## O que funciona
- Interface adaptável a telas de TV.
- Catálogo JSON com pesquisa e filtros por jogo, app, DLC e update.
- Links de PKG HTTPS que podem ser abertos pelo navegador.
- Diagnóstico honesto do que está e não está conectado.

## O que não faz
- Não envia payloads.
- Não fala diretamente com BinLoader.
- Não chama API de instalação remota.
- Não instala PKGs automaticamente nem confirma instalação.

## Por que a instalação automática foi excluída
O Remote Package Installer legado expõe uma API HTTP na porta 12800, mas requer que o aplicativo RPI esteja instalado e em foco no PS4. Isso viola o requisito de não instalar serviço/app adicional. A documentação também descreve o fluxo de envio por PC/celular. O GitHub Pages é HTTPS e uma chamada `fetch` para um endpoint HTTP privado do console pode ser bloqueada pelo navegador como conteúdo misto, mesmo que CORS esteja habilitado.

GoldHEN possui Remote Package Install e BinLoader, mas isso não prova que uma página HTTPS estática possa atuar como cliente compatível para instalar pacotes. BinLoader recebe payload binário; não é, por si só, uma API HTTP para instalar PKGs.

## Adicionar itens ao catálogo
Edite `catalog/apps.json`:

```json
{
  "items": [
    {
      "name": "Nome do aplicativo",
      "type": "app",
      "description": "Descrição curta",
      "cover": "https://seu-site/cover.jpg",
      "pkg_url": "https://seu-site/aplicativo.pkg"
    }
  ]
}
```

Tipos aceitos: `game`, `app`, `dlc`, `update`.

Use apenas links diretos e legítimos, com permissão de distribuição.

## Publicar
1. Extraia o ZIP.
2. Envie o conteúdo para a raiz de um repositório GitHub.
3. Abra Settings → Pages.
4. Escolha Deploy from a branch → `main` → `/ (root)`.
5. Aguarde a URL de publicação.
