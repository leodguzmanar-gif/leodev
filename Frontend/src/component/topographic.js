// src/component/topographic.js
(function () {
  // ─────────────────────────────────────────────
  // Simplex Noise 3D
  // ─────────────────────────────────────────────
  const F3 = 1 / 3, G3 = 1 / 6;

  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }

  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  const grad3 = new Float32Array([
    1,1,0, -1,1,0, 1,-1,0, -1,-1,0,
    1,0,1, -1,0,1, 1,0,-1, -1,0,-1,
    0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1,
  ]);

  function noise3D(xin, yin, zin) {
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else               { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if (y0 < z0)       { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if (x0 < z0)  { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else               { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 > 0) {
      const gi = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi]*x0 + grad3[gi+1]*y0 + grad3[gi+2]*z0);
    }
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 > 0) {
      const gi = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi]*x1 + grad3[gi+1]*y1 + grad3[gi+2]*z1);
    }
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 > 0) {
      const gi = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi]*x2 + grad3[gi+1]*y2 + grad3[gi+2]*z2);
    }
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 > 0) {
      const gi = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 = t3 * t3 * (grad3[gi]*x3 + grad3[gi+1]*y3 + grad3[gi+2]*z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
  }

  // ─────────────────────────────────────────────
  // Inicialización
  // ─────────────────────────────────────────────
  function initTopographicAnimation(canvas, options) {
    options = options || {};

    // let → cambian en vivo con setColors()
    let lineColor       = options.lineColor       || 'rgba(74, 222, 128, 0.32)';
    let backgroundColor = options.backgroundColor || '#050a06';

    const lineWidth      = options.lineWidth      || 1.2;
    const gridStep       = options.gridStep       || 18;
    const levels         = options.levels         || 10;
    const speed          = options.speed          || 0.0003;
    const noiseScale     = options.noiseScale     || 0.0035;
    const mouseRadius    = options.mouseRadius    || 200;
    const mouseInfluence = options.mouseInfluence || 0.4;
    const SUB            = options.subSamples     || 2;
    const cellStep       = gridStep / SUB;

    const ctx = canvas.getContext('2d', { alpha: false });

    let animationFrameId = null;
    let width = 0, height = 0;
    let cols = 0, rows = 0;
    let grid = null;
    let time = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width  = Math.floor(width  * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width  = width  + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width  / cellStep) + 1;
      rows = Math.ceil(height / cellStep) + 1;
      grid = new Float32Array(cols * rows);
    }

    function onMouseMove(e) {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    }
    function onMouseLeave() {
      mouse.tx = -1e4;
      mouse.ty = -1e4;
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    resize();

    // ─────────────────────────────────────────────
    // Marching Squares con curvas suaves
    // ─────────────────────────────────────────────
    function drawIsolines(threshold) {
      ctx.beginPath();
      const stride = cols;
      const step = cellStep;

      for (let r = 0; r < rows - 1; r++) {
        const rowOff = r * stride;
        for (let c = 0; c < cols - 1; c++) {
          const idx = rowOff + c;
          const v0 = grid[idx];
          const v1 = grid[idx + 1];
          const v2 = grid[idx + stride + 1];
          const v3 = grid[idx + stride];

          const ci =
            (v0 >= threshold ? 8 : 0) |
            (v1 >= threshold ? 4 : 0) |
            (v2 >= threshold ? 2 : 0) |
            (v3 >= threshold ? 1 : 0);

          if (ci === 0 || ci === 15) continue;

          const x = c * step, y = r * step;

          const lerp = (a, b) => {
            const d = b - a;
            if (d > -1e-6 && d < 1e-6) return 0.5;
            const t = (threshold - a) / d;
            return t < 0 ? 0 : t > 1 ? 1 : t;
          };

          const tx = x + step * lerp(v0, v1), ty = y;
          const rx = x + step,                 ry = y + step * lerp(v1, v2);
          const bx = x + step * lerp(v3, v2), by = y + step;
          const lx = x,                        ly = y + step * lerp(v0, v3);

          const q = (x1, y1, x2, y2) => {
            const mx = (x1 + x2) * 0.5;
            const my = (y1 + y2) * 0.5;
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(mx, my, x2, y2);
          };

          switch (ci) {
            case 1:  case 14: q(lx, ly, bx, by); break;
            case 2:  case 13: q(bx, by, rx, ry); break;
            case 3:  case 12: q(lx, ly, rx, ry); break;
            case 4:  case 11: q(tx, ty, rx, ry); break;
            case 6:  case 9:  q(tx, ty, bx, by); break;
            case 7:  case 8:  q(lx, ly, tx, ty); break;
            case 5:  q(lx, ly, tx, ty); q(bx, by, rx, ry); break;
            case 10: q(tx, ty, rx, ry); q(lx, ly, bx, by); break;
          }
        }
      }
      ctx.stroke();
    }

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────
    const minT = -0.4, maxT = 0.4;
    const stepT = (maxT - minT) / levels;

    function render() {
      time += speed;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const stride = cols;
      const mr2 = mouseRadius * mouseRadius;
      const invMR = 1 / mouseRadius;
      const ns = noiseScale;
      const mx = mouse.x, my = mouse.y;

      for (let r = 0; r < rows; r++) {
        const y = r * cellStep;
        const rowOff = r * stride;
        const ny = y * ns;
        for (let c = 0; c < cols; c++) {
          const x = c * cellStep;
          let n = noise3D(x * ns, ny, time);

          const dx = x - mx, dy = y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < mr2) {
            const f = 1 - Math.sqrt(d2) * invMR;
            n += f * f * mouseInfluence;
          }
          grid[rowOff + c] = n;
        }
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let l = 0; l < levels; l++) {
        drawIsolines(minT + l * stepT);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    // ─────────────────────────────────────────────
    // API: cambiar colores en vivo
    // ─────────────────────────────────────────────
    function setColors(newColors) {
      if (!newColors) return;
      if (newColors.lineColor !== undefined) lineColor = newColors.lineColor;
      if (newColors.backgroundColor !== undefined) backgroundColor = newColors.backgroundColor;
    }

    // ─────────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────────
    function cleanup() {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    }

    cleanup.setColors = setColors;

    return cleanup;
  }

  window.initTopographicAnimation = initTopographicAnimation;
})();