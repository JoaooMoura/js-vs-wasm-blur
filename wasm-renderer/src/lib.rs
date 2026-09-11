use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn render_mandelbrot(width: u32, height: u32, max_iterations: u32) -> Box<[u8]> {
    let width_f = width as f64;
    let height_f = height as f64;

    let x_min = -2.0;
    let x_max = 1.0;
    let y_min = -1.2;
    let y_max = 1.2;

    let mut pixels: Vec<u8> = vec![0; (width * height * 4) as usize];

    for py in 0..height {
        for px in 0..width {
            let x0 = x_min + (px as f64 / width_f) * (x_max - x_min);
            let y0 = y_min + (py as f64 / height_f) * (y_max - y_min);

            let mut x = 0.0;
            let mut y = 0.0;
            let mut iteration: u32 = 0;

            while x * x + y * y <= 4.0 && iteration < max_iterations {
                let x_temp = x * x - y * y + x0;
                y = 2.0 * x * y + y0;
                x = x_temp;
                iteration += 1;
            }

            let t = iteration as f64 / max_iterations as f64;
            let r = (9.0 * (1.0 - t) * t * t * t * 255.0) as u8;
            let g = (15.0 * (1.0 - t) * (1.0 - t) * t * t * 255.0) as u8;
            let b = (8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t * 255.0) as u8;

            let idx = ((py * width + px) * 4) as usize;
            pixels[idx] = r;
            pixels[idx + 1] = g;
            pixels[idx + 2] = b;
            pixels[idx + 3] = 255;
        }
    }

    pixels.into_boxed_slice()
}
#[wasm_bindgen]
pub fn apply_blur(pixels: &[u8], width: u32, height: u32, radius: i32) -> Box<[u8]> {
    let mut saida: Vec<u8> = vec![0; pixels.len()];

    for py in 0..height as i32 {
        for px in 0..width as i32 {
            let mut soma_r: u32 = 0;
            let mut soma_g: u32 = 0;
            let mut soma_b: u32 = 0;
            let mut contador: u32 = 0;

            for dy in -radius..=radius {
                for dx in -radius..=radius {
                    let vy = py + dy;
                    let vx = px + dx;

                    if vx < 0 || vx >= width as i32 || vy < 0 || vy >= height as i32 {
                        continue;
                    }

                    let idx = ((vy as u32 * width + vx as u32) * 4) as usize;
                    soma_r += pixels[idx] as u32;
                    soma_g += pixels[idx + 1] as u32;
                    soma_b += pixels[idx + 2] as u32;
                    contador += 1;
                }
            }

            let idx_saida = ((py as u32 * width + px as u32) * 4) as usize;
            saida[idx_saida] = (soma_r / contador) as u8;
            saida[idx_saida + 1] = (soma_g / contador) as u8;
            saida[idx_saida + 2] = (soma_b / contador) as u8;
            saida[idx_saida + 3] = 255;
        }
    }

    saida.into_boxed_slice()
}