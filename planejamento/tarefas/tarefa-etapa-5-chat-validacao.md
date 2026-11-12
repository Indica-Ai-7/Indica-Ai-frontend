# Tarefa — Etapa 5: Chat e validação integrada

## Objetivo
Integrar experiência conversacional com o motor de recomendação e validar o MVP ponta a ponta.

## Tarefas
- [ ] Implementar interface de entrada em linguagem natural (chat/pergunta-resposta).
- [ ] Integrar submissão da entrada com módulo de recomendação local.
- [ ] Exibir recomendações com acesso a detalhes dos títulos.
- [ ] Permitir iniciar nova busca dentro do mesmo fluxo.
- [ ] Garantir visibilidade de estados sem resultado e falhas no fluxo integrado.
- [ ] Revisar responsividade final (mobile/desktop).
- [ ] Revisar acessibilidade básica (rótulos, foco, contraste mínimo, navegação por teclado essencial).
- [ ] Revisar textos de interface para clareza e consistência.
- [ ] Executar e registrar validação final (build, lint e checklist manual reproduzível).

## Critérios de aceite
- Fluxo completo funciona localmente: descrever preferência → receber sugestões → ver detalhes → nova busca.
- Erros e estados vazios continuam compreensíveis.
- Build e lint passam no projeto alvo.
- Outra pessoa do grupo consegue repetir os passos de validação.

## Dependências
- Requer Etapas 3 e 4 concluídas (e base anterior).
