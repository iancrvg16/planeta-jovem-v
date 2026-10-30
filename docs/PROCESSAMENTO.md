# Processamento do acervo e recuperação

O build normal usa `public/` e os manifestos incluídos. Não executar conversão apenas para iniciar o site. Novas fontes ficam privadas em `_entregas/FASE N/País Nome/Atividade N/`; não colocar comprovantes ou fontes brutas no GitHub.

## Ferramentas

Python 3.10+ e Pillow fixado em `requirements-tools.txt`. O processamento transacional usa `fcntl.flock`, portanto requer Linux/macOS/WSL e sistema de arquivos local com locks e substituição atômica por arquivo. A suíte sintética usa somente Pillow e Python. FFmpeg/Poppler/Ghostscript não são necessários no CI da suíte sintética.

Para vídeos: `ffmpeg` com encoder `libx264`, AAC, e `ffprobe`. PDFs: Poppler (`pdfinfo`, `pdftotext`, `pdfimages`), mais `gs` para compressão quando necessária. AVIF usa Pillow ou FFmpeg com `libaom-av1`. Ferramentas são verificadas antes da geração; erro de conversão nunca deve substituir o publicado.

`FFMPEG_BINARY` permite selecionar um executável; o fallback local de ferramentas privadas é preservado. `AVIF_FFMPEG_BINARY` seleciona o conversor AVIF. O ambiente precisa disponibilizar as bibliotecas correspondentes; não há binários de ferramentas empacotados no Git.

## Fluxo

```bash
python3 scripts/processar-entregas.py --check
npm run processar:entregas
# Fonte explícita: precisa existir; erro útil se ausente.
python3 scripts/processar-entregas.py --hero caminho/fonte-aprovada.jpg
# Especialista também usa a mesma trava e transação:
python3 scripts/processar-lervuria.py --origem caminho/Atividade-1
```

1. Obtém trava não bloqueante `.media-processing.lock`. O arquivo pode permanecer após execução; a existência dele não significa lock ativo. Não apagar para tentar liberar uma execução.
2. Recupera eventual journal anterior antes de processar novas entradas.
3. Prepara staging `.media-stage-*` no mesmo sistema de arquivos, com cópias dos derivados e manifestos existentes. Verifica fontes e ferramentas antes de gerar.
4. Faz toda conversão e escrita de metadados no staging. Fontes ausentes não excluem países anteriores. Hero anterior é preservado quando não há fonte substituta; se ele também estiver ausente, solicita uma fonte. Não depende incondicionalmente de um PDF específico de outro país.
5. Valida mesclagem, unicidade e existência de derivados. Gera backups, journal persistido e substitui apenas arquivos com bytes diferentes.
6. Em exceção durante publicação, restaura arquivos anteriores e remove novos arquivos daquela transação. Após interrupção abrupta, a próxima execução recupera pelo journal antes de continuar.

O conjunto de múltiplos arquivos não é uma troca atômica para leitores concorrentes: **não executar build/deploy durante importação**. A trava impede dois importadores; não bloqueia um processo de build independente. O cache de conversão da execução fica no staging e é descartado; o inventário anterior semeia o reaproveitamento por hash. Não se elimina nenhum derivado antigo automaticamente.

Se a recuperação falhar, preserve `.media-transaction.json` e o staging nele indicado; o próximo processamento tentará novamente. Verifique espaço/permissões do disco e restaure a condição operacional antes de repetir. Não apagar backups/journal manualmente. Uma interrupção durante geração, antes de criar journal, pode deixar staging órfão: confirmar que não há execução ativa antes de limpeza manual. Não há promessa de tolerância a corrupção física de disco.

Testes usam diretórios temporários e fontes sintéticas: importação parcial geral e Lervúria, hero obrigatório ausente, derivado anterior ausente, ferramenta ausente, falha depois de gerar derivado, falha durante publicação, concorrência entre processos e interrupção abrupta com recuperação. Comando: `npm run test:python`.

Após importar, revise editorialmente os dados, execute build, testes e validações, e atualize o controle de publicação. Este pipeline não decide consentimento, licença, créditos nem revisão de legendas.

## Entrega de 30/10/2026

`python3 scripts/importar-atualizacao.py` importa somente o lote nomeado, reutilizando `media_transaction.transaction` e as variantes do processador geral. O registro de publicação participa da mesma transação dos derivados e manifestos. Não executar build durante a importação. O mapeamento explícito impede associar o vídeo de Astalania a Galixandria ou fotos de outras edições a países atuais. Fase e atividade desconhecidas usam `nao-informada` e `0` como sentinelas internas; não são apresentadas como números reais.

O importador informa cada fonte ausente e continua os materiais independentes. Hashes repetidos reutilizam o registro existente; nova execução não reconverte arquivos já importados. Uma fonte alterada não substitui silenciosamente PDFs/vídeos publicados: colisões de destino ou de identidade interrompem a transação. O processador geral exclui este lote de sua descoberta, preserva seus registros e mantém os campos editoriais no manifesto público.

PDFs desta entrega são copiados sem compressão, conferidos por tamanho e SHA-256 no teste de conteúdo, com limite de 100 MiB. Somente a primeira página é rasterizada para a capa. As fotografias e capas são convertidas em WebP sem EXIF, sem recortes, com variantes até 1600 px. O vídeo original de 11.918.662 bytes excede o orçamento existente de 10 MiB: a versão pública H.264/yuv420p tem 8.287.143 bytes, faststart, mesmas dimensões e duração e áudio AAC copiado sem recodificação. O quadro de capa vem de 12 segundos. Os JSONs gerados são formatados explicitamente pelo Prettier local, pois estão excluídos da formatação geral.
