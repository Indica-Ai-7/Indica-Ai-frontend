# Tarefa — Etapa 2: Listagem e detalhes

## Objetivo
Permitir exploração do catálogo com navegação entre listagem e detalhes.

## Tarefas
- [ ] Implementar serviços HTTP em `src/api` para listagem e detalhe por ID.
- [ ] Criar página de listagem em `src/pages` com filtros/categorias previstas.
- [ ] Criar componentes reutilizáveis em `src/components` para card de título e blocos de metadados.
- [ ] Implementar página de detalhes com informações completas do registro selecionado.
- [ ] Tratar estado de carregamento na listagem e no detalhe.
- [ ] Tratar estado vazio com mensagem de orientação.
- [ ] Tratar falha HTTP com mensagem clara e opção de tentar novamente.
- [ ] Implementar fallback de imagem quando URL não carregar ou estiver ausente.
- [ ] Validar usabilidade em mobile e desktop.

## Critérios de aceite
- Conteúdo da UI vem da API local (sem dados hardcoded como resultado final).
- Detalhes correspondem ao item selecionado.
- Estados de loading, vazio, erro e fallback são visíveis e corretos.
- Navegação e layout funcionam em diferentes tamanhos de tela.

## Dependências
- Requer Etapa 1 concluída.
