# Roteiro de Apresentação — JavaScript vs Rust/WebAssembly

Duração alvo: **~8 minutos** de fala + tempo livre para perguntas

---

## 1. Abertura (1 min)

- WebAssembly (Wasm) é um formato binário de baixo nível que roda **dentro do navegador, ao lado do JavaScript** — não em vez dele.
- Permite compilar linguagens como Rust, C, C++ e Go para a Web, com desempenho próximo ao de código nativo.
- Hoje: uma demo ao vivo comparando a **mesma operação** rodando em JavaScript puro vs Rust compilado para WebAssembly, medindo o tempo real dos dois lados.

> "O JavaScript continua no comando — DOM, botões, Canvas, interface. O WebAssembly entra só pra fazer o cálculo pesado."

---

## 2. O experimento e por que essa escolha (2 min)

- A tarefa: aplicar um **blur (desfoque)** numa imagem — para cada pixel, calcular a média de centenas de pixels vizinhos.
- A imagem já aparece carregada nos dois lados ao abrir a página — ambos partem dos mesmos pixels.
- O algoritmo do blur é **idêntico** nos dois lados (JS e Rust) — a única diferença é onde ele roda.

**Por que blur de imagem, e não outra coisa (antecipe essa pergunta, mostra que pensou no assunto):**

> "Eu queria um exemplo que fosse: (1) fácil de entender visualmente, (2) rápido de implementar dos dois lados, e (3) pesado o suficiente pra diferença de performance aparecer de verdade. Processamento de imagem pixel a pixel bate esses três critérios muito bem — é só um loop duplo com aritmética simples."

**Outros exemplos considerados (e por que não foram usados):**
- Jogo/física: mais visual, mas exige game loop, estado entre frames, bem mais desenvolvimento.
- Criptografia/hashing: ótimo caso de uso real, mas menos visual — a plateia só vê o número.
- Compressão de dados: pesado computacionalmente, mas mais complexo de explicar em poucos minutos.

---

## 3. Demo ao vivo — Blur (3 min)

**Cliques:**
1. **"Aplicar Blur (JavaScript)"** → aponte o tempo.
2. **"Aplicar Blur (WebAssembly)"** → aponte o tempo.
3. Compare em voz alta.

**O que explicar:**

> "Para cada pixel, o código soma os valores de centenas de vizinhos numa janela ao redor dele, e tira a média. Com raio 25, isso é uma janela de 51×51 — mais de 2.600 vizinhos por pixel, multiplicado por todos os pixels da imagem. São centenas de milhões de acessos ao array."

**Resultado de referência (deixe o clique ao vivo falar, mas use como âncora):**

| | Raio 25 | Raio 50 |
|---|---|---|
| JavaScript | ~5.800 ms | ~22.000 ms |
| Rust/WebAssembly | ~3.800 ms | ~14.000 ms |
| Diferença absoluta | ~2 s | **~8 s** |

**Fluxo sugerido para a demo ao vivo:**
1. Começa com raio **25** — resultado rápido, diferença já visível.
2. Depois: *"Vamos aumentar o raio pra 50..."* — a plateia espera os 22s do JS e vê os 14s do WASM. A diferença de 8 segundos é sentida fisicamente, não só lida no número.

**Se a diferença vier menor do que o esperado:**

> "O V8 otimiza muito bem loops sobre arrays tipados. Isso é exatamente o ponto: WASM não é sempre mais rápido — depende do algoritmo, do padrão de acesso à memória e do navegador."

---

## 4. Por trás dos panos (2 min)

> "Por que existe essa diferença?"

- **JavaScript** roda com JIT (compilação just-in-time): verifica tipos em tempo real, faz checagem de limites em cada acesso ao array.
- **Rust compilado para Wasm** chega já otimizado: instruções de baixo nível, sem decisão de tipo em tempo real, overhead menor por acesso a memória.

**Como foi programado:**
1. O mesmo algoritmo escrito em JS e em Rust (`apply_blur`).
2. Rust compilado para `.wasm` com `wasm-pack build --target web --release`.
3. `#[wasm_bindgen]` gera a ponte que deixa o JS chamar `apply_blur(...)` como função nativa.
4. JS manda o array de pixels pro Wasm → Wasm processa → devolve os pixels prontos.

---

## 5. Conclusão (1 min)

- WebAssembly **não substitui** o JS — complementa, cuidando da parte pesada.
- JS moderno é rápido — V8 otimiza loops sobre arrays muito bem.
- WASM se destaca em tarefas intensivas de memória/CPU — nem toda tarefa compensa.
- Custo de comunicação JS↔Wasm existe — funções pequenas ou muito frequentes podem não valer a pena.

> "A pergunta certa não é 'WebAssembly é mais rápido?', é 'para essa tarefa específica, vale a pena pagar o custo de usar WebAssembly?'. A resposta é sempre: **meça**."

---

## Preparação para perguntas (FAQ)

**"Por que não usou um jogo, seria mais impressionante?"**
> Jogo mostraria bem a vantagem, mas exige game loop, estado entre frames e muito mais desenvolvimento. Blur de imagem dá um resultado visual claro com fração do esforço — ótimo custo-benefício pra uma demo didática.

**"Dá pra usar WebAssembly pra tudo?"**
> Tecnicamente sim, mas não compensa para tarefas leves ou que mexem com DOM — isso continua sendo trabalho natural do JS.

**"Por que não fizeram tudo em Wasm, incluindo a interface?"**
> Wasm não tem acesso direto ao DOM. E manipulação de DOM/Canvas já é rápida em JS — não haveria ganho real.

**"Os números vão ser sempre esses?"**
> Não — variam por navegador, hardware e até entre execuções. Por isso a recomendação: sempre meça, idealmente várias vezes.

**"Isso funciona em qualquer navegador?"**
> Sim — WebAssembly é suportado por todos os navegadores modernos (Chrome, Firefox, Safari, Edge) há vários anos.

**"Qual a diferença entre compilar em debug e release?"**
> Usamos `--release`, com otimizações do compilador Rust. Em modo debug o `.wasm` seria maior e mais lento.

**"Existe caso onde WebAssembly seria pior?"**
> Sim — funções pequenas chamadas com muita frequência, onde o custo de atravessar a fronteira JS↔Wasm supera o tempo do cálculo em si.

**"Por que a imagem de gatinhos?"**
> Só precisava de uma imagem com pixels reais pra processar — poderia ser qualquer foto. 🐱

---

## Cronometragem resumida

| Bloco | Tempo |
|---|---|
| Abertura | 1 min |
| Experimento e escolha do exemplo | 2 min |
| Demo — blur | 3 min |
| Por trás dos panos | 2 min |
| Conclusão | 1 min |
| **Total** | **~8 min** |


---

## 1. Abertura (1 min)

- WebAssembly (Wasm) é um formato binário de baixo nível que roda **dentro do navegador, ao lado do JavaScript** — não em vez dele.
- Permite compilar linguagens como Rust, C, C++ e Go para a Web, com desempenho próximo ao de código nativo.
- Hoje: uma demo ao vivo comparando a **mesma operação** rodando em JavaScript puro vs Rust compilado para WebAssembly, medindo o tempo real dos dois lados.

> "O JavaScript continua no comando — DOM, botões, Canvas, interface. O WebAssembly entra só pra fazer o cálculo pesado."

---

## 2. O experimento e por que essa escolha (2 min)

- A tarefa: carregar uma imagem e aplicar um **blur (desfoque)** nela — para cada pixel, calcular a média de centenas de pixels vizinhos.
- O algoritmo é **idêntico** nos dois lados (JS e Rust) — a única diferença é onde ele roda.

**Por que blur de imagem, e não outra coisa (antecipe essa pergunta você mesmo, mostra que pensou no assunto):**

> "Eu queria um exemplo que fosse: (1) fácil de entender visualmente, (2) rápido de implementar dos dois lados, e (3) pesado o suficiente pra diferença de performance aparecer de verdade. Processamento de imagem pixel a pixel bate esses três critérios muito bem — é só um loop duplo com aritmética simples, sem gráfico 3D, sem física, sem estado complexo."

**Outros exemplos que considerei (e por que não usei):**
- Jogo/simulação física (ex: partículas colidindo): mostraria bem a vantagem do Wasm, mas exigiria loop de renderização contínuo, gerenciamento de estado entre frames e mais tempo de desenvolvimento — não cabia no prazo.
- Criptografia/hashing: ótimo caso de uso real de Wasm, mas menos visual — a plateia não "vê" a diferença, só o número.
- Compressão de dados: também pesado computacionalmente, mas exige lidar com formatos de arquivo, mais complexo de explicar em poucos minutos.

> "Imagem processada pixel a pixel dá o melhor custo-benefício entre 'fácil de fazer' e 'fácil de visualizar a diferença'."

---

## 3. Demo ao vivo — Carregar a imagem (1 min)

**Cliques:**
1. **"Carregar Imagem (JavaScript)"** → aponte o tempo.
2. **"Carregar Imagem (WebAssembly)"** → aponte o tempo.

**O que dizer:**

> "Os dois lados fazem a mesma coisa: carregam o arquivo, desenham num Canvas escondido e extraem os pixels crus. O tempo aqui é parecido nos dois — faz sentido, carregar e decodificar uma imagem é trabalho do navegador, não do nosso código. O WebAssembly ainda não entrou em ação. O que importa é que agora os dois lados têm exatamente os mesmos pixels prontos pra processar."

---

## 4. Demo ao vivo — Blur (3 min)

**Cliques:**
1. **"Aplicar Blur (JavaScript)"** → aponte o tempo.
2. **"Aplicar Blur (WebAssembly)"** → aponte o tempo.
3. Compare em voz alta.

**O que explicar:**

> "Para cada pixel, o código soma os valores de centenas de vizinhos numa janela ao redor dele, e tira a média. Com raio 25, isso é uma janela de 51×51 — mais de 2.600 vizinhos por pixel, multiplicado por todos os pixels da imagem. São centenas de milhões de acessos ao array de pixels."

**Resultado real já medido (use como referência, mas deixe o clique ao vivo falar):**

| | Tempo do blur (raio 25) |
|---|---|
| JavaScript | ~10.393 ms |
| Rust/WebAssembly | ~3.774 ms |

> "No meu teste, o WebAssembly foi quase **2,75x mais rápido** nessa etapa. Essa é a diferença que esperamos ver quando o algoritmo é intensivo em acesso à memória, não só em matemática."

**Se quiser reforçar visualmente:** aumente o raio do blur ao vivo (ex: 10 → 25) e rode de novo, mostrando a vantagem crescer com a carga.

**Se a diferença vier menor do que o esperado (plano B, não invente desculpa):**

> "Interessante — aqui o JavaScript se saiu melhor do que o esperado. Isso não é falha do experimento, é um resultado real: o V8 (motor do Chrome) faz compilação just-in-time muito agressiva pra loops sobre arrays tipados. É exatamente por isso que a conclusão não pode ser 'WebAssembly é sempre mais rápido' — depende do algoritmo, do padrão de acesso à memória e até do navegador usado."

---

## 5. Por trás dos panos — por que existe essa diferença (2 min)

> "A pergunta que sempre aparece é: **por que** é mais rápido?"

- **JavaScript roda num interpretador com JIT** (compilação just-in-time): o motor verifica o tipo dos valores em tempo de execução, faz checagem de limites em cada acesso ao array, e pode desotimizar se o padrão de uso mudar no meio do caminho.
- **Rust compilado para Wasm já chega "pronto e otimizado"**: vira instruções de baixo nível, sem decisão de tipo em tempo real, executando numa máquina virtual mais simples e previsível — cada acesso a memória tem overhead bem menor.
- Isso importa mais quanto mais repetitivo e intensivo em memória for o algoritmo — é exatamente o caso do blur, com milhões de leituras de array.

**Como isso é programado, resumidamente:**

1. A mesma lógica foi escrita duas vezes: uma em JS, outra em Rust (`apply_blur`).
2. O Rust foi compilado pra `.wasm` com `wasm-pack build --target web --release`.
3. A macro `#[wasm_bindgen]` gerou a "ponte" que deixa o JS chamar `apply_blur(...)` como função nativa.
4. O JS manda o array de pixels pro Wasm, ele processa lá, e devolve os pixels prontos — essa "travessia" de dados tem um custo fixo, mas ele fica cada vez menos relevante quanto mais pesado for o processamento.

---

## 6. Conclusão (1 min)

- WebAssembly **não substitui** o JavaScript — ele complementa, cuidando da parte pesada enquanto o JS continua no controle da interface.
- JavaScript moderno é rápido — engines como V8 otimizam loops sobre arrays muito bem.
- WebAssembly se destaca mais em tarefas intensivas de memória/CPU — nem toda tarefa se beneficia.
- Existe custo de comunicação JS↔Wasm — funções pequenas ou chamadas muito frequentes podem não compensar.
- O resultado depende de navegador, hardware, algoritmo e implementação — não existe resposta universal.

> "A pergunta certa não é 'WebAssembly é mais rápido que JavaScript?' — é 'para essa tarefa específica, vale a pena pagar o custo de usar WebAssembly?'. E a única forma de responder isso é medindo, como fizemos aqui."

---

## Preparação para perguntas (FAQ)

**"Por que escolheu imagem/blur e não um jogo, já que mostraria melhor?"**
> Um jogo mostraria bem a vantagem (física, colisões, múltiplos objetos por frame), mas exige um loop de renderização contínuo (game loop), gerenciamento de estado entre quadros e bem mais tempo de desenvolvimento. Blur de imagem dá um resultado visual claro com uma fração do esforço de implementação — ótimo custo-benefício pra uma demo didática.

**"Dá pra usar WebAssembly pra tudo?"**
> Tecnicamente sim, mas não compensa para tarefas leves ou que mexem muito com DOM — isso continua sendo trabalho natural do JS.

**"Por que não fizeram tudo em Wasm, incluindo a interface?"**
> Daria mais trabalho sem benefício real: manipulação de DOM/Canvas já é rápida o suficiente em JS, que é o ambiente nativo dele. Wasm não tem acesso direto ao DOM.

**"Os números vão ser sempre esses?"**
> Não — variam por navegador, hardware, e até entre execuções na mesma máquina. Por isso a recomendação de sempre medir, e idealmente rodar múltiplas vezes e comparar médias.

**"Isso funciona em qualquer navegador?"**
> WebAssembly é suportado por todos os navegadores modernos (Chrome, Firefox, Safari, Edge) há vários anos — é um padrão web estável.

**"Qual a diferença entre compilar em modo debug e release?"**
> Usamos `--release`, que aplica otimizações do compilador Rust (mais lento pra compilar, porém o `.wasm` final roda mais rápido) — em modo debug o binário seria maior e mais lento, sem essas otimizações.

**"Existe algum caso onde WebAssembly seria pior?"**
> Sim — funções pequenas chamadas com muita frequência, onde o custo de atravessar a fronteira JS↔Wasm supera o tempo do cálculo em si. Também tarefas que dependem muito de manipular o DOM diretamente.

**"Por que a imagem usada é de gatinhos?"**
> Só precisava de uma imagem com pixels reais pra processar — poderia ser qualquer foto. 🐱

---

## Cronometragem resumida

| Bloco | Tempo |
|---|---|
| Abertura | 1 min |
| Experimento e escolha do exemplo | 2 min |
| Demo — carregar imagem | 1 min |
| Demo — blur | 3 min |
| Por trás dos panos | 2 min |
| Conclusão | 1 min |
| **Total** | **~10 min** |
