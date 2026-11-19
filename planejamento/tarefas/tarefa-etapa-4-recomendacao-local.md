# Tarefa — Etapa 4: Recomendação por regras locais

## Objetivo
Transformar descrição textual do usuário em critérios locais e ranquear sugestões do catálogo.

## Tarefas
- [x] Definir estratégia de interpretação de texto (normalização, palavras-chave, sinônimos controlados).
- [x] Mapear termos para metadados (tipo, gênero, período/ano, características descritivas).
- [x] Definir lógica de pontuação e ordenação de resultados.
- [x] Implementar separação entre correspondência principal e alternativas.
- [x] Implementar explicação curta do motivo da recomendação (critérios acionados).
- [x] Tratar entrada vazia com mensagem e orientação de nova tentativa.
- [x] Tratar ausência de correspondência exata com alternativas úteis.
- [x] Criar conjunto de buscas de referência para validação em grupo.

## Critérios de aceite
- Buscas de referência retornam resultados coerentes com os metadados.
- Ordenação é consistente para entradas iguais.
- Usuário consegue distinguir match principal de alternativa.
- Casos vazios/sem resultado têm mensagens claras.

## Dependências
- Requer Etapa 1 concluída.

## Implementação e validação

- Regras e buscas adotadas: `planejamento/recomendacao-local.md`.
- Motor local: `src/recommendations/localRecommendation.js`.
- Testes: `src/recommendations/localRecommendation.test.js`.
