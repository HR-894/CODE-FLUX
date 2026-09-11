export type Comparator<T> = (left: T, right: T) => number;

/**
 * Array-backed min-heap.
 *
 * The comparator must return a negative number when `left` should be extracted
 * before `right`. `push` and `extractMin` are O(log n); `peek` is O(1).
 */
export class MinHeap<T> {
  private readonly items: T[] = [];

  public constructor(private readonly compare: Comparator<T>) {}

  public get size(): number {
    return this.items.length;
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public peek(): T | undefined {
    return this.items[0];
  }

  public push(item: T): void {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  public extractMin(): T | undefined {
    if (this.items.length === 0) {
      return undefined;
    }

    const minimum = this.items[0];
    const last = this.items.pop();

    if (last !== undefined && this.items.length > 0) {
      this.items[0] = last;
      this.bubbleDown(0);
    }

    return minimum;
  }

  public values(): readonly T[] {
    return this.items;
  }

  private bubbleUp(index: number): void {
    let current = index;

    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);

      if (this.compare(this.items[current], this.items[parent]) >= 0) {
        break;
      }

      this.swap(current, parent);
      current = parent;
    }
  }

  private bubbleDown(index: number): void {
    let current = index;

    while (true) {
      const left = current * 2 + 1;
      const right = current * 2 + 2;
      let smallest = current;

      if (
        left < this.items.length &&
        this.compare(this.items[left], this.items[smallest]) < 0
      ) {
        smallest = left;
      }

      if (
        right < this.items.length &&
        this.compare(this.items[right], this.items[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest === current) {
        break;
      }

      this.swap(current, smallest);
      current = smallest;
    }
  }

  private swap(left: number, right: number): void {
    const value = this.items[left];
    this.items[left] = this.items[right];
    this.items[right] = value;
  }
}