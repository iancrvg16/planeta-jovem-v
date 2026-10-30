# Checklist para o primeiro envio ao GitHub

Este arquivo descreve ações futuras. Nenhum commit, push, remoto ou deploy foi realizado nesta entrega. Consulte o [relatório de correções](RELATORIO_CORRECOES.md) e o [controle editorial](docs/PUBLICACAO.md).

## Antes de versionar

- [ ] Na cópia original, verificar `git rev-parse --show-toplevel`, `git status`, branch, HEAD e `git remote -v`. Preservar histórico e alterações existentes. A leitura do Git foi confirmada em 30/10/2026; o estado inicial estava limpo.
- [x] Confirmar acesso de leitura ao repositório e preservar seus metadados, histórico e remotos.
- [ ] Somente se for confirmado que é uma pasta independente sem histórico, inicializar localmente com `git init -b main`. Se houver repositório válido, manter branch, histórico e remotes; não reinicializar por rotina.
- [ ] Conferir `.gitignore` e `git ls-files`: os ignores não retiram arquivos já rastreados. Revisar segredos no histórico acessível com ferramenta adequada; não reescrever histórico sem autorização.
- [ ] Executar `npm ci`, `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run build`, `npm run test:conteudo`, `npm run test:docs`, `npm run test:python`, `npm test`, `npm run test:links` com preview e as duas modalidades de `npm audit`.
- [ ] Executar `npm run check:github` e revisar `test-results/github-candidates.json`. Confirmar ausência de fontes brutas, comprovantes, caches, segredos e caminhos privados. O scanner pesquisa padrões delimitados e não garante ausência de todo segredo.
- [ ] Revisar o diff real, incluindo lockfile e arquivos novos. Não adicionar a pasta inteira sem olhar o conjunto. Evidências antigas ignoradas devem permanecer no backup privado.

## Antes de escolher visibilidade pública

- [ ] Obter decisões dos titulares sobre código/licença. Nenhuma licença foi presumida nesta entrega.
- [ ] Conferir cada material, seus créditos e nomes de arquivos contra o escopo de redistribuição no GitHub. Registrar decisões por ID/hash em `docs/publication-status.json`, com referência não pessoal; manter os comprovantes fora do Git.
- [ ] Confirmar também os nomes e créditos nos dados/manifestos, fontes e licenças de terceiros. Uma licença do código não cobre automaticamente o acervo.
- [ ] Executar `npm run check:github -- --public`: deve confirmar a cobertura dos arquivos públicos e as declarações de 29 e 30/10/2026, mantendo os registros restritos.
- [ ] Escolher acesso/visibilidade apropriados. Um repositório privado também exige política de acesso e autorização adequadas; não usar essa opção como aprovação automática.
- [ ] Revisar limites de tamanho caso haja novas mídias. O gibi de Astalania tem 56.443.981 bytes, acima do aviso de 50 MiB e abaixo do limite de 100 MiB do Git normal; seus bytes foram preservados. Não migrar histórico nem configurar LFS sem necessidade.

## Primeiro envio, após resolver os bloqueios

- [ ] Escolher conta, nome, URL e visibilidade do repositório. Esses dados não foram definidos pelo agente.
- [ ] Criar o remoto apenas com autorização do responsável. Se já houver remoto válido, preservá-lo.
- [ ] Conferir o conjunto preparado com `git diff --cached --stat` e `git diff --cached --check`, após selecionar explicitamente os arquivos aprovados.
- [ ] Fazer o primeiro commit apenas quando autorizado; configurar autoria real do mantenedor, sem inventar usuário/e-mail.
- [ ] Adicionar/conferir o remoto escolhido e enviar a branch correta apenas quando autorizado.
- [ ] Acompanhar a primeira execução real do GitHub Actions. A validação local não prova que o workflow passou no GitHub.
- [ ] Configurar proteção de branch e revisão conforme a equipe decidir. Não há deploy automático neste workflow.

## Produção, em fluxo separado

- [ ] Revisar alternativas acessíveis dos sete vídeos e publicar somente legendas/transcrições revisadas.
- [ ] Recuperar uma fonte íntegra da apresentação de Galixandria antes de voltar a destacá-la; a mitigação estática já está implementada e os vídeos foram preservados.
- [ ] Validar conteúdo, PDFs e experiência assistiva manualmente; confirmar canais externos sem presumir envio.
- [ ] Validar headers, canonical, redirects, 404, downloads e range de vídeo no ambiente real da hospedagem.
- [ ] Fazer backup seguro das fontes privadas e testar recuperação conforme a política da equipe.
- [ ] Publicar somente após autorização específica; esta entrega não inclui deploy.
