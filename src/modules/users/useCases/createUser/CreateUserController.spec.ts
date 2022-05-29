import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import {app} from "../../../../app";


let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

  });


  it("should be able to create a new user", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmail.com", password: "123456"};
    const response = await request(app).post("/users").send(userData);
    expect(response.status).toBe(201);

  });

  it("should not be able to create a new user with same email", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmail.com", password: "123456"};
     await request(app).post("/users").send(userData);
    const response = await request(app).post("/users").send(userData);
    expect(response.status).toBe(400);
  })
});
