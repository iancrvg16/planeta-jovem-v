# Planeta Jovem V — A conexão com a Terra

Portal público do Planeta Jovem, realizado pelo Pirambu Innovation. Apresenta cinco países atuais, atividades, galeria, documentos, notícias e memória de oito países das edições anteriores. Conteúdo local tipado; sem backend, autenticação, CMS ou coleta de formulários neste projeto.

React 19, React Router 7, TypeScript 6 e Vite 8. Node **22.13+**; versão usada nesta entrega em `.nvmrc`. Use npm e o `package-lock.json` fornecido. O build comum usa os derivados incluídos em `public/` e não precisa de fontes privadas, Python ou conversores.

## Instalar, executar e verificar

```bash
npm ci
npm run dev                         # http://localhost:5173
npm run lint
npm run format:check
npm run typecheck
npm run build                       # SPA + 27 HTMLs com metadados
npm run test:conteudo
npm run test:docs
npm run preview                     # http://127.0.0.1:4173
```

Em outro terminal, com o preview ativo:

```bash
npm run test:links
```

Para testes de navegador:

```bash
npx playwright install chromium
# Em Linux CI: npx playwright install --with-deps chromium
npm run build
npm test
```

Playwright testa o **build** em oito larguras (320 a 1920 px), usando Chromium. Alguns cenários existentes têm seleção por largura; skips não equivalem a testes aprovados. O runner inicia preview em 4173 e Vite em 4175 para fixtures isoladas dos componentes. A porta 4175 e `tests/fixtures/` são exclusivos dos testes. Os cenários de contato não enviam mensagens nem formulários externos. Relatórios e traces ficam em `playwright-report/` e `test-results/`, ignorados pelo Git. Rode novo build depois de alterar o frontend.

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-tools.txt
# Ative o ambiente para disponibilizar Pillow ao comando abaixo.
source .venv/bin/activate
npm run test:python                # unittest; fontes sintéticas em temporários
npm run check:github               # revisão de caminhos candidatos e padrões de segredos
```

No Windows, use WSL para o processamento transacional POSIX; o frontend usa os comandos npm habituais. Para a instalação do ambiente virtual no Windows, ajuste o caminho de ativação da ferramenta escolhida.

`npm run format` formata somente arquivos mantidos conforme `.prettierignore`; relatórios/fontes/evidências históricas são preservados. Lighthouse é opcional: com preview ativo e sem outros testes concorrentes, `npm run test:lighthouse`. Não interpretar notas antigas como medidas do build atual.

## Configuração pública

O portal funciona sem `.env`. O arquivo `.env.example` documenta somente a origem pública; não coloque segredos em variáveis `VITE_*` nem em arquivos de `public/`.

O gerador de metadados lê o ambiente do processo, sem carregar `.env` automaticamente:

```bash
SITE_URL=https://dominio-aprovado.example npm run build
```

`SITE_URL` tem prioridade sobre `VERCEL_PROJECT_PRODUCTION_URL`; ambos são opcionais. A origem deve ser HTTPS. Na ausência deles, usa a configuração atual do projeto. Na Vercel, configurar essas variáveis na interface do ambiente, sem publicar credenciais.

Edite `src/config/site.ts` para canais e parceiros confirmados. O CTA usa o canal institucional configurado, com alternativas de formulário HTTPS, WhatsApp e e-mail. Se não houver canais, abre um modal informativo. O envio no serviço externo não foi testado. Não presumir que uma URL configurada comprove operação do atendimento.

## Estrutura e edição

```text
src/config/site.ts           Contatos e configurações institucionais
src/data/paises.ts           Cinco países atuais
src/data/acervo.ts           Entregas, créditos, galeria e métricas
src/data/editorial.ts        Atividades e conteúdo da home
src/data/mediaAccessibility.ts  Decisões sobre legendas/transcrições revisadas
src/data/generated/          Manifestos e hero necessários ao build
src/data/countries.ts        Oito países históricos
src/data/news.ts, editions.ts, journey.ts  Notícias e memória
src/components/              Layout, busca, galerias, diálogos e player
src/pages/                   Páginas e template dos países
public/                      Derivados, fontes locais e documentos
scripts/                     Build, processamento e verificações
tests/                       Playwright e unittest
.github/workflows/ci.yml      Validações, sem deploy
```

As rotas principais são `/`, `/projeto`, `/paises`, `/paises/:slug`, `/atividades`, `/galeria`, `/parceiros`, `/contato`, `/documentos`, `/noticias`, `/noticias/:slug`, `/memoria` e `/memoria/paises/:slug`. Aliases históricos são redirecionados. Filtros ficam na URL. A resposta 404 e os redirecionamentos são simulados no preview; devem receber aceite na hospedagem real.

Para novas entregas, use identificadores únicos e dados editoriais confirmados. Referencie nomes originais não ambíguos ou selecione explicitamente a mídia pelo ID; não inferir datas a partir de arquivos ZIP. Publicação de registros não atesta conclusão de toda atividade. Dados ausentes devem permanecer explicitamente desconhecidos. Fontes brutas e comprovantes ficam fora do Git e do deploy.

O build gera metadados, canonical, OG, sitemap e 404; o corpo continua sendo React SPA. `vercel.json` descreve o deploy estático com saída `dist`. Não há deploy automático no CI.

## Processar novas mídias

Esta etapa é separada do build. Consulte [processamento e recuperação](docs/PROCESSAMENTO.md). Requer Python 3.10+, Pillow do `requirements-tools.txt` e, conforme o tipo de fonte, FFmpeg com H.264, ffprobe, Poppler e Ghostscript. Não é necessário reprocessar o acervo para executar o portal ou o CI.

```bash
python3 scripts/processar-entregas.py --check  # confere sem regenerar
npm run processar:entregas                    # publica localmente após staging validado
npm run seo:assets                           # opcional, após trocar arte aprovada
```

O pipeline tem trava POSIX, staging, rollback e recuperação no próximo processamento. Preserve qualquer journal/staging remanescente após falha; não o apague para desbloquear. Não executar build/deploy durante publicação de derivados. Fontes privadas em `_entregas`, `_referencias`, `_processamento` e `_privado` são ignoradas. Cabe ao mantenedor fazer backup seguro dessas fontes.

## Acessibilidade e publicação

O player suporta WebVTT com idioma/rótulo e transcrição. Somente material revisado com referência de decisão pode entrar em `src/data/mediaAccessibility.ts`. **Os seis vídeos continuam pendentes de revisão de alternativas acessíveis.** As fixtures usam texto sintético, não transcrevem falas reais e não entram no build público.

A fonte disponível da apresentação de Galixandria também contém o trecho preto. O destaque da home foi substituído pela bandeira e acesso ao país; arquivos originais/derivados foram preservados. A recuperação do vídeo permanece editorialmente pendente.

Leia [situação de publicação e direitos](docs/PUBLICACAO.md), [relatório das correções](RELATORIO_CORRECOES.md) e [checklist GitHub](CHECKLIST_GITHUB.md). Não foi escolhida licença de código ou de mídia: essa decisão pertence aos titulares. **A publicação em repositório público depende de confirmação do acervo, créditos e direitos.** Um site público existente não comprova permissão para redistribuir seus materiais no GitHub.

O relatório técnico original e evidências históricas permanecem locais, ignorados no conjunto público por conterem caminhos e detalhes internos. O relatório de correções documenta esta entrega; não existe relatório retroativo de remediação recuperado. O link anterior foi substituído por documentação existente.

## PyCharm e CI

Abra a raiz como projeto. Selecione Node compatível e npm em `package.json`; execute scripts npm pelo terminal ou pela janela de scripts. Para os testes Python, use `.venv` com `requirements-tools.txt` e unittest (não é necessário pytest). Configure Prettier conforme `.prettierrc.json` e oxlint pelo script `npm run lint`. Não depender da configuração Python/ESLint antiga de `.idea`, que é pessoal e ignorada.

O GitHub Actions instala Node, Python/Pillow e Chromium com bibliotecas do sistema; executa lint, formato, tipos/build, conteúdo, documentação, Python, Playwright, links, auditorias npm e revisão de candidatos. As falhas guardam relatórios/traces por sete dias. O workflow ainda precisa de sua primeira execução real no GitHub. Não há secrets exigidos nem deploy configurado.

Neste workspace, `.git` está inacessível como repositório válido e protegido contra escrita. Nenhum histórico foi substituído, nenhum commit/remoto foi criado. Siga o checklist para resolver esse ponto na cópia original antes do primeiro envio.
