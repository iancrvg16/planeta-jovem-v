# Inclusão pública solicitada em 30/10/2026

Referência: `autorizacao-responsavel-2026-10-30`.

O responsável solicitou explicitamente a inclusão pública das 11 fotografias, dos três PDFs e do vídeo de Astalania e reiterou possuir autorização total para disponibilizar código e acervo. Os 15 novos registros foram aprovados por essa declaração, com hashes dos derivados públicos. Não foram inventados comprovantes externos, licenças ou revisão de acessibilidade. As decisões de 29/10/2026 e os quatro registros restritos foram preservados. O controle contém agora 149 registros, incluindo 111 mídias do manifesto e os 38 grupos anteriores.

A home mantém “Outras edições” separada dos países atuais. Os documentos aparecem nos países confirmados, no catálogo, nos filtros e na busca, sem duplicação de registros. Os PDFs preservam integralmente os bytes de origem; o gibi de Astalania tem 56.443.981 bytes e gera aviso de tamanho no GitHub. Não há novo bloqueio editorial para esses materiais; executar também `npm run check:github -- --public` para verificar a cobertura por hashes.

O novo vídeo `astalania-video-de-astalania-1d1220c6` está pendente de legendas/transcrição revisadas. Nenhuma foi fornecida no lote. Os sete vídeos do acervo permanecem com pendências de alternativas acessíveis. Os novos PDFs não têm marcação estrutural (Tagged: no); sua acessibilidade assistiva também não foi declarada revisada. A decodificação integral da fonte e a detecção de preto não indicaram trechos pretos no vídeo de Astalania; o problema histórico de Galixandria permanece independente.

Os trechos abaixo preservam o diagnóstico anterior e seus números históricos; não representam novo bloqueio sobre os materiais autorizados.

---

# Atualização da autorização de publicação

Referência: `autorizacao-responsavel-2026-10-29`.

Em 29/10/2026, o responsável declarou possuir autorização total para disponibilizar publicamente o código e o acervo no GitHub. Os registros pendentes foram atualizados com base nessa declaração. Os registros restritos permanecem restritos. Esta decisão substitui o bloqueio editorial descrito no diagnóstico histórico abaixo; não encerra as pendências técnicas ou de acessibilidade nem adiciona uma licença de reutilização.

---

# Situação de publicação, direitos e acessibilidade

A organização do projeto para GitHub não concede licença sobre código, imagens, nomes, vozes ou documentos. Nenhuma licença nova foi adicionada. A decisão sobre licença do código permanece com o titular; licenças de fontes e dependências existentes foram preservadas.

## Controle por material

[publication-status.json](publication-status.json) contém 134 registros iniciais, identificados por IDs opacos e hashes dos arquivos públicos correspondentes. Não contém nomes, caminhos brutos, documentos pessoais, comprovantes ou presunções de idade. São 96 registros do manifesto e 38 grupos de assets complementares. Os quatro registros de fontes textuais privadas estão marcados como restritos; os demais aguardam confirmação. Não se transformou observação visual ou disponibilidade na web em autorização.

Estados:

- `aprovado-com-evidencia`: decisão registrada com referência não pessoal e escopo que inclua a distribuição pretendida.
- `pendente`: decisão ainda não comprovada nos materiais acessíveis; não significa irregularidade demonstrada.
- `restrito`: fonte privada fora do conjunto público; se houver arquivos públicos vinculados a um registro restrito, o gate de publicação deve bloqueá-los.

O responsável pode relacionar os hashes ao inventário local e aos arquivos públicos sem publicar nomes ou comprovantes. Atualizar `evidenceRef` apenas com código da decisão, sem URL de documento pessoal. Comprovantes e contatos de responsáveis ficam em armazenamento privado, ou em `_privado/` com backup adequado, fora de Git e deploy. Para novas mídias, inserir novos registros e conferir os hashes; não reutilizar aprovação para bytes diferentes sem avaliar o escopo.

`npm run check:github` verifica o conjunto candidato e registra `publicReleaseBlocked`; retorno zero comprova apenas ausência dos padrões técnicos pesquisados. `npm run check:github -- --public` também exige decisões de publicação aprovadas e retorna código 2 enquanto houver pendências públicas. Nenhuma dessas verificações substitui revisão humana ou determina a validade jurídica de um comprovante.

**Repositório público bloqueado editorialmente:** o acervo público inclui retratos/representações, vozes, créditos, artes e documentos cuja redistribuição no GitHub precisa de confirmação. Os manifestos e dados editoriais também carregam nomes de arquivos/créditos que dependem dessa revisão. As fontes brutas foram preservadas, não apagadas. Repositório privado também exige escolha de acesso e política adequados; não presumir autorização automática para compartilhamento.

## Vídeo destacado

As duas cópias disponíveis da fonte da apresentação de Galixandria são idênticas. A análise da fonte confirmou imagem preta entre aproximadamente 25,57 e 166,83 segundos. Não houve recuperação nem corte de áudio. A home agora destaca a bandeira e leva ao país. O MP4 e as fontes permanecem preservados; o vídeo continua no acervo para decisão editorial. Confirmar nova fonte íntegra antes de voltar a promovê-lo.

## Legendas e transcrições

A infraestrutura em `src/data/mediaAccessibility.ts` permite estado pendente ou revisado, `evidenceId`, trilhas WebVTT com idioma/rótulo e transcrição textual. O player só usa o estado revisado com referência preenchida. Colocar arquivos revisados em `public/legendas/`, com nomes normalizados, e registrar a decisão antes de adicioná-los ao mapa. `npm run test:conteudo` confere IDs, caminhos, cabeçalho WebVTT e os campos obrigatórios; os testes de navegador verificam carregamento e seleção com uma fixture sintética.

O mapa de publicação começa vazio: **nenhum rascunho foi declarado revisado**. Os seis vídeos abaixo continuam pendentes de revisão humana e de alternativas equivalentes, conforme suas falas/sons reais:

| Identificador de vídeo                              | Situação                          |
| --------------------------------------------------- | --------------------------------- |
| `galixandria-1000396178-20731d3c`                   | Pendente                          |
| `galixandria-1000401158-3d988ebd`                   | Pendente; fonte visual defeituosa |
| `galixandria-1000403940-7e5cc7ae`                   | Pendente                          |
| `jambor-jambor-e-soberania-digital-fd269745`        | Pendente                          |
| `jambor-projeto-nascente-8d0a6246`                  | Pendente                          |
| `jambor-solberania-digital-de-pais-jambor-2ee4438c` | Pendente                          |

Esses IDs correspondem ao manifesto atual. Não confundir a legenda sintética em `tests/fixtures/` com uma transcrição de participantes. Presença de `<track>` em fixture ou aprovação em axe não encerra a acessibilidade audiovisual. PDFs e navegação com tecnologia assistiva também exigem aceite humano.

## Limites de arquivos e estratégia

O maior arquivo público atual tem 9.071.710 bytes (menos de 9 MiB). O conjunto candidato está muito abaixo de 1 GiB, sem arquivo acima de 50 MiB após os ignores. Portanto não foi configurado Git LFS nem removida mídia necessária.

Segundo os [limites oficiais do GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), arquivos acima de 50 MiB geram aviso e acima de 100 MiB são bloqueados pelo Git normal; upload pelo navegador limita cada arquivo a 25 MiB. Consulta realizada nesta entrega. Preferir o envio por Git após revisão, sem presumir que tamanho aceitável comprove direitos de publicação.

Se futuramente houver arquivos maiores, escolher estratégia antes de adicioná-los: LFS exige download dos objetos no clone/CI e suporte na hospedagem; URLs externas exigem disponibilidade e política de acesso. Não migrar histórico nem trocar a estratégia de mídia indiscriminadamente.

## Evidências históricas e privacidade

Relatório técnico original, documentação anterior, capturas e evidências de validação permanecem locais e foram ignorados para o conjunto GitHub por conterem detalhes internos/caminhos pessoais. O README anterior está preservado localmente em `docs/README-before-github.md`. O arquivo `docs/inventario-anterior.json` continua incluído porque verifica os bytes originais no teste de conteúdo; sua manutenção não representa licença de redistribuição dos materiais referidos.

Os scripts não alteram o histórico Git. Neste workspace, metadados Git válidos não estão acessíveis, portanto arquivos já rastreados, remotes e segredos no histórico não puderam ser inspecionados. Revisar na cópia original antes de qualquer publicação; `.gitignore` não remove arquivos rastreados nem apaga histórico.
