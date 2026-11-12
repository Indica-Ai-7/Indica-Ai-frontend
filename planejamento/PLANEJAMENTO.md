# Planejamento do MVP — Indica Aí

## 1. Visão do projeto

O Indica Aí ajuda pessoas indecisas a escolher o que assistir. A pessoa
descreve em linguagem natural o tipo de conteúdo que procura e recebe opções
encontradas em um catálogo local, acompanhadas de informações que ajudam na
decisão.

Este planejamento parte do documento de discovery em `README.md` e organiza o
MVP em cinco etapas implementáveis e verificáveis. A especificação e as tarefas
detalhadas devem ser revisadas pelo grupo no OpenSpec antes de começar a
implementação.

## 2. Escopo do MVP

### Incluído

- Aplicação web responsiva em React e Vite.
- Catálogo local em `db.json`, disponibilizado por uma API HTTP com JSON Server.
- Filmes, séries, documentários, animações e novelas: pelo menos 200 obras
  reais distintas em cada tipo no catálogo inicial.
- Listagem e detalhes de títulos, com gênero, ano, descrição e outros
  metadados disponíveis.
- Cadastro de títulos no catálogo, com validação e comunicação de erros.
- Busca em texto livre interpretada por regras locais sobre os metadados do
  catálogo, sem IA generativa ou serviços externos.
- Recomendações relacionadas à busca, explicação simples da correspondência,
  alternativas quando não houver correspondência exata e possibilidade de
  iniciar outra busca.
- Estados de carregamento, vazio e erro, além de layout utilizável em telas
  menores.

### Fora do MVP

- TMDB, OMDb ou outra API externa de conteúdo.
- API ou serviço externo de IA.
- Cadastro/autenticação de usuários, watchlist/favoritos, histórico de buscas
  e avaliações dos usuários.
- Sincronização de dados entre dispositivos.
- Tipos audiovisuais adicionais além dos cinco priorizados; a estrutura poderá
  aceitá-los futuramente.

## 3. Decisões e restrições

- O `db.json` é a fonte de dados do catálogo durante o MVP; o frontend acessa
  os recursos por HTTP, não importa o arquivo diretamente.
- A aplicação é um projeto React/Vite. Organizar o código nas áreas
  `src/api`, `src/components` e `src/pages`, conforme o requisito do projeto.
- O processamento de texto será local e baseado em critérios presentes nos
  dados, como tipo, gênero, ano, palavras-chave e características descritivas.
  A solução deve explicar os limites dessa interpretação e não prometer
  compreensão equivalente a uma IA.
- A lista local inicial deve ter ao menos 200 registros distintos em cada um
  dos cinco tipos priorizados. O plano não presume que dados de terceiros
  estejam liberados para reutilização: a fonte e a licença de cada conjunto
  precisam ser verificadas e atribuídas. Não copiar sinopses extensas ou
  imagens sem autorização; preferir descrições próprias e um fallback visual
  local quando não houver imagem licenciada.
- Dados e funcionalidades devem ser demonstráveis localmente, com passos
  claros para iniciar o frontend e o JSON Server.

## 4. Etapas de implementação

### Etapa 1 — Catálogo e API HTTP local

**Objetivo:** estabelecer o contrato de dados e disponibilizar o catálogo
inicial por HTTP.

**Trabalho:** definir os campos e tipos dos registros; organizar `db.json` por
recursos; configurar o JSON Server e documentar como iniciá-lo; reunir os dados
de fontes verificadas com atribuição e direitos de uso apropriados.

**Conclusão verificável:**

- O servidor responde às consultas HTTP documentadas e os registros obedecem
  ao contrato de dados.
- Há pelo menos 200 registros distintos para cada um dos cinco tipos
  priorizados, com identificadores estáveis e campos suficientes para
  listagem, detalhes e recomendação.
- A origem e as permissões de reutilização dos dados estão documentadas. Se
  essa meta não puder ser atendida legalmente ou com qualidade, o bloqueio é
  registrado; não se inventam obras ou metadados para preencher a quantidade.

### Etapa 2 — Listagem e detalhes

**Objetivo:** permitir explorar o catálogo e entender as informações de cada
título.

**Trabalho:** implementar chamadas da API em `src/api`, telas em `src/pages` e
componentes reutilizáveis em `src/components`; apresentar categorias, lista,
detalhes e navegação. Tratar carregamento, lista vazia, falhas HTTP e imagens
indisponíveis.

**Conclusão verificável:**

- O conteúdo exibido vem da API local e os detalhes correspondem ao registro
  selecionado.
- Carregamento, vazio, falha e fallback de imagem são visíveis e não simulam
  sucesso.
- As telas permanecem utilizáveis em celular e desktop.

### Etapa 3 — Cadastro de títulos

**Objetivo:** oferecer uma funcionalidade completa de cadastro integrada à
listagem.

**Trabalho:** criar formulário para os campos necessários, validar valores e
tipos, enviar o cadastro ao JSON Server e atualizar a listagem após sucesso.

**Conclusão verificável:**

- Um título válido pode ser cadastrado e aparece na listagem após a resposta
  bem-sucedida da API e também após recarregar a aplicação.
- Campos inválidos ou obrigatórios ausentes recebem mensagens compreensíveis.
- Falhas de comunicação são informadas, preservam os dados preenchidos quando
  possível e nunca exibem uma confirmação falsa de cadastro.

### Etapa 4 — Recomendação por regras locais

**Objetivo:** transformar a descrição do usuário em critérios pesquisáveis e
ordenar sugestões existentes no catálogo.

**Trabalho:** definir regras e correspondências entre texto e metadados;
selecionar e ordenar resultados; indicar, de forma simples, quais critérios
levaram a cada sugestão; definir comportamento para pedidos vazios ou sem
correspondências.

**Conclusão verificável:**

- Exemplos de busca acordados pelo grupo retornam títulos compatíveis com os
  metadados e ordenados de forma consistente.
- O usuário consegue distinguir correspondências de alternativas sugeridas
  quando não há resultado exato.
- Entrada vazia e ausência de resultados têm mensagens e próximos passos
  claros, sem erro silencioso.

### Etapa 5 — Chat e validação integrada

**Objetivo:** conectar a experiência de conversa ao mecanismo de
recomendação e verificar o fluxo completo do MVP.

**Trabalho:** implementar a interface de entrada e resposta, apresentar
recomendações e detalhes, permitir uma nova busca e revisar acessibilidade
básica, responsividade, textos e tratamento de erros.

**Conclusão verificável:**

- O fluxo de descrever uma preferência, receber sugestões, consultar detalhes
  e iniciar outra busca funciona localmente de ponta a ponta.
- Falhas e estados sem resultados continuam claros no fluxo integrado.
- Build e lint do projeto passam; os passos manuais de execução e validação
  estão documentados e podem ser repetidos por outra pessoa do grupo.

## 5. Dependências entre etapas

```text
                  +--> Etapa 2 --> Etapa 3 --+
Etapa 1 ----------|                          +--> Etapa 5
                  +--> Etapa 4 --------------+
```

- A Etapa 1 precede as Etapas 2 e 4.
- A Etapa 2 precede a Etapa 3.
- As Etapas 3 e 4 precedem a integração final da Etapa 5.
- Cada etapa deve incluir suas próprias verificações; a Etapa 5 cobre também
  a integração entre as partes.

## 6. Uso do OpenSpec e trabalho em grupo

1. Usar a mudança guarda-chuva `indicai-mvp` para registrar a proposta geral,
   a spec do MVP e specs menores por capacidade, além do design e das tarefas.
2. Organizar as tarefas em cinco grupos correspondentes às etapas deste
   documento, incluindo dependências e formas de verificar cada tarefa.
3. Ler e revisar em grupo a spec antes de aprovar o plano de implementação;
   ajustar requisitos incorretos ou incompletos nos próprios artefatos.
4. Distribuir as tarefas respeitando as dependências. Cada integrante deve
   manter as decisões e acordos nos artefatos versionados do projeto.
5. Implementar em mudanças pequenas e validar os critérios de cada etapa.
   Arquivar a mudança OpenSpec somente após concluir e revisar o trabalho.

## 7. Riscos e pontos de atenção

- **Volume e licenciamento do catálogo:** 1.000 obras reais exigem uma fonte
  reutilizável e dados consistentes. Verificar a origem, os direitos e a
  atribuição antes de incorporar dados; não presumir que estar disponível na
  web significa estar liberado.
- **Qualidade da recomendação sem IA:** regras locais são mais limitadas.
  Definir metadados úteis, exemplos de busca e critérios de ordenação antes de
  avaliar a relevância.
- **Limitações do JSON Server:** é uma API simulada para desenvolvimento, não
  um backend de produção. Persistência, disponibilidade e gravação concorrente
  devem ser avaliadas antes de qualquer implantação pública.
- **Imagens e sinopses:** direitos de texto e imagem devem ser avaliados
  separadamente dos metadados básicos; usar conteúdo próprio/licenciado e
  fallback local quando necessário.

## 8. Validação do planejamento

Antes de implementar, o grupo deve confirmar que:

- as cinco etapas e seus critérios representam o MVP desejado;
- a meta de 200 obras por tipo é viável com dados de origem e licença
  apropriadas;
- os campos do catálogo são suficientes para listagem, cadastro e regras de
  recomendação;
- cenários de sucesso, entrada inválida, ausência de resultados e falha HTTP
  estão cobertos pelas especificações OpenSpec.
