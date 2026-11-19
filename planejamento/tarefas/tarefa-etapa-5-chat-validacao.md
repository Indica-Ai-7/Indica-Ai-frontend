# Tarefa — Etapa 5: Chat e validação integrada

## Objetivo
Integrar experiência conversacional com o motor de recomendação e validar o MVP ponta a ponta.

## Tarefas
- [x] Implementar interface de entrada em linguagem natural (chat/pergunta-resposta).
- [x] Integrar submissão da entrada com módulo de recomendação local.
- [x] Exibir recomendações com acesso a detalhes dos títulos.
- [x] Permitir iniciar nova busca dentro do mesmo fluxo.
- [x] Garantir visibilidade de estados sem resultado e falhas no fluxo integrado.
- [x] Revisar responsividade final (mobile/desktop).
- [x] Revisar acessibilidade básica (rótulos, foco, contraste mínimo, navegação por teclado essencial).
- [x] Revisar textos de interface para clareza e consistência.
- [x] Executar e registrar validação final (build, lint e checklist manual reproduzível).

## Critérios de aceite
- Fluxo completo funciona localmente: descrever preferência → receber sugestões → ver detalhes → nova busca.
- Erros e estados vazios continuam compreensíveis.
- Build e lint passam no projeto alvo.
- Outra pessoa do grupo consegue repetir os passos de validação.

## Dependências
- Requer Etapas 3 e 4 concluídas (e base anterior).

## Validação executada em 19/11/2026

- `node scripts/verificar-catalogo.mjs`: aprovado, com 1.001 registros válidos e identificadores únicos.
- `npm test -- --run --reporter=dot --maxWorkers=1`: aprovado, com 31 testes em 4 arquivos.
- `npm run lint`: aprovado sem avisos.
- `npm run build`: aprovado com o build de produção do Vite.
- `npx --yes @fission-ai/openspec@latest validate indicai-mvp --strict`: mudança OpenSpec válida.
- Probes HTTP de `GET /titulos` e `GET /titulos/<id>`: lista e detalhe retornaram o mesmo registro.
- Fluxo integrado coberto por testes: preferência → sugestões → detalhes → retorno às recomendações → nova busca; também foram verificados entrada vazia, alternativas e falha/retentativa da API.
- Capturas da interface revisadas em 1440, 1024, 820, 768 e 390 px; sem estouro horizontal, colisão, conteúdo cortado ou área de toque insuficiente.
- A revisão de acessibilidade confirmou rótulo do campo, ordem dos títulos, foco visível, navegação por teclado, link para pular ao conteúdo, anúncio de estado, contraste do texto e respeito a `prefers-reduced-motion`.

O gate da skill visual terminou como `GATE: FAIL 12` porque trata a interface como uma página promocional: exige *hero* e rodapé com exatamente uma tela, um “momento” de marketing, uma CTA no *hero* e seções alinhadas à grade de telas. Esses critérios não se aplicam ao fluxo rolável de uma aplicação e adotá-los alteraria o escopo do produto. Os critérios aplicáveis da mesma ferramenta — estouro, colisão, conteúdo cortado, tamanho de toque, rótulos, foco e movimento reduzido — passaram; o formulário continua imediatamente após a orientação, permanece acessível por teclado e não apresenta falha de layout.

O roteiro reproduzível para outra pessoa do grupo está na seção **Validação integrada do MVP** do `README.md`.
