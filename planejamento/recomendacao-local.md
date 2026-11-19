# Recomendação por regras locais

Regras adotadas para a Etapa 4 do MVP em 19/11/2026. O mecanismo trabalha
somente com os metadados recebidos do catálogo e não utiliza IA generativa,
serviços externos, histórico do usuário ou dados inventados.

## Normalização da entrada

- Remover espaços nas extremidades e reduzir espaços repetidos.
- Converter o texto para minúsculas e remover acentos.
- Desconsiderar pontuação ao reconhecer termos.
- Reconhecer palavras completas e expressões compostas, evitando que partes de
  uma palavra sejam tratadas como critérios.

Assim, por exemplo, `FICÇÃO CIENTÍFICA`, `ficcao cientifica` e
`ficção-científica` produzem os mesmos critérios.

## Critérios reconhecidos

| Critério | Origem no catálogo | Exemplos de termos | Peso |
| --- | --- | --- | ---: |
| Tipo | `tipo` | filme, série, documentário, animação, novela | 30 |
| Gênero | `generos` | ação, aventura, comédia, drama, fantasia, ficção científica, romance, terror | 40 |
| Ano | `ano` | 2005, de 2005 | 25 |
| Década | `ano` | anos 80, década de 1990 | 20 |

Os aliases controlados traduzem variações usuais para valores presentes nos
metadados. Por exemplo, `sci-fi` corresponde a gêneros que contêm
`ficção científica`, e `desenho` pode indicar o tipo `animacao`. Quando dois
aliases representam o mesmo critério, ele é considerado apenas uma vez.

## Pontuação e ordenação

Cada título recebe a soma dos pesos dos critérios atendidos. Uma
**correspondência** atende a todos os critérios reconhecidos. Se nenhum título
atende a todos, os títulos que atendem a pelo menos um critério são apresentados
como **alternativas**.

A ordenação é estável e determinística:

1. maior pontuação;
2. maior quantidade de critérios atendidos;
3. título normalizado em ordem alfabética;
4. identificador estável em ordem alfabética.

Cada resultado conserva os critérios atendidos e gera uma explicação curta a
partir deles. A avaliação opcional não é usada como desempate porque o catálogo
inicial não possui cobertura suficiente desse campo.

## Estados de resultado

| Estado | Condição | Próximo passo |
| --- | --- | --- |
| `empty-request` | Entrada vazia ou apenas com espaços | Pedir uma preferência com tipo, gênero ou período |
| `match` | Existe título que atende a todos os critérios | Exibir correspondências e suas explicações |
| `alternatives` | Há relações parciais, mas nenhuma correspondência exata | Informar a ausência de match exato e sugerir simplificar a busca |
| `no-results` | Nenhum critério é reconhecido ou nenhum título atende aos critérios | Sugerir termos suportados ou outra preferência |

## Buscas de referência

Com o catálogo versionado na data de adoção, a ordem inicial esperada é:

| Busca | Critérios | Primeiros resultados esperados |
| --- | --- | --- |
| `filme de ficção científica` | tipo filme + gênero ficção científica | `51`, `A Origem`, `Alien Raiders` |
| `animação de fantasia dos anos 2000` | tipo animação + gênero fantasia + década 2000 | `9`, `A Christmas Carol`, `A Fuga das Galinhas` |
| `documentário de 2005` | tipo documentário + ano 2005 | `12 Tangos`, `A Marcha dos Pinguins`, `Crossing the Bridge: The Sound of Istanbul` |

Os testes conferem tanto esses exemplos reais quanto catálogos sintéticos para
validar empates, equivalência de normalização, explicações e todos os estados.
Se o catálogo mudar, a coerência com os metadados e a estabilidade da ordenação
devem ser revalidadas antes de atualizar os resultados esperados.

## Limites conhecidos

- O mecanismo não compreende intenção geral, ironia, contexto emocional ou
  significados que não estejam nos aliases controlados.
- Descrições e palavras-chave não são interpretadas livremente nesta etapa; a
  qualidade depende dos tipos, gêneros e anos disponíveis.
- Pedidos contraditórios ou com vários valores para o mesmo critério não recebem
  inferência semântica: somente os valores reconhecidos são avaliados.
- Os resultados não são personalizados e não usam histórico.
- Uma mensagem de ausência de resultados significa falta de relação pelas regras
  locais, não inexistência de obras adequadas fora do catálogo.
