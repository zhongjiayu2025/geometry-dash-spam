export interface WaveRenderState {
  beatScale: number;
  shakeIntensity: number;
  rng: () => number;
  baseColor: string;
  distanceTraveled: number;
  finishLineX: number;
  playerX: number;
  playerY: number;
  velocityY: number;
  stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }>;
  obstacles: Array<{ x: number; width: number; topHeight: number; bottomY: number }>;
  trail: Array<{ x: number; y: number; w: number }>;
  particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; rotation: number; rotationSpeed: number }>;
  shockwaves: Array<{ x: number; y: number; radius: number; opacity: number }>;
}

export interface WaveRenderOptions {
  isEndless: boolean;
  isMini: boolean;
  reduceMotion: boolean;
  lowVisuals: boolean;
  showPlayer: boolean;
  playerColor: string;
}

export function renderWaveFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: WaveRenderState,
  options: WaveRenderOptions
) {
  const { isEndless, isMini, reduceMotion, lowVisuals, showPlayer, playerColor } = options;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  if (!reduceMotion) {
    const scale = state.beatScale;
    if (scale > 1.001) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    if (state.shakeIntensity > 0) {
      ctx.translate((state.rng() - 0.5) * state.shakeIntensity, (state.rng() - 0.5) * state.shakeIntensity);
      state.shakeIntensity *= 0.9;
    }
  }

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const star of state.stars) {
    ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = state.baseColor;
  ctx.fillRect(0, 0, canvas.width, 10);
  ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
  if (!lowVisuals && !reduceMotion) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = state.baseColor;
  }
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(canvas.width, 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, canvas.height - 10); ctx.lineTo(canvas.width, canvas.height - 10); ctx.stroke();
  ctx.shadowBlur = 0;

  for (const obstacle of state.obstacles) {
    const x = obstacle.x - state.distanceTraveled;
    if (x <= -obstacle.width || x >= canvas.width) continue;

    if (lowVisuals || reduceMotion) {
      ctx.fillStyle = `${state.baseColor}88`;
      ctx.fillRect(x, 0, obstacle.width, obstacle.topHeight);
      ctx.fillRect(x, obstacle.bottomY, obstacle.width, canvas.height - obstacle.bottomY);
    } else {
      const topGradient = ctx.createLinearGradient(0, 0, 0, obstacle.topHeight);
      topGradient.addColorStop(0, state.baseColor);
      topGradient.addColorStop(1, `${state.baseColor}44`);
      const bottomGradient = ctx.createLinearGradient(0, obstacle.bottomY, 0, canvas.height);
      bottomGradient.addColorStop(0, `${state.baseColor}44`);
      bottomGradient.addColorStop(1, state.baseColor);
      ctx.fillStyle = topGradient;
      ctx.fillRect(x, 0, obstacle.width, obstacle.topHeight);
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(x, obstacle.bottomY, obstacle.width, canvas.height - obstacle.bottomY);
    }

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, obstacle.topHeight); ctx.lineTo(x + obstacle.width, obstacle.topHeight); ctx.lineTo(x + obstacle.width, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, canvas.height); ctx.lineTo(x, obstacle.bottomY); ctx.lineTo(x + obstacle.width, obstacle.bottomY); ctx.lineTo(x + obstacle.width, canvas.height);
    ctx.stroke();
  }

  if (!isEndless) {
    const finishX = state.finishLineX - state.distanceTraveled;
    if (finishX < canvas.width) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(finishX, 0, 10, canvas.height);
      ctx.shadowBlur = 50;
      ctx.shadowColor = "#fff";
      ctx.fillRect(finishX, 0, 10, canvas.height);
      ctx.shadowBlur = 0;
    }
  }

  if (state.trail.length > 1) {
    ctx.beginPath();
    ctx.moveTo(state.trail[0].x, state.trail[0].y - state.trail[0].w / 2);
    for (let i = 1; i < state.trail.length; i += 1) ctx.lineTo(state.trail[i].x, state.trail[i].y - state.trail[i].w / 2);
    ctx.lineTo(state.playerX, state.playerY);
    for (let i = state.trail.length - 1; i >= 0; i -= 1) ctx.lineTo(state.trail[i].x, state.trail[i].y + state.trail[i].w / 2);
    ctx.closePath();
    ctx.fillStyle = playerColor;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(state.trail[0].x, state.trail[0].y);
    for (let i = 1; i < state.trail.length; i += 1) ctx.lineTo(state.trail[i].x, state.trail[i].y);
    ctx.lineTo(state.playerX, state.playerY);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (showPlayer) {
    if (!lowVisuals && !reduceMotion) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#fff";
    }
    ctx.save();
    ctx.translate(state.playerX, state.playerY);
    ctx.rotate((state.velocityY > 0 ? 45 : -45) * Math.PI / 180);
    const size = isMini ? 6 : 12;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-size, -size); ctx.lineTo(size, 0); ctx.lineTo(-size, size); ctx.closePath(); ctx.fill();
    ctx.fillStyle = playerColor;
    ctx.beginPath();
    ctx.moveTo(-size / 2, -size / 2); ctx.lineTo(size / 2, 0); ctx.lineTo(-size / 2, size / 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  for (const particle of state.particles) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    const size = particle.size;
    ctx.moveTo(-size / 2, size / 2); ctx.lineTo(size / 2, size / 2); ctx.lineTo(0, -size / 2); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  for (const shockwave of state.shockwaves) {
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${shockwave.opacity})`;
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  ctx.restore();
}
