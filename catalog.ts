// ---------- Parts 1-2: Book, Member, Catalog ----------
class Book {
  private id: string;
  private title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  getId(): string {
    return this.id;
  }

  describe(): string {
    return `${this.title} [${this.id}]`;
  }
}

class Member {
  private id: string;
  private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}//I created two classes (Book and Member)

interface HasId {
  getId(): string;
}

class Catalog<T extends HasId> {
  private items = new Map<string, T>();

  add(item: T): boolean {
    if (this.items.has(item.getId())) return false;
    this.items.set(item.getId(), item);
    return true;
  }

  find(id: string): T | undefined {
    return this.items.get(id);
  }

  count(): number {
    return this.items.size;
  }

  all(): T[] {
    return Array.from(this.items.values());
  }
}

const books = new Catalog<Book>();
console.log(books.add(new Book("B-001", "Things Fall Apart")));
console.log(books.add(new Book("B-002", "So Long a Letter")));
console.log(books.add(new Book("B-001", "Another Copy")));

const members = new Catalog<Member>();
members.add(new Member("M-01", "Awa"));

console.log(books.count(), members.count());

const found = books.find("B-002");
if (found) console.log(found.describe());

const awa = members.find("M-01");
if (awa) console.log(awa.getName());

console.log(books.find("B-999"));

// Experiments (2.2): each was added, its red underline copied, then removed.
// books.add(new Member("M-02", "Moussa"));   // (a)
// const numbers = new Catalog<number>();     // (b)
// console.log(found.describe());             // (c) without the if

// Test of all() (2.3), left commented so the output stays equal to Checkpoint 1:
// console.log(books.all().map(b => b.describe()));

// ---------- Part 6: Ratings ----------
class Ratings<T extends HasId> {
  private entries = new Map<string, { item: T; stars: number[] }>();

  rate(item: T, stars: number): boolean {
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return false;
    const entry = this.entries.get(item.getId());
    if (entry) {
      entry.stars.push(stars);
    } else {
      this.entries.set(item.getId(), { item, stars: [stars] });
    }
    return true;
  }

  average(id: string): number | undefined {
    const entry = this.entries.get(id);
    if (!entry) return undefined;
    return this.mean(entry.stars);
  }

  best(): T | undefined {
    let bestItem: T | undefined;
    let bestAverage = -1;
    for (const entry of this.entries.values()) {
      const avg = this.mean(entry.stars);
      if (avg > bestAverage) {
        bestAverage = avg;
        bestItem = entry.item;
      }
    }
    return bestItem;
  }

  private mean(values: number[]): number {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }
}

const ratings = new Ratings<Book>();
const novel = new Book("B-001", "Things Fall Apart");
const letter = new Book("B-002", "So Long a Letter");

console.log(ratings.rate(novel, 5), ratings.rate(novel, 4), ratings.rate(letter, 4), ratings.rate(letter, 6), ratings.rate(letter, 4.5));
console.log(ratings.average("B-001"), ratings.average("B-002"), ratings.average("B-999"));

const top = ratings.best();
if (top) console.log(top.describe());

console.log(new Ratings<Member>().best());
