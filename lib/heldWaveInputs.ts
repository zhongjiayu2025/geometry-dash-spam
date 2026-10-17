// One released finger/key must not release another input that is still held.
export class HeldWaveInputs {
  private readonly sources = new Set<string>();

  get isHolding() { return this.sources.size > 0; }
  has(source: string) { return this.sources.has(source); }

  press(source: string) {
    if (this.sources.has(source)) return false;
    this.sources.add(source);
    return true;
  }

  release(source: string) {
    this.sources.delete(source);
    return this.isHolding;
  }

  clear() { this.sources.clear(); }
}
