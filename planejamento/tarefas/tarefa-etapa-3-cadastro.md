# Tarefa — Etapa 3: Cadastro de títulos

## Objetivo
Disponibilizar cadastro de novos títulos com validação e persistência no catálogo.

## Tarefas
- [ ] Definir campos obrigatórios e regras de validação do formulário.
- [ ] Implementar formulário de cadastro com feedback por campo.
- [ ] Validar tipos de dados (ex.: ano numérico, tipo permitido, texto mínimo).
- [ ] Integrar envio com JSON Server (POST).
- [ ] Exibir sucesso apenas após confirmação real da API.
- [ ] Atualizar listagem após cadastro bem-sucedido.
- [ ] Confirmar persistência após recarregar a aplicação.
- [ ] Tratar erros de comunicação preservando os dados preenchidos quando possível.
- [ ] Exibir mensagens de erro compreensíveis para usuário.

## Critérios de aceite
- Título válido é salvo e reaparece após reload.
- Entradas inválidas geram mensagens claras.
- Falhas HTTP não geram falso positivo de sucesso.

## Dependências
- Requer Etapa 2 concluída (e base da Etapa 1).
