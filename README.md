# js-vs-wasm-blur

Uma demo interativa que compara o desempenho de **JavaScript puro** contra **Rust compilado para WebAssembly (WASM)** aplicando um blur (desfoque) em uma imagem pixel a pixel.

## Demo

A página carrega uma imagem e permite aplicar um blur box nos dois lados com o mesmo algoritmo — a única diferença é onde o código roda.

| | Blur (raio 25) | Blur (raio 50) |
|---|---|---|
| JavaScript | ~5.800 ms | ~22.000 ms |
| Rust/WebAssembly | ~3.800 ms | ~14.000 ms |

> Os tempos variam por navegador e hardware. Sempre meça você mesmo.

## Como funciona

- A imagem é carregada uma única vez ao abrir a página. Os dois lados partem dos mesmos pixels.
- O botão **"Aplicar Blur (JavaScript)"** roda o algoritmo em JS puro, direto na thread principal.
- O botão **"Aplicar Blur (WebAssembly)"** chama `apply_blur()` — uma função Rust compilada para `.wasm` via `wasm-pack`, exposta ao JS pela macro `#[wasm_bindgen]`.
- O algoritmo é **idêntico** nos dois lados: para cada pixel, calcula a média dos vizinhos dentro de um quadrado de raio configurável.

## Estrutura do projeto

```
.
├── index.html              # Interface
├── app.js                  # Lógica JS: carrega imagem, blur JS, chama o WASM
├── imagem.png              # Imagem usada na demo
├── ROTEIRO-APRESENTACAO.md # Roteiro de apresentação (~8 min)
└── wasm-renderer/
    ├── src/
    │   └── lib.rs          # Função apply_blur em Rust
    ├── Cargo.toml
    └── pkg/                # Gerado pelo wasm-pack (não editar)
        ├── wasm_renderer.js
        ├── wasm_renderer_bg.wasm
        └── ...
```

## Como rodar localmente

### 1. Compilar o Rust para WebAssembly

```bash
cd wasm-renderer
wasm-pack build --target web --release
```

> Requer [Rust](https://rustup.rs/) e [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) instalados.

### 2. Servir os arquivos

O projeto usa ES Modules e `getImageData`, então precisa de um servidor HTTP (não abre direto pelo `file://`).

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Depois acesse `http://localhost:8080`.

## Conceitos demonstrados

- **WebAssembly não substitui o JavaScript** — o JS continua no controle da interface (DOM, Canvas, eventos). O WASM entra só para o cálculo pesado.
- **Engines JS modernas são rápidas** — o V8 otimiza loops sobre TypedArrays com JIT agressivo. Por isso a diferença não é de 10x, e isso é esperado.
- **WASM se destaca em cargas intensivas de memória** — quanto maior o raio do blur, maior a vantagem do WASM, porque o custo fixo de comunicação JS↔WASM se torna irrelevante frente ao volume de cálculo.
- **Existe custo de fronteira** — o JS copia o array de pixels para a memória do WASM e recebe o resultado de volta. Para tarefas pequenas, esse overhead pode não compensar.

## Tecnologias

- **Rust** + **wasm-bindgen** + **wasm-pack**
- HTML / Vanilla JavaScript / Canvas API
- `performance.now()` para medição de tempo
