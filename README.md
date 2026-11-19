# Indica-Ai-frontend

## Catálogo local

Instale as dependências com `npm install` e inicie a API em outro terminal:

```sh
npm run api
```

O JSON Server usa `db.json` e responde em `http://localhost:3001`:

- `GET /titulos`: lista os títulos.
- `GET /titulos?tipo=filme`: filtra pelo tipo.
- `GET /titulos?_page=1&_limit=20`: retorna uma página de títulos.
- `GET /titulos/<id>`: consulta um título pelo identificador.
- `POST /titulos`: cadastra um objeto JSON conforme o
  [contrato do catálogo](planejamento/contrato-catalogo.md).

O servidor é uma ferramenta local de desenvolvimento e não valida o
contrato por conta própria. Para verificar os campos e a quantidade por tipo:

```sh
node scripts/verificar-catalogo.mjs
```

O catálogo atual contém ao menos 200 registros em cada um dos cinco tipos. Consulte as
[fontes e limitações dos dados](planejamento/fontes-catalogo.md).

## Interface do catálogo

Inicie o frontend em outro terminal:

```sh
npm run dev
```

Abra `http://localhost:5173/`. A página inicial lista os títulos retornados por
`GET /titulos`, com busca por título, gênero, descrição ou palavra-chave e
filtros pelos cinco tipos. A busca ignora diferenças de acentuação. A lista
mostra 24 itens por vez; use **Carregar mais títulos** para revelar os
próximos.

Selecione um título para abrir seus detalhes. O identificador fica no parâmetro
`?titulo=<id>`, então a página de detalhes também pode ser aberta diretamente;
voltar no navegador retorna ao catálogo. Os detalhes vêm de
`GET /titulos/<id>` e mostram os campos disponíveis, incluindo gêneros,
descrição, avaliação e fonte.

Durante a consulta, a interface mostra placeholders de carregamento. Uma
resposta bem-sucedida sem registros mostra o estado de catálogo vazio; filtros
sem resultados mostram uma mensagem própria; falhas da API exibem erro e uma
ação de nova tentativa. Capas ausentes ou URLs de imagem indisponíveis recebem
um fallback tipográfico local, sem criar imagens ou metadados para o título.

## Cadastro de títulos

Use **Cadastrar título** no cabeçalho para abrir o formulário. Título, tipo,
ano, gêneros e descrição são obrigatórios. O título não pode ficar vazio; o
tipo deve ser um dos cinco tipos do catálogo; o ano deve ser inteiro entre
1888 e o próximo ano; e os gêneros devem conter pelo menos um item separado
por vírgula. A descrição deve conter texto.

Palavras-chave podem ficar vazias; quando preenchidas, aceitam uma lista
separada por vírgulas. A avaliação opcional deve estar entre 0 e 10. A URL da
imagem, quando informada, deve usar HTTP ou HTTPS. O formulário não solicita
fonte de dados e permite informar avaliação sem fonte; registros importados já
existentes mantêm seus dados de origem. O identificador é gerado como UUID e
não precisa ser preenchido.

O formulário mostra erros junto aos campos correspondentes e preserva os
valores quando a API rejeita ou não recebe o envio. A confirmação aparece
somente após uma resposta HTTP bem-sucedida; então a listagem é atualizada a
partir da API e uma notificação discreta aparece no canto inferior direito.
Ela desaparece automaticamente após alguns segundos ou pode ser dispensada.
Para conferir a persistência, recarregue a página depois de cadastrar e
verifique se o registro continua no catálogo.

Exemplo válido conforme o contrato (na interface, o UUID é gerado
automaticamente):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Horizonte Azul",
  "tipo": "filme",
  "ano": 2024,
  "generos": ["drama", "aventura"],
  "descricao": "Uma jornada por lugares desconhecidos.",
  "palavrasChave": []
}
```

Este exemplo é inválido: título e descrição vazios, tipo não permitido, ano
fora do intervalo e lista de gêneros vazia.

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "",
  "tipo": "outro",
  "ano": 1887,
  "generos": [],
  "descricao": "",
  "palavrasChave": []
}
```

Para executar os testes focados da interface:

```sh
npm test
```

## Recomendação local

O motor da Etapa 4 está em
`src/recommendations/localRecommendation.js`. Ele recebe uma preferência e a
lista retornada pela API, reconhece tipos, gêneros, anos e décadas por regras
locais e devolve um destes estados: `empty-request`, `match`, `alternatives` ou
`no-results`. Cada sugestão contém pontuação, critérios atendidos e uma
explicação derivada desses critérios.

As mesmas entradas sobre o mesmo catálogo sempre usam a mesma ordenação. O
motor não utiliza IA generativa, serviços externos, histórico ou inferências
além dos termos controlados. Consulte as
[regras, buscas de referência e limites](planejamento/recomendacao-local.md).

Para validar somente a recomendação:

```sh
npm test -- --run src/recommendations/localRecommendation.test.js
```

## Interface de recomendação

Com a API e o frontend em execução, use **Recomendar** no cabeçalho ou abra
`http://localhost:5173/?recomendar=1`. Descreva uma preferência com tipo,
gênero, ano ou década, como `filme de ficção científica dos anos 90`, e use
**Buscar sugestões**. A interpretação e a ordenação acontecem no navegador com
as regras locais da Etapa 4; o formulário não envia a descrição para um serviço
externo.

Cada resultado informa por que foi selecionado. Se não houver correspondência
exata, a interface diferencia as alternativas relacionadas. Selecione um card
para consultar os detalhes e use **Voltar às recomendações** para preservar a
consulta. **Fazer nova busca** limpa o resultado anterior e devolve o foco ao
campo de preferência. Entrada vazia, ausência de resultado e indisponibilidade
da API apresentam orientação própria.

## Validação integrada do MVP

1. Instale as dependências com `npm install`.
2. Em um terminal, execute `npm run api`.
3. Em outro, execute `npm run dev` e abra `http://localhost:5173/`.
4. Confirme que o catálogo abre, que um título exibe seus detalhes e que o
   formulário de cadastro apresenta validações por campo.
5. Abra **Recomendar**, pesquise `filme de ficção científica dos anos 90`,
   consulte um resultado, volte às recomendações e inicie uma nova busca.
6. Pare temporariamente a API, recarregue a recomendação e confirme a mensagem
   de falha; reinicie a API e use **Tentar novamente**.
7. Repita o fluxo em largura de celular e percorra os controles com `Tab`,
   verificando o foco visível e a ativação por teclado.
8. Execute a validação automatizada:

```sh
node scripts/verificar-catalogo.mjs
npm test
npm run lint
npm run build
npx --yes @fission-ai/openspec@latest validate indicai-mvp --strict
```

O registro da execução final da Etapa 5 está em
[`planejamento/tarefas/tarefa-etapa-5-chat-validacao.md`](planejamento/tarefas/tarefa-etapa-5-chat-validacao.md).



# Documento de Discovery – Projeto Indica Aí

Documento de concepção e levantamento inicial de requisitos de software

# INDICA AÍ

Plataforma inteligente de recomendação de filmes

| Informação | Descrição                            |
| ---------- | ------------------------------------ |
| Projeto    | Indica Aí                            |
| Categoria  | Sistema de recomendação              |
| Área       | Tecnologia e entretenimento          |
| Etapa      | Discovery                            |
| Tipo       | Aplicação web                        |
| Objetivo   | Recomendação personalizada de filmes |

## 1. Introdução

O Indica Aí é uma plataforma digital desenvolvida com o propósito de facilitar a escolha de filmes por meio de recomendações personalizadas.

A aplicação permitirá que os usuários informem suas preferências de acordo com o que desejam assistir naquele momento. Com base nessas informações, o sistema apresentará sugestões de filmes que possuam características semelhantes à busca realizada.

A proposta busca proporcionar uma experiência mais dinâmica e intuitiva, permitindo que os usuários encontrem filmes de acordo com seus interesses atuais, sem depender exclusivamente de históricos de visualização ou recomendações genéricas.

## 2. Contextualização do problema

Com o crescimento das plataformas de streaming, a quantidade de filmes disponíveis aumentou significativamente. Apesar da variedade de conteúdos, escolher o que assistir tornou-se uma dificuldade recorrente para muitos usuários.

Entre os principais problemas identificados estão:

- Grande quantidade de filmes disponíveis, dificultando a escolha.
- Dificuldade em encontrar filmes que correspondam ao interesse atual.
- Recomendações baseadas principalmente no histórico de visualização.
- Falta de sugestões específicas a partir de descrições personalizadas.
- Tempo excessivo gasto procurando algo interessante para assistir.

Dessa forma, identifica-se uma oportunidade de desenvolver uma ferramenta que simplifique esse processo e ofereça recomendações mais alinhadas às necessidades momentâneas dos usuários.

## 3. Justificativa

O desenvolvimento do Indica Aí justifica-se pela necessidade de melhorar a experiência de descoberta de filmes.

As plataformas tradicionais geralmente utilizam algoritmos baseados no comportamento anterior dos usuários. Entretanto, as preferências podem mudar de acordo com o momento, fazendo com que recomendações anteriores nem sempre sejam relevantes.

O Indica Aí pretende explorar uma abordagem complementar, permitindo que o próprio usuário informe o que deseja assistir, considerando fatores como gênero, temática, duração, estilo narrativo e até mesmo seu estado de espírito.

Assim, o projeto busca oferecer maior autonomia ao usuário e tornar o processo de escolha mais eficiente.

## 4. Objetivos

### 4.1 Objetivo geral

Desenvolver uma aplicação web capaz de recomendar filmes de maneira personalizada, utilizando as preferências informadas pelos usuários para identificar e apresentar títulos relacionados às suas buscas.

### 4.2 Objetivos específicos

- Desenvolver uma interface intuitiva para interação com os usuários.
- Permitir pesquisas por texto livre e preferências específicas.
- Implementar um mecanismo de recomendação de filmes.
- Apresentar informações relevantes sobre os filmes recomendados.
- Permitir a aplicação de filtros para refinar os resultados.
- Proporcionar uma experiência de descoberta de novos conteúdos.
- Avaliar a relevância das recomendações apresentadas.

## 5. Público-alvo

O sistema será direcionado a pessoas que consomem filmes e encontram dificuldades para escolher o que assistir.

Perfis de usuários identificados:

| Perfil           | Necessidade                                       |
| ---------------- | ------------------------------------------------- |
| Usuário indeciso | Encontrar rapidamente algo para assistir.         |
| Cinéfilo         | Descobrir filmes semelhantes aos seus favoritos.  |
| Usuário casual   | Receber sugestões sem precisar pesquisar muito.   |
| Explorador       | Encontrar filmes de gêneros e estilos diferentes. |

## 6. Proposta de solução

O Indica Aí funcionará como um mecanismo de descoberta de filmes baseado nas preferências momentâneas dos usuários.

O usuário poderá acessar a plataforma e descrever o tipo de filme que deseja assistir. O sistema interpretará essas informações e realizará uma busca para identificar títulos compatíveis.

### 6.1 Fluxo de utilização

1\. Acesso à plataforma

O usuário acessa o Indica Aí.

2\. Informar preferências

Descreve o filme que deseja assistir.

3\. Processamento da busca

O sistema interpreta os critérios informados.

4\. Geração das recomendações

São identificados filmes relacionados à pesquisa.

5\. Apresentação dos resultados

O usuário visualiza os filmes recomendados e suas informações.

## 7. Requisitos funcionais

Os requisitos funcionais representam as funcionalidades que o sistema deverá oferecer aos usuários.

| ID   | Requisito                   | Descrição                                                   | Prioridade |
| ---- | --------------------------- | ----------------------------------------------------------- | ---------- |
| RF01 | Pesquisa personalizada      | Permitir que o usuário informe suas preferências por texto. | Alta       |
| RF02 | Recomendação de filmes      | Apresentar filmes relacionados à pesquisa realizada.        | Alta       |
| RF03 | Detalhes do filme           | Exibir título, sinopse, gênero, avaliação e imagem.         | Alta       |
| RF04 | Filtros de pesquisa         | Permitir filtrar por gênero, ano e avaliação.               | Média      |
| RF05 | Filmes favoritos            | Permitir salvar filmes de interesse.                        | Média      |
| RF06 | Histórico de buscas         | Armazenar pesquisas realizadas pelo usuário.                | Baixa      |
| RF07 | Recomendações semelhantes   | Sugerir filmes relacionados a um título específico.         | Média      |
| RF08 | Avaliação das recomendações | Permitir que o usuário indique se gostou das sugestões.     | Baixa      |

## 8. Requisitos não funcionais

Os requisitos não funcionais estabelecem características relacionadas à qualidade e ao funcionamento da aplicação.

| ID    | Requisito        | Descrição                                                            |
| ----- | ---------------- | -------------------------------------------------------------------- |
| RNF01 | Usabilidade      | A interface deve ser intuitiva e de fácil utilização.                |
| RNF02 | Desempenho       | As recomendações devem ser apresentadas em tempo adequado.           |
| RNF03 | Responsividade   | A aplicação deve funcionar em computadores, tablets e smartphones.   |
| RNF04 | Segurança        | Os dados dos usuários devem ser protegidos.                          |
| RNF05 | Disponibilidade  | O sistema deve estar disponível para utilização sempre que possível. |
| RNF06 | Manutenibilidade | O código deve permitir futuras alterações e melhorias.               |
| RNF07 | Compatibilidade  | A aplicação deve funcionar nos principais navegadores modernos.      |

## 9. Regras de negócio

- RN01: O sistema deverá utilizar as preferências informadas na pesquisa para gerar recomendações.
- RN02: Os filmes apresentados deverão possuir alguma relação com os critérios informados.
- RN03: Caso não sejam encontrados resultados compatíveis, o sistema deverá apresentar sugestões alternativas.
- RN04: O usuário poderá refinar sua pesquisa utilizando filtros.
- RN05: As recomendações deverão apresentar informações suficientes para auxiliar na escolha do filme.
- RN06: O histórico de pesquisas não deverá limitar as preferências informadas na busca atual.

## 10. MVP – Produto Mínimo Viável

O MVP (Minimum Viable Product) representa a primeira versão funcional do Indica Aí, contendo somente as funcionalidades essenciais para validar a proposta do projeto.

Escopo inicial recomendado

| Funcionalidade                 | Descrição                                     |
| ------------------------------ | --------------------------------------------- |
| Tela inicial                   | Apresentação do sistema e campo de pesquisa.  |
| Pesquisa por texto             | Usuário descreve o que deseja assistir.       |
| Processamento das preferências | Identificação dos critérios da pesquisa.      |
| Recomendações                  | Apresentação de filmes relacionados.          |
| Detalhes dos filmes            | Exibição de sinopse, gênero, ano e avaliação. |
| Nova pesquisa                  | Possibilidade de realizar outra busca.        |

Funcionalidades fora do MVP:

- Cadastro e autenticação de usuários.
- Histórico de pesquisas.
- Lista de filmes favoritos.
- Sistema de avaliações.
- Recomendações baseadas no histórico de utilização.

Essas funcionalidades poderão ser desenvolvidas em versões futuras, após a validação da solução inicial.

### 11 Funcionamento da recomendação

Uma das principais características do Indica Aí será a interpretação de pesquisas realizadas em linguagem natural.

Exemplo:

Entrada do usuário

Quero assistir a um filme de ficção científica, com viagens no tempo e uma história que faça pensar.

Interpretação da pesquisa

Ficção científica

Viagem no tempo

Reflexão

Processamento

O sistema utiliza os critérios identificados para consultar e classificar filmes compatíveis.\
Resultado

Interestelar

Viagens espaciais, conceitos científicos e reflexões sobre o tempo.

O Predestinado

Viagens no tempo e narrativa complexa.

Uma possibilidade é utilizar processamento de linguagem natural para transformar a descrição em critérios estruturados e, posteriormente, combinar esses critérios com os metadados dos filmes disponíveis na API.

## 12. Diferenciais competitivos

O principal diferencial do Indica Aí está na possibilidade de o usuário expressar livremente o que deseja assistir naquele momento.

Diferentemente de sistemas que priorizam o histórico de visualizações, a plataforma pretende trabalhar com a intenção atual do usuário.

Outros diferenciais:

- Busca por linguagem natural.
- Recomendações baseadas em contexto.
- Possibilidade de combinar diferentes características de filmes.
- Descoberta de títulos fora dos padrões tradicionais de recomendação.
- Explicação do motivo de cada recomendação.

## 13. Resultados esperados

Com o desenvolvimento do Indica Aí, espera-se:

1. Reduzir o tempo necessário para escolher um filme.
2. Melhorar a relevância das recomendações.
3. Facilitar a descoberta de novos títulos.
4. Proporcionar uma experiência de pesquisa personalizada.
5. Validar a utilização de processamento de linguagem natural em sistemas de recomendação.

## 14. Critérios de sucesso do projeto

Para avaliar a efetividade da solução, poderão ser utilizados os seguintes indicadores:

| Indicador                     | Objetivo                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| Relevância das recomendações  | Verificar se os filmes correspondem à busca.                   |
| Tempo de resposta             | Avaliar a velocidade de apresentação dos resultados.           |
| Satisfação dos usuários       | Medir a percepção de qualidade da experiência.                 |
| Taxa de utilização            | Identificar a frequência de utilização da ferramenta.          |
| Diversidade das recomendações | Verificar se o sistema apresenta diferentes opções relevantes. |

## 15. Considerações finais

O Indica Aí propõe uma solução tecnológica voltada à melhoria da experiência de descoberta de filmes, utilizando as preferências momentâneas dos usuários como principal fonte para geração de recomendações.

Através da combinação de uma interface intuitiva, integração com uma base de dados de filmes e mecanismos de interpretação de linguagem natural, o projeto busca oferecer uma alternativa aos modelos tradicionais de recomendação.

A primeira versão da aplicação terá como foco validar a funcionalidade de pesquisa personalizada e a qualidade das recomendações, permitindo que novas funcionalidades sejam incorporadas conforme a evolução do projeto.

## 16. Próximas etapas do desenvolvimento

1. Levantamento de requisitos

   Definição detalhada das funcionalidades e restrições do sistema.
2. Prototipação

   Criação dos protótipos das telas e validação da experiência do usuário.
3. Modelagem do sistema

   Definição da arquitetura, banco de dados e integrações.
4. Desenvolvimento do MVP

   Implementação da pesquisa personalizada e mecanismo de recomendação.
5. Testes e validação

   Avaliação da qualidade das recomendações e experiência dos usuários.
6. Evolução do produto

   Implementação de novas funcionalidades com base nos resultados obtidos.

Documento de Discovery – Indica Aí | Versão 1.0 | Novembro de 2026


rganização do grupo

Escrevam a spec juntos, em uma única sessão do framework.

Leiam a spec gerada em voz alta e corrijam o que estiver errado.

Só passem para o plano quando todos concordarem com a spec.

Depois, dividam as tarefas do plano: cada integrante implementa as suas.

Todo acordo vai para os arquivos do framework, não para o WhatsApp.
Escolham uma ferramenta
Framework 	Ideia central 	Instalação (terminal) 	Fluxo no chat do opencode
GSD 	Fases curtas e subagentes com contexto limpo, contra o context rot 	npx @opengsd/gsd-core@latest --opencode --local 	/gsd-new-project, /gsd-discuss-phase 1, /gsd-plan-phase 1, /gsd-execute-phase 1, /gsd-verify-work 1
BMAD 	Agentes por papel (analista, PM, arquiteto, dev) que geram e refinam os artefatos 	npx skills add bmad-code-org/BMAD-METHOD -a opencode 	Siga o fluxo da skill bmad (brief, PRD, arquitetura, histórias)
SpecKit 	Kit do GitHub com um comando por etapa, guiado por uma constituição 	uv tool install specify-cli e specify init --here --integration opencode 	/speckit.constitution, /speckit.specify, /speckit.plan, /speckit.tasks, /speckit.implement
OpenSpec 	Leve: cada mudança vira uma proposta com specs, design e tarefas 	npm install -g @fission-ai/openspec@latest e openspec init --tools opencode 	/opsx-explore, /opsx-propose, /opsx-apply

Os comandos exatos e as opções de cada framework estão no book Frameworks para criação de SDD; consultem o capítulo da ferramenta escolhida antes de começarem.
Regras do projeto

O contexto é livre: controle de estudos, biblioteca, cardápio de lanchonete, agenda de treinos, o que fizer sentido para o grupo.

O projeto precisa cumprir apenas estes requisitos mínimos:
Requisito 	Detalhe
Front-end React com Vite 	Na estrutura de pastas usada neste livro (src/api, src/components, src/pages)
Consumo de dados 	Uma API HTTP: a api-usuarios adaptada, uma API pública, um back-end próprio ou um mock com JSON Server
Ao menos uma funcionalidade completa 	Com listagem, cadastro e um comportamento de erro especificado
Artefatos versionados 	Spec, plano e tarefas gerados pelo framework, commitados no Git
Dica: se o grupo não tiver back-end, usem o JSON Server como mock de dados. Nesse caso, o db.json é o contrato: descrevam seus recursos e campos na spec.
Passo a passo
Etapa 	O que fazer 	Evidência
0. Preparar 	Criar o repositório no GitHub, o projeto com Vite e instalar o framework escolhido 	Primeiro push no GitHub com o framework instalado
1. Especificar 	Rodar o comando de especificação, responder em grupo às perguntas do agente e revisar o arquivo gerado com todos 	Spec / PRD / proposta no repositório
2. Planejar 	Gerar plano e tarefas; ajustar o que não fizer sentido e dividir as tarefas entre os integrantes 	Plano e lista de tarefas
3. Implementar 	Cada integrante executa as suas tarefas e faz commits pequenos 	Commits pequenos e com mensagens claras
4. Validar 	Usar o comando de verificação do framework e conferir os critérios de aceitação 	Relatório de verificação ou checklist preenchido
Atenção: leiam todo artefato gerado antes de aprová-lo. Em cada etapa, façam pelo menos uma alteração própria e registrem-na no arquivo.


