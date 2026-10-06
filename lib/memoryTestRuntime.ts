export interface ChimpNumber {
  id: number;
  val: number;
  x: number;
  y: number;
  hidden: boolean;
  clicked: boolean;
}

export function generateChimpLevel(currentLevel: number): ChimpNumber[] {
  const cols = 8;
  const rows = 5;
  const totalCells = cols * rows;
  const positions = Array.from({ length: totalCells }, (_, index) => index);

  for (let index = positions.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [positions[index], positions[swapIndex]] = [positions[swapIndex], positions[index]];
  }

  return positions.slice(0, currentLevel).map((position, index) => ({
    id: position,
    val: index + 1,
    x: position % cols,
    y: Math.floor(position / cols),
    hidden: false,
    clicked: false,
  }));
}

export function generateVisualLevel(currentLevel: number) {
  let gridSize = 3;
  if (currentLevel >= 3) gridSize = 4;
  if (currentLevel >= 7) gridSize = 5;
  if (currentLevel >= 12) gridSize = 6;
  if (currentLevel >= 20) gridSize = 7;

  const totalSquares = gridSize * gridSize;
  const activeCount = Math.min(currentLevel + 2, totalSquares);
  const pool = Array.from({ length: totalSquares }, (_, index) => index);

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return {
    gridSize,
    activeSquares: pool.slice(0, activeCount),
    revealMs: Math.max(1000, 1500 - currentLevel * 20),
  };
}
