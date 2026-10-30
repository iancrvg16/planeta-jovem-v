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

O player suporta WebVTT com idioma/rótulo e transcrição. Somente material revisado com referência de decisão pode entrar em `src/data/mediaAccessibility.ts`. **Os sete vídeos continuam pendentes de revisão de alternativas acessíveis.** As fixtures usam texto sintético, não transcrevem falas reais e não entram no build público.

A fonte disponível da apresentação de Galixandria também contém o trecho preto. O destaque da home foi substituído pela bandeira e acesso ao país; arquivos originais/derivados foram preservados. A recuperação do vídeo permanece editorialmente pendente.

Leia [situação de publicação e direitos](docs/PUBLICACAO.md), [relatório das correções](RELATORIO_CORRECOES.md) e [checklist GitHub](CHECKLIST_GITHUB.md). Não foi escolhida licença de código ou de mídia: essa decisão pertence aos titulares. **O responsável declarou autorização de publicação em 29/10/2026 e reiterou-a para a nova entrega em 30/10/2026; os registros restritos permanecem restritos.** Um site público existente não comprova permissão para redistribuir seus materiais no GitHub.

O relatório técnico original e evidências históricas permanecem locais, ignorados no conjunto público por conterem caminhos e detalhes internos. O relatório de correções documenta esta entrega; não existe relatório retroativo de remediação recuperado. O link anterior foi substituído por documentação existente.

## PyCharm e CI

Abra a raiz como projeto. Selecione Node compatível e npm em `package.json`; execute scripts npm pelo terminal ou pela janela de scripts. Para os testes Python, use `.venv` com `requirements-tools.txt` e unittest (não é necessário pytest). Configure Prettier conforme `.prettierrc.json` e oxlint pelo script `npm run lint`. Não depender da configuração Python/ESLint antiga de `.idea`, que é pessoal e ignorada.

O GitHub Actions instala Node, Python/Pillow e Chromium com bibliotecas do sistema; executa lint, formato, tipos/build, conteúdo, documentação, Python, Playwright, links, auditorias npm e revisão de candidatos. As falhas guardam relatórios/traces por sete dias. O workflow ainda precisa de sua primeira execução real no GitHub. Não há secrets exigidos nem deploy configurado.

Em 30/10/2026, o repositório Git foi lido normalmente e estava limpo antes da atualização. Histórico e remotos foram preservados; esta entrega não inclui commit, push ou deploy.

## Materiais incorporados em 30/10/2026

A home contém as 11 fotografias em “Outras edições”, com descrições visuais e lightbox, sem associação a países ou números de edição. Os países Astalania, Jambor e Jakkar recebem respectivamente o gibi, o projeto e a revista, com capas reais, abertura e download. O vídeo de Astalania aparece junto aos materiais do país e no acervo; suas legendas estão pendentes. Os novos materiais não têm fase, atividade, data de produção ou autoria presumidas.

A importação dedicada usa a mesma transação e conversão responsiva do pipeline:

```bash
python3 scripts/importar-atualizacao.py
```

O mapeamento editorial fica em `scripts/atualizacao-2026-10-30.json`; o frontend lê os manifestos gerados como fonte única para destaque, catálogo, filtros e busca. Fontes ficam em `_entregas/atualizacao-2026-10-30/`, ignoradas. Ausências são informadas individualmente; itens independentes são processados e o acervo anterior é preservado. O processador geral preserva esta entrega e delega sua importação ao comando dedicado.

Os três PDFs públicos preservam os bytes recebidos. O gibi ocupa 56.443.981 bytes: supera o aviso de 50 MiB do GitHub, mas está abaixo do limite de 100 MiB do Git normal. Usar Git para o futuro envio; nenhum LFS ou histórico foi alterado. O vídeo foi otimizado para o orçamento existente de 10 MiB, mantendo dimensões, duração e áudio original. O build continua independente das fontes privadas.
