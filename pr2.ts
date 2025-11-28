//2.1 Інтерфейс IWorker
interface PrizeLogger {
    (prize: string): void;
}

interface IWorker {
    id: number;
    name: string;
    surname: string;
    available: boolean;
    salary: number;
    markPrize?: PrizeLogger;
}

const workers: IWorker[] = [
    { id: 1, name: "Ivan", surname: "Ivanov", available: true, salary: 500 },
    { id: 2, name: "Petro", surname: "Petrov", available: false, salary: 600 },
];

function getAllWorkers(): IWorker[] {
    return workers;
}

function getWorkerByID(id: number): IWorker | undefined {
    return workers.find(worker => worker.id === id);
}

function printWorker(worker: IWorker): void {
    console.log(`${worker.name} ${worker.surname} got salary ${worker.salary}`);
}

//2.2 Змінна logPrize
const logPrize: PrizeLogger = (prize: string) => {
    console.log(`Prize logger says: ${prize}`);
};

//використання logPrize
logPrize("Best Worker 2025");

// Використання markPrize
const worker1 = getWorkerByID(1);
if (worker1) {
    printWorker(worker1);
    worker1.markPrize = logPrize;
    worker1.markPrize("Employee of the Month");
}

// 2.3 Розширення інтерфейсів
interface Person {
    name: string;
    email: string;
}

interface Author extends Person {
    numBooksPublished: number;
}

interface Librarian extends Person {
    department: string;
    assistCustomer(custName: string): void;
}

const favoriteAuthor: Author = {
    name: "John Doe",
    email: "john@example.com",
    numBooksPublished: 5,
};

//2.4 Клас UniversityLibrarian
class UniversityLibrarian implements Librarian {
    name: string;
    email: string;
    department: string;

    constructor(name: string, email: string, department: string) {
        this.name = name;
        this.email = email;
        this.department = department;
    }

    assistCustomer(custName: string): void {
        console.log(`${this.name} is assisting ${custName}`);
    }
}

//Ініціалізація favoriteLibrarian через клас (вимога 2.4)
const favoriteLibrarian: Librarian = new UniversityLibrarian(
    "Anna Smith",
    "anna@example.com",
    "Science"
);

//2.5 Абстрактний клас ReferenceItem
abstract class ReferenceItem {
    static department: string = "General";

    title: string;
    protected year: number;
    private _publisher: string = "";

    constructor(title: string, year: number) {
        console.log("Creating a new ReferenceItem ...");
        this.title = title;
        this.year = year;
    }

    printItem(): void {
        console.log(`${this.title} was published in ${this.year}`);
        console.log(`Department: ${ReferenceItem.department}`);
    }

    get publisher(): string {
        return this._publisher.toUpperCase();
    }

    set publisher(newPublisher: string) {
        this._publisher = newPublisher;
    }

    abstract printCitation(): void;
}

//2.6 Клас Encyclopedia
class Encyclopedia extends ReferenceItem {
    edition: number;

    constructor(title: string, year: number, edition: number) {
        super(title, year);
        this.edition = edition;
    }

    printItem(): void {
        super.printItem();
        console.log(`Edition: ${this.edition} (${this.year})`);
    }

    printCitation(): void {
        console.log(`${this.title} - ${this.year}`);
    }
}

const refBook = new Encyclopedia("Encyclopedia of TypeScript", 2024, 2);
refBook.publisher = "Manning";

//Вивід усіх результатів
console.log("\n Всі робітники ");
getAllWorkers().forEach(printWorker);

console.log("\n Виклик favoriteLibrarian ");
favoriteLibrarian.assistCustomer("John");

console.log("\n Виклик UniversityLibrarian ");
const librarian1 = new UniversityLibrarian("Olena", "olena@ex.com", "Arts");
librarian1.assistCustomer("Oleh");

console.log("\n Виклик refBook");
refBook.printItem();
refBook.printCitation();
console.log("Publisher: " + refBook.publisher);
