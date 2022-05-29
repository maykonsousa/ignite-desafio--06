import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import {app} from "../../../../app";


let connection: Connection;
const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmmail.com", password: "123456"};
const statementDepositData = {amount: 100, description: "deposit"};
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

  it("should be able to create a new deposit statement", async () =>{
   await request(app).post("/users").send(userData);
   const login = await request(app).post("/sessions").send({email: userData.email, password: userData.password});
   const {token} = login.body;
    const response = await request(app).post(`/statements/deposit`).set({
      Authorization: `Bearer ${token}`
    }).send(statementDepositData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toEqual("deposit");
  });

  it("should be able to create a new withdraw statement", async () =>{
    await request(app).post("/users").send(userData);
    const login = await request(app).post("/sessions").send({email: userData.email, password: userData.password});
    const {token} = login.body;
    const response = await request(app).post(`/statements/withdraw`)
    .set({Authorization: `Bearer ${token}`})
    .send(statementWithdrawData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toEqual("withdraw");
  })

  //not funds
  it("should not be able to create a new withdraw statement if the user has no funds ", async () =>{
    await request(app).post("/users").send(userData);
    const login = await request(app).post("/sessions").send({email: userData.email, password: userData.password});
    const {token} = login.body;
    const response = await request(app).post(`/statements/withdraw`).set({
      Authorization: `Bearer ${token}`
    }).send(statementWithdrawData)
    expect(response.status).toBe(400);
    expect(response.body).toEqual({message:"Insufficient funds"});


  });




});
