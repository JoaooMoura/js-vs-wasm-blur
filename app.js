import init, { apply_blur } from "./wasm-renderer/pkg/wasm_renderer.js";

// ===== Constantes =====
const WIDTH = 1000;
const HEIGHT = 700;
const IMAGEM_SRC = "./imagem.png";

// ===== Referências aos elementos =====
const canvasJs   = document.getElementById("canvas-js");
const ctxJs      = canvasJs.getContext("2d");
const tempoBlurJsEl = document.getElementById("tempo-blur-js");

const canvasWasm = document.getElementById("canvas-wasm");
const ctxWasm    = canvasWasm.getContext("2d");
const tempoBlurWasmEl = document.getElementById("tempo-blur-wasm");

const inputRaio   = document.getElementById("input-raio");
const btnBlurJs   = document.getElementById("btn-blur-js");
const btnBlurWasm = document.getElementById("btn-blur-wasm");

// Pixels originais da imagem — carregados uma única vez ao abrir a página.
// Os dois lados (JS e Wasm) usam os mesmos dados de entrada.
let pixelsOriginais = null;

// ===== Inicialização: carrega a imagem automaticamente =====
async function inicializar() {
  const img = new Image();
  img.src = IMAGEM_SRC;
  await new Promise((resolve) => { img.onload = resolve; });

  // Desenha a imagem nos dois canvas para exibição inicial
  ctxJs.drawImage(img, 0, 0, WIDTH, HEIGHT);
  ctxWasm.drawImage(img, 0, 0, WIDTH, HEIGHT);

  // Extrai os pixels uma vez só — ambos os lados partem dos mesmos dados
  pixelsOriginais = new Uint8ClampedArray(
    ctxJs.getImageData(0, 0, WIDTH, HEIGHT).data
  );
}

// ===== Blur em JavaScript puro =====
// Algoritmo: para cada pixel, calcula a média dos vizinhos dentro de um
// quadrado de raio `raio`. Idêntico ao apply_blur do lado Rust.
function aplicarBlurJS(pixelsEntrada, width, height, raio) {
  const saida = new Uint8ClampedArray(pixelsEntrada.length);

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      let somaR = 0, somaG = 0, somaB = 0, contador = 0;

      for (let dy = -raio; dy <= raio; dy++) {
        for (let dx = -raio; dx <= raio; dx++) {
          const vy = py + dy;
          const vx = px + dx;
          if (vx < 0 || vx >= width || vy < 0 || vy >= height) continue;
          const idx = (vy * width + vx) * 4;
          somaR += pixelsEntrada[idx];
          somaG += pixelsEntrada[idx + 1];
          somaB += pixelsEntrada[idx + 2];
          contador++;
        }
      }

      const idxSaida = (py * width + px) * 4;
      saida[idxSaida]     = somaR / contador;
      saida[idxSaida + 1] = somaG / contador;
      saida[idxSaida + 2] = somaB / contador;
      saida[idxSaida + 3] = 255;
    }
  }

  return saida;
}

function executarBlurJS() {
  if (!pixelsOriginais) { alert("Aguarde a imagem carregar."); return; }

  const raio = parseInt(inputRaio.value, 10);
  const inicio = performance.now();
  const resultado = aplicarBlurJS(pixelsOriginais, WIDTH, HEIGHT, raio);
  const fim = performance.now();

  ctxJs.putImageData(new ImageData(resultado, WIDTH, HEIGHT), 0, 0);
  tempoBlurJsEl.textContent = `Blur: ${(fim - inicio).toFixed(2)} ms`;
}

// ===== Blur em Rust / WebAssembly =====
let wasmPronto = init();

async function executarBlurWASM() {
  if (!pixelsOriginais) { alert("Aguarde a imagem carregar."); return; }

  await wasmPronto;

  const raio = parseInt(inputRaio.value, 10);
  const inicio = performance.now();
  const resultado = apply_blur(pixelsOriginais, WIDTH, HEIGHT, raio);
  const fim = performance.now();

  ctxWasm.putImageData(
    new ImageData(new Uint8ClampedArray(resultado), WIDTH, HEIGHT), 0, 0
  );
  tempoBlurWasmEl.textContent = `Blur: ${(fim - inicio).toFixed(2)} ms`;
}

btnBlurJs.addEventListener("click", executarBlurJS);
btnBlurWasm.addEventListener("click", executarBlurWASM);

// Dispara ao carregar a página
inicializar();