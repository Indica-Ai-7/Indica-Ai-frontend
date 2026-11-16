# Fontes do catálogo

## Wikidata — dados estruturados do catálogo

- Fonte: [Wikidata](https://www.wikidata.org/).
- Permissão: os dados estruturados dos espaços principais do Wikidata são
  disponibilizados sob [CC0](https://www.wikidata.org/wiki/Wikidata:Licensing).
- Atribuição: não é obrigatória para esses dados, mas o Wikidata solicita que
  sua origem seja mencionada. Os registros importados devem identificar a
  fonte e a URL de cada item, conforme o contrato.
- Acesso: a [documentação de acesso](https://www.wikidata.org/wiki/Wikidata:Data_access)
  descreve consulta e limites de uso.
- Campos: há propriedades para
  [gênero](https://www.wikidata.org/wiki/Property:P136) e
  [data de lançamento](https://www.wikidata.org/wiki/Property:P577).
  [Avaliações](https://www.wikidata.org/wiki/Property:P444) podem ter fontes
  e escalas diferentes; não há comprovação de uma classificação uniforme dos
  200 filmes mais bem avaliados.
- Importação realizada em 16/11/2026: `db.json` contém 200 registros em cada
  um dos cinco tipos, obtidos com `node scripts/importar-catalogo-wikidata.mjs`.
  Cada registro identifica o item original. O script seleciona filmes, séries
  e filmes de animação pela classe; documentários e novelas pelo gênero,
  exigindo também a classe filme para documentários. Título, descrição curta
  e gênero usam português quando disponível, ou inglês. O ano vem da data de
  lançamento ou, quando ausente, da data de início. Não há avaliações nem
  imagens importadas; os filmes não são apresentados como um ranking.
  O importador não sobrescreve um `db.json` existente.
- Limites: a licença dos dados estruturados não autoriza automaticamente
  imagens, textos de outros sites ou conteúdos em outros espaços de nomes.
  Cada conteúdo externo precisa de permissão própria. Não importar imagens,
  sinopses externas ou avaliações sem verificar sua origem e licença.

## IMDb — uso no catálogo compartilhado não autorizado

Os [datasets não comerciais do IMDb](https://data.imdb.com/non-commercial-datasets/)
contêm títulos, gêneros e avaliações, mas não fornecem descrições nas tabelas
de títulos e avaliações documentadas. A
[política de uso não comercial](https://help.imdb.com/article/imdb/general-information/can-i-use-imdb-data-in-my-software/G5JTRESSHJBBHTGX)
restringe o uso a fins pessoais e não comerciais e proíbe alterar ou republicar
os dados para criar um banco de informações de filmes, exceto para uso pessoal
individual. Também exige atribuição e proíbe coleta por scraping do site.

A documentação oficial descreve a
[API do IMDb no AWS Data Exchange](https://data.imdb.com/documentation/),
com acesso sujeito a assinatura. Sem uma licença que permita o catálogo
compartilhado do projeto, os dados e avaliações do IMDb não serão incluídos.
Uma API de terceiros não elimina a necessidade de verificar esses direitos.

## JSON Movie Collection — permissões e avaliações pendentes

- Fonte indicada: [mikeleguedes/json-movie-list](https://github.com/mikeleguedes/json-movie-list).
- O repositório descreve uma coleção colaborativa de filmes, mas não
  apresenta uma licença identificada pelo GitHub. Sua descrição sugere uso
  livre, sem esclarecer as condições de redistribuição dos dados.
- O [guia de contribuição](https://github.com/mikeleguedes/json-movie-list/blob/master/contributing.markdown)
  solicita sinopses oficiais, mas não comprova permissão dos titulares para
  copiá-las ou redistribuí-las. Essas sinopses não devem ser importadas sem
  autorização verificável.
- O [README](https://github.com/mikeleguedes/json-movie-list/blob/master/readme.markdown)
  descreve título, ano, categorias e sinopse, entre outros campos, mas não
  informa avaliações; portanto, não comprova quais são os 200 filmes mais
  bem avaliados.
- O repositório também inclui um
  [script de scraping do ranking do IMDb](https://github.com/mikeleguedes/json-movie-list/blob/master/scraper/scraper.md).
  Sua presença não comprova que os arquivos de filmes vieram desse script,
  mas os direitos e a origem de cada conjunto ainda precisam ser verificados.

## MovieLens — opção para pesquisa de avaliações

O [MovieLens](https://grouplens.org/datasets/movielens/) oferece conjuntos
de avaliações para pesquisa e educação. O mantenedor informa que normalmente
não permite redistribuição pública; é necessário conferir a licença do
conjunto escolhido e obter autorização antes de distribuir dados derivados.
As avaliações são do MovieLens, não do IMDb.

## Verificação do catálogo

Execute `node scripts/verificar-catalogo.mjs` para conferir campos, IDs,
duplicações por título e ano, e quantidades por tipo. A verificação automática
não substitui a revisão de qualidade dos dados colaborativos do Wikidata.
