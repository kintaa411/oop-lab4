
abstract class Student {
  private name: string;
  private id: string;
  private credits = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  protected abstract getCreditLimit(): number;

  // TODO 3.1 — Each subclass must define its own scholarship.
  abstract calculateScholarship(): number;

  // TODO 3.2 — Each subclass must define its own borrowing limit.
  abstract getBorrowingLimit(): number;

  addCredits(amount: number): boolean {
    if (!Number.isInteger(amount) || amount <= 0) return false;
    if (this.credits + amount > this.getCreditLimit()) return false;
    this.credits += amount;
    return true;
  }

  describe(): string {
    return `${this.name} (${this.id}): ${this.credits} credits`;
  }
}

class UndergraduateStudent extends Student {
  protected override getCreditLimit(): number {
    return 21;
  }

  // 3.1 — Undergraduate scholarship
  override calculateScholarship(): number {
    return 20000;
  }

  // 3.2 — Undergraduate borrowing limit
  override getBorrowingLimit(): number {
    return 5;
  }
}

class GraduateStudent extends Student {
  protected override getCreditLimit(): number {
    return 12;
  }

  // 3.1 — Graduate scholarship
  override calculateScholarship(): number {
    return 50000;
  }

  // 3.2 — Graduate borrowing limit
  override getBorrowingLimit(): number {
    return 10;
  }
}

class ExchangeStudent extends Student {
  protected override getCreditLimit(): number {
    return 15;
  }

  // 3.1 — Exchange students receive no scholarship
  override calculateScholarship(): number {
    return 0;
  }

  // 3.2 — Exchange borrowing limit
  override getBorrowingLimit(): number {
    return 3;
  }
}

// 3.3 — No more scholarshipFor() function!
// Ask each student to calculate their own scholarship.
function totalScholarships(students: Student[]): number {
  let total = 0;

  for (const student of students) {
    total += student.calculateScholarship();
  }

  return total;
}

// 3.4 — No more borrowingLimitFor() function!
// Ask the student for their own borrowing limit.
function canBorrow(student: Student, booksAlreadyBorrowed: number): boolean {
  return booksAlreadyBorrowed < student.getBorrowingLimit();
}

// ---------------------------------------------------------------
// Checks — do not modify below this line
// ---------------------------------------------------------------

let passed = 0;
let total = 0;

function check(label: string, test: () => boolean): void {
  total++;

  try {
    if (test()) {
      passed++;
      console.log(`PASS  ${label}`);
    } else {
      console.log(`FAIL  ${label}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message === "TODO" ? `TODO  ${label}` : `ERROR ${label} (${message})`);
  }
}

// A new student type that did not exist when totalScholarships()
// and canBorrow() were originally written.
class VisitingStudent extends Student {
  protected override getCreditLimit(): number {
    return 6;
  }

  override calculateScholarship(): number {
    return 10000;
  }

  override getBorrowingLimit(): number {
    return 2;
  }
}

const awa = new UndergraduateStudent("Awa", "S-001");
const fatou = new GraduateStudent("Fatou", "G-001");
const ibrahima = new ExchangeStudent("Ibrahima", "E-001");
const yacine = new VisitingStudent("Yacine", "V-001");

check("3.1 undergraduate scholarship", () => awa.calculateScholarship() === 20000);
check("3.1 graduate scholarship", () => fatou.calculateScholarship() === 50000);
check("3.1 exchange scholarship", () => ibrahima.calculateScholarship() === 0);

check("3.2 borrowing limits", () =>
  awa.getBorrowingLimit() === 5 &&
  fatou.getBorrowingLimit() === 10 &&
  ibrahima.getBorrowingLimit() === 3
);

check("3.3 total scholarships", () =>
  totalScholarships([awa, fatou, ibrahima]) === 70000
);

check("3.3 works for a class it has never seen", () =>
  totalScholarships([awa, yacine]) === 30000
);

check("3.4 can borrow below the limit", () =>
  canBorrow(awa, 4) === true
);

check("3.4 cannot borrow at the limit", () =>
  canBorrow(awa, 5) === false
);

check("3.4 works for a class it has never seen", () =>
  canBorrow(yacine, 1) === true &&
  canBorrow(yacine, 2) === false
);

console.log(`\n${passed} / ${total} checks passed`);
