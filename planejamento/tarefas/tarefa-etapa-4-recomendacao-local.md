# Tarefa — Etapa 4: Recomendação por regras locais

## Objetivo
Transformar descrição textual do usuário em critérios locais e ranquear sugestões do catálogo.

## Tarefas
- [ ] Definir estratégia de interpretação de texto (normalização, palavras-chave, sinônimos controlados).
- [ ] Mapear termos para metadados (tipo, gênero, período/ano, características descritivas).
- [ ] Definir lógica de pontuação e ordenação de resultados.
- [ ] Implementar separação entre correspondência principal e alternativas.
- [ ] Implementar explicação curta do motivo da recomendação (critérios acionados).
- [ ] Tratar entrada vazia com mensagem e orientação de nova tentativa.
- [ ] Tratar ausência de correspondência exata com alternativas úteis.
- [ ] Criar conjunto de buscas de referência para validação em grupo.

## Critérios de aceite
- Buscas de referência retornam resultados coerentes com os metadados.
- Ordenação é consistente para entradas iguais.
- Usuário consegue distinguir match principal de alternativa.
- Casos vazios/sem resultado têm mensagens claras.

## Dependências
- Requer Etapa 1 concluída.
