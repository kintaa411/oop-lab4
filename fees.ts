interface Borrowable {
  lateFee(daysLate: number): number;
}

abstract class LibraryItem implements Borrowable {
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  protected abstract feePerDay(): number;

  lateFee(daysLate: number): number {
    return daysLate * this.feePerDay();
  }

  describe(): string {
    return this.title;
  }
}

class Book extends LibraryItem {
  protected override feePerDay(): number {
    return 100;
  }
}

class Dvd extends LibraryItem {
  protected override feePerDay(): number {
    return 250;
  }
}

class Laptop implements Borrowable {
  private tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  lateFee(daysLate: number): number {
    return 5000 + daysLate * 1000;
  }
}

const novel = new Book("Things Fall Apart");
const film = new Dvd("Atlantics");
const laptop = new Laptop("LT-07");

// ---------- 3.1 A total: no type parameter needed ----------
function totalFees(items: readonly Borrowable[], daysLate: number): number {
  let total = 0;
  for (const item of items) total += item.lateFee(daysLate);
  return total;
}

console.log(totalFees([novel, film, laptop], 3));
console.log(totalFees([], 3));

// ---------- 3.2 The most costly item ----------
// Plain version: the return type is Borrowable, so the real type is lost.
function mostCostlyPlain(items: readonly Borrowable[], daysLate: number): Borrowable | undefined {
  let best: Borrowable | undefined;
  for (const item of items) {
    if (best === undefined || item.lateFee(daysLate) > best.lateFee(daysLate)) best = item;
  }
  return best;
}

const plain = mostCostlyPlain([novel, film], 3);
// if (plain) console.log(plain.describe());
// RED: Property 'describe' does not exist on type 'Borrowable'. ts(2339)

// Generic version: the result has the same type as the elements.
function mostCostly<T extends Borrowable>(items: readonly T[], daysLate: number): T | undefined {
  let best: T | undefined;
  for (const item of items) {
    if (best === undefined || item.lateFee(daysLate) > best.lateFee(daysLate)) best = item;
  }
  return best;
}

const worst = mostCostly([novel, film], 3);
if (worst) console.log(worst.describe());

const worstOverall = mostCostly([novel, laptop], 3); // type: Book | Laptop | undefined
// if (worstOverall) console.log(worstOverall.describe());
// RED: Property 'describe' does not exist on type 'Laptop'. ts(2339)
if (worstOverall) console.log(worstOverall.lateFee(3));
