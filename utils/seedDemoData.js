// Seeds the demo database with FAKE data so the app can be explored safely.
// Runs only when SEED_DEMO_DATA=true and the employees collection is empty.
// All names, ID numbers and passport numbers below are randomly generated.
import Employee from "../models/EmployeeModel.js";
import Vacation from "../models/VacationModel.js";
import Cancelled from "../models/CancelledModel.js";
import Activity from "../models/ActivityModel.js";
import User from "../models/UserModel.js";
import { hashPassword } from "./passwordUtils.js";

export const DEMO_COMPANIES = [
  "Northwind Logistics",
  "Blue Dune Transport",
  "Pearl Coast Garage",
  "Green Oasis Farms",
  "Sparkle Cleaning Services",
  "Desert Star Trading",
];

const FIRST = ["Ravi", "Arjun", "Suresh", "Anil", "Joseph", "Mark", "Ahmed", "Omar", "Karim", "Hassan", "Bikash", "Ram", "Sanjay", "Rahim", "Imran", "Peter", "John", "Samuel", "Daniel", "Kevin", "Nimal", "Kamal", "Tariq", "Bilal", "Mohan", "Prakash", "Elijah", "Grace", "Maria", "Rosa"];
const LAST = ["Kumar", "Sharma", "Thapa", "Gurung", "Santos", "Reyes", "Hassan", "Mahmoud", "Rahman", "Hossain", "Khan", "Ali", "Perera", "Silva", "Otieno", "Mwangi", "Fernando", "Cruz", "Nair", "Das"];
const NATIONALITIES = ["India", "Nepal", "Philippines", "Egypt", "Bangladesh", "Pakistan", "Sri Lanka", "Kenya"];
const LICENSES = ["Truck", "Car", "Car&Truck", null, null];

// Small deterministic PRNG so every fresh demo looks the same
let seed = 42;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const daysFromNow = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);
const between = (min, max) => Math.floor(min + rand() * (max - min));

const seedDemoData = async () => {
  if (process.env.SEED_DEMO_DATA !== "true") return;
  if ((await Employee.countDocuments()) > 0) return;

  console.log("Seeding demo data...");
  const employees = [];
  const TOTAL = 48;

  for (let i = 0; i < TOTAL; i++) {
    // Mix of states so every report has something to show
    let idExp;
    if (i % 8 === 0) idExp = daysFromNow(-between(5, 90)); // expired ID
    else if (i % 5 === 0) idExp = daysFromNow(between(5, 60)); // renewal soon
    else idExp = daysFromNow(between(60, 720));

    const passportExp = i % 9 === 0 ? daysFromNow(-between(10, 200)) : daysFromNow(between(120, 2500));
    const licenseType = pick(LICENSES);
    let status = "duty";
    if (i % 7 === 3) status = "vacation";
    if (i >= TOTAL - 4) status = "cancelled";

    employees.push({
      name: `${pick(FIRST)} ${pick(LAST)}`,
      nationality: pick(NATIONALITIES),
      idNumber: 28000000000 + i * 7919 + between(0, 7000),
      idExpirationDate: idExp,
      idImage: "",
      passportNumber: `${String.fromCharCode(65 + (i % 26))}${between(1000000, 9999999)}`,
      passportExpirationDate: passportExp,
      passportImage: "",
      sponsor: DEMO_COMPANIES[i % DEMO_COMPANIES.length],
      workIn: DEMO_COMPANIES[(i * 5 + 1) % DEMO_COMPANIES.length],
      agreementExpirationDate: daysFromNow(between(30, 700)),
      licenseType,
      licenseExpirationDate: licenseType ? daysFromNow(between(-30, 900)) : undefined,
      status,
      note: i % 6 === 0 ? "Demo record - fake data" : "",
      cancellationDate: status === "cancelled" ? daysFromNow(-between(5, 120)) : undefined,
    });
  }

  const created = await Employee.insertMany(employees);

  // Vacations: current ones for employees on vacation + some past ones
  const vacations = [];
  created.forEach((emp, i) => {
    if (emp.status === "vacation") {
      const leaving = daysFromNow(-between(3, 40));
      vacations.push({ idNumber: emp.idNumber, employeeName: emp.name, leavingDate: leaving, expectedReturnDate: new Date(leaving.getTime() + 60 * 86400000) });
    }
    if (i % 4 === 1) {
      const leaving = daysFromNow(-between(200, 500));
      const expected = new Date(leaving.getTime() + 45 * 86400000);
      vacations.push({ idNumber: emp.idNumber, employeeName: emp.name, leavingDate: leaving, expectedReturnDate: expected, actualReturnDate: new Date(expected.getTime() + between(-5, 10) * 86400000) });
    }
  });
  const createdVacations = await Vacation.insertMany(vacations);
  await Promise.all(
    createdVacations.map((v) => Employee.updateOne({ idNumber: v.idNumber }, { $push: { vacations: v._id } }))
  );

  await Cancelled.insertMany(
    created.filter((e) => e.status === "cancelled").map((e) => ({ name: e.name, idNumber: e.idNumber, cancellationDate: e.cancellationDate }))
  );

  const demoEmail = process.env.DEMO_EMAIL || "demo@hrmanager.dev";
  const demoPassword = process.env.DEMO_PASSWORD || "demo1234";
  if (!(await User.findOne({ email: demoEmail }))) {
    await User.create({ name: "Demo Admin", email: demoEmail, password: await hashPassword(demoPassword), role: "admin" });
    await User.create({ name: "Sara Moderator", email: "sara@hrmanager.dev", password: await hashPassword(`${demoPassword}-mod`), role: "moderator" });
  }

  const acts = ["Logged In", "Created Employee", "Updated Employee", "Created Vacation", "Updated Vacation", "Deleted Employee", "Logged Out"];
  await Activity.insertMany(
    Array.from({ length: 20 }, (_, i) => ({ userName: i % 3 ? "Demo Admin" : "Sara Moderator", activity: acts[i % acts.length], timeStamp: daysFromNow(-20 + i) }))
  );

  console.log(`Demo data seeded: ${created.length} employees, ${createdVacations.length} vacations.`);
};

export default seedDemoData;
