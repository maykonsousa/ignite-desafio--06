import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import {app} from "../../../../app";
import {v4 as uuid} from "uuid";


let connection: Connection;
const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmmail.com", password: "123456"};
const statementDepositData = {amount: 1000, description: "deposit"};
const statementWithdrawData = {amount: 100, description: "withdraw"};
const fakeId = uuid();
describe("GetStatementOperationController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

  });

  //get operation balance
  it("Should be able to show a user's operation", async () => {
    await request(app).post("/users").send(userData);
    const login = await request(app).post("/sessions").send({email: userData.email, password: userData.password});
    const {token} = login.body;
    const statement = await request(app).post(`/statements/deposit`).set({
      Authorization: `Bearer ${token}`
    }).send(statementDepositData);

    const response = await request(app).get(`/statements/${statement.body.id}`).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200);
    expect(response.body.amount).toBe("1000.00");
  });

  //user not found
  it("Should not be able to show a user's operation if user not logged", async () => {
    const response = await request(app).get(`/statements/${fakeId}`);
    expect(response.status).toBe(401);
  })

  //statement not found
  it("Should not be able to show a user's operation if statement not found", async () => {
    await request(app).post("/users").send(userData);
    const login = await request(app).post("/sessions").send({email: userData.email, password: userData.password});
    const {token} = login.body;
    const response = await request(app).get(`/statements/${fakeId}`).set({
      Authorization: `Bearer ${token}`
    })


    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Statement not found");

  })

});
