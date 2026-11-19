# Contrato do catálogo

Contrato aprovado pelo grupo, conforme confirmação recebida em 16/11/2026.
Aplica-se aos registros de `titulos` no `db.json` e aos futuros cadastros.

| Campo | Tipo | Obrigatoriedade e validação |
| --- | --- | --- |
| `id` | texto | Obrigatório, não vazio, único e imutável. Em importações, derivado da fonte; em novos cadastros, UUID. |
| `titulo` | texto | Obrigatório e não vazio. |
| `tipo` | texto | Obrigatório: `filme`, `serie`, `documentario`, `animacao` ou `novela`. |
| `ano` | inteiro | Obrigatório, entre 1888 e o ano corrente mais um, inclusive. |
| `generos` | lista de textos | Obrigatória, não vazia; cada gênero deve ser um texto não vazio. |
| `descricao` | texto | Obrigatória, não vazia, própria ou de uso autorizado. |
| `avaliacao` | número | Opcional, entre 0 e 10, inclusive. |
| `imagem` | texto | Opcional; URL HTTP(S) de imagem autorizada. A interface deve usar fallback local quando estiver ausente ou indisponível. |
| `palavrasChave` | lista de textos | Obrigatória, podendo ser vazia; cada item deve ser um texto não vazio. |
| `fonte` | objeto | Obrigatório para obras importadas, com identificação da fonte e URL do registro. |

O objeto `fonte` contém `nome` e `url`, ambos textos não vazios; `url` deve
ser uma URL HTTP(S). A fonte continua obrigatória para obras importadas. Os
novos cadastros manuais feitos pela interface podem omitir a fonte, inclusive
quando informarem avaliação; registros já existentes não são alterados.
Campos opcionais ausentes são omitidos, não preenchidos com valores inventados.

A licença, as permissões e as atribuições aplicáveis devem ser documentadas
antes da inclusão de dados. Direitos sobre imagens e textos devem ser
verificados separadamente dos metadados. O catálogo inicial deve conter ao
menos 200 obras distintas em cada um dos cinco tipos; impedimentos de volume
ou de permissão devem ser registrados como bloqueios.
