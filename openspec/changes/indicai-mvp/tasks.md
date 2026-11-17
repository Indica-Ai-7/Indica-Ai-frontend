# Tasks

## 1. Catálogo e API HTTP local

- [x] 1.1 Definir e aprovar em grupo o contrato do catálogo, incluindo campos, tipos, obrigatoriedade, validações e identificadores; verificar que o contrato aprovado está documentado antes de consolidar dados ou criar o formulário.
- [x] 1.2 Investigar fontes de dados e documentar permissões de reutilização e atribuições; verificar que cada fonte está comprovada ou que a impossibilidade de atingir o volume planejado está registrada como bloqueio, sem inventar registros.
- [x] 1.3 Preparar `db.json` com ao menos 200 registros distintos por tipo, identificadores estáveis e campos válidos, usando somente dados aprovados; verificar contagens, duplicações e conformidade com o contrato.
- [x] 1.4 Configurar JSON Server para expor os recursos do catálogo por HTTP; verificar consultas documentadas e operações necessárias para as etapas seguintes.
- [x] 1.5 Documentar como iniciar a API, consultar seus recursos e verificar o catálogo; verificar que outra pessoa consegue repetir os passos localmente.

## 2. Listagem e detalhes

Dependência: Etapa 1 concluída.

- [ ] 2.1 Usar `design-taste-frontend` para orientar o sistema visual e a composição das telas; avaliar com `build-awwwards-quality-sites` se uma interação de destaque agrega valor, registrar a decisão no design e verificar aprovação do grupo sem presumir dependências de animação. (Direção registrada em `design.md`; revisão/aprovação do grupo pendente.)
- [ ] 2.2 Implementar em `src/api`, `src/pages` e `src/components` a consulta HTTP do catálogo, sua listagem e os detalhes; verificar com testes focados que a lista e o detalhe exibem dados da API correspondentes ao registro selecionado. (Implementado; smoke tests de listagem e endpoint de detalhe passaram. A abertura de detalhes ainda precisa de verificação ponta a ponta.)
- [ ] 2.3 Implementar estados de carregamento, vazio, falha HTTP e fallback de imagem; verificar cada estado e a navegação em celular e desktop, incluindo os tamanhos de tela definidos na revisão visual. (Estados implementados; faltam verificações explícitas de catálogo vazio, falha HTTP, imagem indisponível e tablet.)
- [x] 2.4 Documentar o fluxo de navegação e os estados da listagem e dos detalhes; verificar que a documentação corresponde ao comportamento implementado. (Documentado em `README.md`.)

## 3. Cadastro de títulos

Dependência: Etapa 2 concluída.

- [ ] 3.1 Implementar o formulário conforme o contrato aprovado, com validação e mensagens por campo; verificar campos obrigatórios, tipos inválidos e entradas válidas com testes focados.
- [ ] 3.2 Integrar o envio HTTP e o feedback do formulário; verificar sucesso somente após resposta bem-sucedida, atualização da listagem e persistência após recarregar.
- [ ] 3.3 Tratar falhas da API sem confirmação falsa e preservar os valores preenchidos quando possível; verificar rejeições e falhas de comunicação com testes focados.
- [ ] 3.4 Documentar os campos e regras do cadastro; verificar que exemplos válidos e inválidos seguem o contrato aprovado.

## 4. Recomendação por regras locais

Dependência: Etapa 1 concluída.

- [ ] 4.1 Definir normalização, critérios reconhecidos, mapeamento para metadados, pontuação e buscas de referência; verificar aprovação em grupo dos exemplos e da ordenação esperada.
- [ ] 4.2 Implementar a busca e classificação local; verificar com testes que critérios equivalentes produzem ordenação consistente e explicações ligadas aos metadados correspondentes.
- [ ] 4.3 Implementar estados de entrada vazia, correspondência, alternativas e ausência de resultados; verificar com testes que cada estado apresenta a mensagem e o próximo passo adequados.
- [ ] 4.4 Documentar os limites da interpretação local e os exemplos de busca aprovados; verificar que a documentação não promete compreensão equivalente a uma IA.

## 5. Chat e validação integrada

Dependências: Etapas 3 e 4 concluídas.

- [ ] 5.1 Implementar a interface conversacional ligada à recomendação local, com acesso aos detalhes e início de nova busca; verificar o fluxo completo de entrada, resultado, detalhes e nova consulta.
- [ ] 5.2 Revisar responsividade, navegação por teclado, foco visível, rótulos, contraste e preferência por movimento reduzido; verificar os critérios na interface integrada e registrar os resultados.
- [ ] 5.3 Executar e registrar a validação integrada do MVP; verificar `npm run build`, `npm run lint` e o checklist manual reproduzível da API e dos fluxos principais.

## Workflow follow-up

- Arquivar `indicai-mvp` somente após concluir as tarefas, resolver ou registrar formalmente os bloqueios de dados e revisar os artefatos com o grupo.
