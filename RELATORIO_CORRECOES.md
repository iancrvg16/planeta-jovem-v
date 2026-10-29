# Relatório de correções — Planeta Jovem V

Data: 29/10/2026. Correções locais e preparação para GitHub, sem commit, push, criação de remoto ou deploy. O relatório técnico original foi preservado byte a byte; instruções AGENTS não foram encontradas no projeto ou nos ancestrais acessíveis. A cópia inicial dos arquivos mantidos foi guardada temporariamente para revisão do diff, sem usar Git no projeto protegido.

## Resultado por achado

| Achado | Status    | Mudança e evidência                                                                                                                                                                                                          |
| ------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUD-01 | Resolvido | Vite 8.3.5, Lighthouse 13.6.0 e fast-uri transitivo 3.1.9; resolução compatível no package.json/lockfile, sem overrides nem `audit fix --force`. Auditorias completa e de produção reportam zero ocorrências nesta execução. |
| AUD-02 | Mitigado  | A fonte também tem o trecho preto. Home usa bandeira e link ao país; não houve recuperação nem corte de áudio. MP4 e fontes preservados.                                                                                     |
| AUD-03 | Resolvido | Cenário existente verifica link real; fixtures isoladas exercitam modal sem canais, foco, teclado, fechamento e axe, sem mudar a configuração pública nem enviar mensagens.                                                  |
| AUD-04 | Resolvido | Importação parcial com staging, lock POSIX compartilhado, validação, journal persistido, rollback e recuperação após interrupção. Testes sintéticos do fluxo completo confirmam falhas e preservação.                        |
| AUD-05 | Mitigado  | Player suporta WebVTT, idioma/rótulo e transcrição condicionados a revisão registrada. Carregamento/seleção testados com fixture sintética. Seis vídeos reais ainda sem alternativas revisadas comprovadas.                  |
| AUD-06 | Pendente  | Controle por material criado com estados aprovado-com-evidência, pendente e restrito. Nenhuma autorização foi inventada; redistribuição pública depende de decisão humana.                                                   |
| AUD-07 | Resolvido | Arquivos mantidos formatados; originais/evidências históricas excluídos e preservados.                                                                                                                                       |
| AUD-08 | Resolvido | Referência inexistente substituída por documentação atual existente; README anterior preservado localmente. Não se criou relatório retroativo.                                                                               |

## Implementação e limites

### Dependências

A auditoria inicial reproduziu cinco pacotes afetados: Vite, Zod, chromium-bidi, puppeteer-core e fast-uri. A atualização das dependências diretas Vite/Lighthouse renovou a cadeia de ferramentas de navegador; `npm update fast-uri` resolveu o restante dentro do intervalo aceito. As duas auditorias finais têm zero ocorrências. Isso é resultado do banco consultado, não certificação de risco zero.

O risco anterior estava nas ferramentas de desenvolvimento: Vite tinha condições de exploração ligadas a exposição do servidor, caminhos específicos, middleware e/ou Windows; Zod/fast-uri estavam na cadeia transitiva de ferramentas. Não foi demonstrada exploração no portal estático. Nenhuma biblioteca foi classificada como vulnerável apenas pela idade.

### Vídeo e interface

`src/pages/Home.tsx` substitui apenas o destaque defeituoso por identidade estática relacionada ao mesmo país. A classe e composição existentes foram mantidas. A fonte foi localizada em duas cópias com o mesmo hash; FFmpeg confirmou preto de 25,566667 a 166,833333 s, por 141,266666 s. O vídeo continua no acervo para decisão editorial. Arquivos de `public/`, fontes brutas e inventários editoriais não foram regenerados nesta entrega.

### Contato e player

`src/config/site.ts` e `src/components/Contact.tsx` aceitam canais injetados opcionalmente, mantendo a configuração real como padrão. `tests/fixtures/components.tsx` passa canais vazios só ao componente testado. Nenhum parâmetro de URL no site publicado ativa modo de teste. Vite na porta 4175 serve a fixture apenas durante desenvolvimento/testes; a saída de produção não contém essas páginas.

`tests/site.spec.ts` mantém a análise axe das páginas e passa a validar o link esperado no ponto que antes procurava o botão inexistente. Não foram retiradas asserções, adicionados skips ou reduzida a análise de páginas. `tests/components.spec.ts` acrescenta cobertura separada de modal, canal configurado, WebVTT/transcrição e destaque estático em todas as oito larguras.

`src/components/VideoPlayer.tsx` e `src/data/mediaAccessibility.ts` implementam a infraestrutura audiovisual. O mapa começa vazio porque não havia evidência de legendas revisadas. O conteúdo de teste é explicitamente sintético e não transcreve falas de participantes. `scripts/check-content.mjs` valida IDs, arquivos WebVTT e campos de revisão. Acessibilidade audiovisual não é declarada concluída.

### Pipeline

`scripts/media_transaction.py` implementa trava não bloqueante por raiz, staging no mesmo sistema de arquivos, backups, journal, substituições por arquivo e recuperação restartável. `scripts/processar-entregas.py` não exige fontes antigas fixas quando há derivados anteriores, valida entradas/ferramentas, gera somente no staging e produz mensagens úteis. `scripts/processar-lervuria.py` compartilha a trava/transação e preserva registros ausentes também em importação parcial.

Quinze testes Python cobrem os quatro cenários existentes e onze novos: parcial geral e Lervúria, fonte explícita obrigatória ausente, ausência inicial de hero/variante preservada, derivado anterior ausente, ferramenta ausente, falha durante conversão, falha durante publicação, concorrência e processo interrompido no meio da publicação com recuperação posterior. Os novos testes usam apenas materiais sintéticos em temporários; não reprocessam o acervo real.

Limite operacional: a publicação de múltiplos arquivos não é uma troca atômica para leitores. A trava protege importadores entre si; build/deploy independente não participa do lock. Não executar build durante importação. Processamento requer POSIX com locks locais; no Windows, usar WSL. Ver [recuperação e ferramentas](docs/PROCESSAMENTO.md).

### Privacidade, documentação e GitHub

`.gitignore` exclui fontes brutas, ambientes, caches, IDE, configurações privadas, staging/journal, relatórios temporários e evidências antigas com caminhos internos. As evidências permanecem no disco, sem alterações. Foram preservados arquivos necessários ao build e testes: public, dados, lockfile, inventário de preservação, configurações e fixtures. Nenhuma licença nova foi criada.

[Controle editorial](docs/PUBLICACAO.md) e `docs/publication-status.json` organizam 134 registros por IDs opacos/hashes: 130 pendentes e quatro restritos de fontes privadas, sem comprovantes pessoais. O gate público permanece bloqueado. Ainda é preciso confirmar a redistribuição de créditos, nomes de arquivos, retratos/representações, vozes, artes, documentos e materiais de terceiros. Não se concluiu irregularidade a partir de ausência de comprovante no código.

`scripts/check-github.py` usa um índice Git temporário independente só para aplicar as regras de ignore e listar candidatos. Não executa `git add`, commit ou inicialização no projeto. Pesquisa padrões de credenciais e caminhos privados, sem imprimir valores. O resultado técnico não concede aprovação editorial; `--public` também exige as decisões registradas. Não substitui revisão de segredos nos binários/histórico nem inspeção humana.

O README foi atualizado com instalação, versões, variáveis públicas, PyCharm, processamento separado, CI e limitações. `.nvmrc` fixa a versão local de referência; `requirements-tools.txt` fixa Pillow 12.3.0 para os testes/ferramentas Python. Variáveis públicas são lidas do processo de build, sem carregamento implícito de `.env` no gerador Node.

## Git, CI e tamanho

`git status`, `git rev-parse --show-toplevel` e acesso direto a `.git` continuam sem repositório válido. O diretório visível está vazio, protegido e não gravável; o ancestral também não fornece repositório acessível. Não foi possível confirmar histórico, branch, HEAD, remotes nem arquivos já rastreados. Não se apagou nem substituiu `.git`, e não se executou inicialização para contornar o bloqueio. Essa intervenção depende da cópia original/ambiente do mantenedor.

`.github/workflows/ci.yml` tem permissões `contents: read`, Node/Python/Pillow, instalação Chromium com dependências, todos os gates principais e upload de falhas por sete dias. Não exige pastas privadas e não contém deploy. A primeira execução real no GitHub ainda está pendente; sucesso local não é sucesso do serviço remoto.

O maior arquivo público tem 9.071.710 bytes. Nenhum candidato excede 50 MiB. Não é necessário LFS para o conjunto atual. Os [limites oficiais do GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github) consultados indicam aviso acima de 50 MiB e bloqueio acima de 100 MiB no Git comum. Estratégia e efeitos futuros de LFS/armazenamento externo estão no documento de publicação.

## Verificações executadas

| Comando/verificação                                       | Resultado real                                                                                                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm ci --cache /tmp/site-pj-npm-cache` em diretório novo | Passou: 159 pacotes instalados, hooks normais habilitados; zero achados no audit integrado                                                                   |
| `npm run typecheck` e `npm run build` na instalação limpa | Passaram: Vite 8.3.5, 60 módulos e 27 páginas; sem fontes brutas ou diretórios privados                                                                      |
| `npm run lint`                                            | Passou, sem correção automática                                                                                                                              |
| `npm run format:check`                                    | Passou; evidências históricas excluídas e preservadas                                                                                                        |
| `npm run test:conteudo`                                   | Passou: 96 registros, 238 derivados, 27 rotas; Manual/logo originais preservados por SHA-256                                                                 |
| `npm run test:docs`                                       | Passou nos cinco documentos mantidos; links locais verificados                                                                                               |
| `npm run test:python`                                     | Passou: 15 testes, incluindo quatro existentes e onze novos                                                                                                  |
| unittest com Python/Pillow instalados em venv limpo       | Passou: 15 testes; Pillow 12.3.0 instalado pelo requirements                                                                                                 |
| `npm test`                                                | Passou: 96 aprovados, 56 skips existentes, zero falhas; 152 instâncias, oito larguras, timeout original de 120 s, cerca de quatro minutos                    |
| `npm run test:links` com preview                          | Passou: 27 rotas e 1.105 referências, zero erros internos; destinos externos só listados                                                                     |
| `npm audit --json` e `npm audit --omit=dev --json`        | Ambas passaram: zero ocorrências na consulta final                                                                                                           |
| `npm run check:github`                                    | Passou na revisão técnica: 382 arquivos candidatos, cerca de 91 MB; nenhum padrão pesquisado de credenciais/caminho privado e nenhum arquivo acima de 50 MiB |
| `npm run check:github -- --public`                        | Bloqueio esperado, código 2: decisões editoriais de publicação pendentes                                                                                     |
| Inspeção visual                                           | Capturas desktop 1440 px e mobile 390 px inspecionadas; destaque estático legível, relacionado ao país e com navegação funcional                             |
| Workflow                                                  | YAML aceito pelo formatter e comandos principais executados localmente; não foi executado no GitHub                                                          |
| Git e histórico                                           | Bloqueados pelo ambiente: sem repositório válido acessível, sem HEAD/branch/remotes/tracked files verificáveis                                               |
| Preservação                                               | Zero diferenças em arquivos públicos, evidências históricas, manifesto editorial e relatório original; skips existentes mantidos                             |

As falhas iniciais de DNS no pip foram resolvidas repetindo a instalação em venv temporário com acesso autorizado. A captura desktop inicial ocorreu antes de estabilizar o carregamento lazy/rolagem e foi descartada; as capturas finais foram refeitas e inspecionadas. Não se tratou esses ensaios como falhas do produto.

Evidências temporárias: logs de instalação, auditorias e testes com prefixo `/tmp/pj-`; relatórios JSON/HTML/traces em `test-results/` e `playwright-report/`, ignorados. A inspeção visual não representa revisão integral do site, teste de carga ou aceite da hospedagem. Não foi medido percentual de cobertura.

### Arquivos alterados e criados

- Dependências/configuração: `package.json`, `package-lock.json`, `.nvmrc`, `requirements-tools.txt`, `.env.example`, `.gitignore`, `.prettierignore`, `playwright.config.ts` e `.github/workflows/ci.yml`.
- Correções funcionais: `src/pages/Home.tsx`, `src/components/Contact.tsx`, `src/config/site.ts`, `src/components/MediaGallery.tsx`, novo `src/components/VideoPlayer.tsx` e novo `src/data/mediaAccessibility.ts`.
- Pipeline e verificações: `scripts/processar-entregas.py`, `scripts/processar-lervuria.py`, novo `scripts/media_transaction.py`, `scripts/check-content.mjs`, `scripts/check-links.mjs`, novos `scripts/check-docs.mjs` e `scripts/check-github.py`.
- Testes: `tests/site.spec.ts`, novo `tests/components.spec.ts`, fixtures locais e novo `tests/test_pipeline.py`; os quatro testes Python anteriores foram mantidos.
- Formatação de arquivos existentes: `src/App.tsx`, `src/components/Layout.tsx`, `src/lib/usePageMeta.ts`, `src/pages/News.tsx`, `scripts/metadata.mjs`, `scripts/preview.mjs`, `tests/jambor.spec.ts` e `tests/remediacao.spec.ts`, além dos arquivos já alterados funcionalmente. Não houve mudança visual ampla ou CSS.
- Documentação: README reescrito, este relatório, `CHECKLIST_GITHUB.md`, `docs/PUBLICACAO.md`, `docs/PROCESSAMENTO.md` e `docs/publication-status.json`; README anterior arquivado localmente, ignorado. Relatórios/evidências anteriores não foram reformatados.

A verificação adicional da documentação histórica encontrou dez referências locais ausentes no contexto atual: quatro já pertencem às entregas/README históricos e seis são relativas à localização antiga do README agora arquivado. Elas não integram os cinco documentos mantidos nem o conjunto público. Foram registradas em log temporário e preservadas como evidência, sem fabricar os documentos antigos ou reescrever o arquivo original.

A revisão utilizou comparações por hash e `git diff --no-index` contra a cópia inicial, já que o Git real não estava disponível. A comparação confirmou que alterações no teste existente preservam a análise axe e acrescentam verificações do link, com modal coberto separadamente. Os arquivos públicos e dados editoriais mantiveram os bytes anteriores. Arquivos de build, relatórios temporários e bytecode Python são artefatos ignorados, sem preparação para commit.

## Pendências humanas e prontidão

- **Pronto para versionar:** código e configuração organizados e testáveis; falta resolver o acesso ao Git original para conferir histórico/tracked files e efetivamente inicializar somente se cabível. Nenhum commit foi feito.
- **Pronto para repositório público:** ainda não. Aprovações do acervo, créditos e escopo de redistribuição/licença continuam pendentes. O scanner técnico não libera esse gate.
- **Pronto para produção:** não há novo aceite de produção. Faltam revisão de alternativas audiovisuais, decisões editoriais e validação da hospedagem/contatos reais. Destaque defeituoso está mitigado; dependências estão sem achados reportados na consulta final.

Siga o [checklist de primeiro envio](CHECKLIST_GITHUB.md) após resolver esses pontos. Nenhuma ação remota foi executada.
