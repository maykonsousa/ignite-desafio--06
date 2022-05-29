import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import {app} from "../../../../app";


let connection: Connection;
const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmmail.com", password: "123456"};
const statementDepositData = {amount: 1000, description: "deposit"};
const statementWithdrawData = {amount: 100, description: "withdraw"};
describe("CreateStatementController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

  });

  it("Should be able to show a user balance", async () => {
    await request(app).post("/users").send(userData);
    const login = await request(app).post("/sessions").send({email: userData.email, password: userData.password});
    const {token} = login.body;

    await  request(app).post(`/statements/deposit`).set({
      Authorization: `Bearer ${token}`
    }).send(statementDepositData);

    await request(app).post(`/statements/withdraw`).set({
      Authorization: `Bearer ${token}`
    }).send(statementWithdrawData);

    const response = await request(app).get("/statements/balance").set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(900);



  })

  //user not found
  it("Should not be able to show a user balance if user not found", async () => {
    const response = await request(app).get("/statements/balance");
    expect(response.status).toBe(401);
  })

})
