// 1 Інтерфейс для типізації робітників
interface IWorker {
    id: number;                  
    name: string;                
    surname: string;            
    available: boolean;          
    salary: number;              
    category: Category;          
}

// 1.2 Enum категорій (перелік можливих ролей)
enum Category {
    BusinessAnalyst,             
    Developer,                  
    Designer,                   
    QA,                        
    ScrumMaster                  
}

// 2 Функція, що повертає колекцію (масив) робітників
function getAllWorkers(): IWorker[] { 
    return [
        { id: 1, name: "John", surname: "Smith", available: true,  salary: 1000, category: Category.Developer },
        { id: 2, name: "Anna", surname: "Brown", available: false, salary: 1200, category: Category.Designer },
        { id: 3, name: "James", surname: "Wilson", available: true, salary: 900,  category: Category.QA },
        { id: 4, name: "Olivia", surname: "Taylor", available: true, salary: 1500, category: Category.Developer },
        { id: 5, name: "Sophia", surname: "Johnson", available: false, salary: 1100, category: Category.BusinessAnalyst }
    ];
}

// 4 Функція, що виводить інформацію про робітників
function logFirstAvailable(workers: IWorker[] = getAllWorkers()): void {
    

    console.log(`Кількість робітників: ${workers.length}`);

    const firstAvailable = workers.find(w => w.available); 

    if (firstAvailable) { // Якщо знайдено
        console.log(`Перший доступний: ${firstAvailable.name} ${firstAvailable.surname}`); 
    }

    console.log(`\nУсі робітники:`); 
    for (const worker of workers) { 
        console.log(`- ${worker.name} ${worker.surname}, ${Category[worker.category]}`); 
        
    }
}

// Виклик функції — запустить вивід усіх працівників
logFirstAvailable();

// 5 Робота з Enum і фільтрацією


function getWorkersSurnamesByCategory(category: Category = Category.Designer): Array<string> {
    const workers = getAllWorkers(); 

    return workers
        .filter(worker => worker.category === category) 
        .map(worker => worker.surname); 
}


function logWorkersNames(names: string[]): void {
    names.forEach(name => console.log(name)); 
}


console.log("\nПрізвища робітників у категорії Developer:");
logWorkersNames(getWorkersSurnamesByCategory(Category.Developer)); 

console.log("\nПрізвища робітників за замовчуванням (Designer):");
logWorkersNames(getWorkersSurnamesByCategory()); 
// 6 Функція для пошуку робітника за ID
function getWorkerByID(id: number): IWorker | undefined { 
    
    return getAllWorkers().find(worker => worker.id === id); 
}


console.log("\nРобітники з категорії Developer:");
getAllWorkers()
    .filter(worker => worker.category === Category.Developer) 
    .forEach(worker => console.log(`${worker.name} ${worker.surname}`)); 


const worker = getWorkerByID(3); 
if (worker) { 
    console.log(`\nІнформація про робітника ID=3: ${worker.name} ${worker.surname}, зарплата: ${worker.salary}$`);
}

// 7 Типи функцій
function createCustomerID(name: string, id: number): string {
    
    return `${name}${id}`; 
}

const myID: string = createCustomerID("Vitalii", 10); 
console.log(`\nМій ID: ${myID}`); 


let idGenerator: (name: string, id: number) => string;


idGenerator = (name, id) => `${name}${id}`;
console.log(`Згенеровано за допомогою стрілочної функції: ${idGenerator("Vitalii", 20)}`);


idGenerator = createCustomerID;
console.log(`Згенеровано через присвоєну функцію: ${idGenerator("Vitalii", 30)}`);

// 8️ Необов'язкові та залишкові параметри


function createCustomer(name: string, age?: number, city?: string): void {
    console.log(`\nІм'я замовника: ${name}`);
    if (age) console.log(`Вік: ${age}`);   
    if (city) console.log(`Місто: ${city}`);
}


createCustomer("Vitalii");                
createCustomer("Vitalii", 19);           
createCustomer("Vitalii", 19, "Boryspil"); 


function checkoutWorkers(customer: string, ...workerIDs: number[]): string[] {
    
    console.log(`\nЗамовник: ${customer}`);

    const availableWorkers: string[] = []; 

    workerIDs.forEach(id => {              
        const worker = getWorkerByID(id);  
        if (worker && worker.available) {  
            availableWorkers.push(`${worker.name} ${worker.surname}`); 
        }
    });

    return availableWorkers; 
}

// Виклик checkoutWorkers з кількома ID
const myWorkers = checkoutWorkers("Vitalii", 1, 2, 3, 4, 5);
console.log("\nДоступні робітники:");
myWorkers.forEach(w => console.log(w)); 
