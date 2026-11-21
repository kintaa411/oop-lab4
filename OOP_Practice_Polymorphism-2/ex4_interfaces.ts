
// Exercise 4 — Polymorphism Through Interfaces

// TODO 4.1 — Define the Billable interface
interface Billable {
  calculateTuition(): number;
  describe(): string;
}

abstract class Student implements Billable {
  private name: string;
  private id: string;
  private credits = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  protected abstract getCreditLimit(): number;
  abstract calculateTuition(): number;

  addCredits(amount: number): boolean {
    if (!Number.isInteger(amount) || amount <= 0) return false;
    if (this.credits + amount > this.getCreditLimit()) return false;
    this.credits += amount;
    return true;
  }

  getCredits(): number {
    return this.credits;
  }

  describe(): string {
    return `${this.name} (${this.id}): ${this.credits} credits`;
  }
}

class UndergraduateStudent extends Student {
  protected override getCreditLimit(): number {
    return 21;
  }

  override calculateTuition(): number {
    return this.getCredits() * 10000;
  }
}

class GraduateStudent extends Student {
  private advisor: string;

  constructor(name: string, id: string, advisor: string) {
    super(name, id);
    this.advisor = advisor;
  }

  protected override getCreditLimit(): number {
    return 12;
  }

  override calculateTuition(): number {
    return 150000;
  }

  getAdvisor(): string {
    return this.advisor;
  }
}

// TODO 4.2 — Short-course participant
class ShortCourseParticipant implements Billable {
  private name: string;
  private course: string;

  constructor(name: string, course: string) {
    this.name = name;
    this.course = course;
  }

  calculateTuition(): number {
    return 75000;
  }

  describe(): string {
    return `${this.name}, short course: ${this.course}`;
  }
}

// TODO 4.3 — Library membership
class LibraryMembership implements Billable {
  private holder: string;
  private months: number;

  constructor(holder: string, months: number) {
    this.holder = holder;
    this.months = months;
  }

  calculateTuition(): number {
    return this.months * 5000;
  }

  describe(): string {
    return `Library membership: ${this.holder}, ${this.months} months`;
  }
}

// TODO 4.4 — Calculate total revenue
function totalRevenue(items: Billable[]): number {
  let total = 0;

  for (const item of items) {
    total += item.calculateTuition();
  }

  return total;
}

// TODO 4.5 — Generate invoice lines
function invoiceLines(items: Billable[]): string[] {
  const lines: string[] = [];

  for (const item of items) {
    lines.push(
      `${item.describe()}: ${item.calculateTuition()} FCFA`
    );
  }

  return lines;
}

// TODO 4.6 — List advisors of graduate students only
function listAdvisors(students: Student[]): string[] {
  const advisors: string[] = [];

  for (const student of students) {
    if (student instanceof GraduateStudent) {
      advisors.push(student.getAdvisor());
    }
  }

  return advisors;
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

function makeAwa(): UndergraduateStudent {
  const awa = new UndergraduateStudent("Awa", "S-001");
  awa.addCredits(18);
  return awa;
}

const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");
const moussa = new ShortCourseParticipant("Moussa", "Cloud Fundamentals");
const aminata = new LibraryMembership("Aminata", 6);

// An object literal with the right shape.
const guestLecture = {
  calculateTuition: () => 10000,
  describe: () => "Guest lecture: Ousmane",
};

check("4.2 short-course fee", () => moussa.calculateTuition() === 75000);

check("4.2 short-course description", () =>
  moussa.describe() === "Moussa, short course: Cloud Fundamentals"
);

check("4.4 total across unrelated classes", () =>
  totalRevenue([makeAwa(), fatou, moussa]) === 405000
);

check("4.4 any object with the right shape counts", () =>
  totalRevenue([moussa, guestLecture]) === 85000
);

check("4.5 invoice lines", () =>
  invoiceLines([moussa, guestLecture]).join(" | ") ===
    "Moussa, short course: Cloud Fundamentals: 75000 FCFA | Guest lecture: Ousmane: 10000 FCFA"
);

check("4.6 advisors of graduate students only", () =>
  listAdvisors([
    makeAwa(),
    fatou,
    new GraduateStudent("Mamadou", "G-002", "Dr. Sow")
  ]).join(",") === "Dr. Diop,Dr. Sow"
);

check("4.6 a group without graduate students", () =>
  listAdvisors([makeAwa()]).length === 0
);

// Checks for TODO 4.3
const membership: Billable = aminata;

check("4.3 library membership fee", () =>
  totalRevenue([membership]) === 30000
);

check("4.3 library membership description", () =>
  invoiceLines([membership])[0] ===
    "Library membership: Aminata, 6 months: 30000 FCFA"
);

console.log(`\n${passed} / ${total} checks passed`);
