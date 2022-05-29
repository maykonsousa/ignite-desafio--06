import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import {app} from "../../../../app";


let connection: Connection;

describe("AutheenticateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

  });

//authenticateUser
  it("should be able to authenticate a user", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmaail.com", password: "123456"};
    await request(app).post("/users").send(userData);
    const response = await request(app).post("/sessions").send({email:userData.email, password:userData.password});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  })

  it("should not be able to authenticate a user with wrong password", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmaail.com", password: "123456"};
    await request(app).post("/users").send(userData);
    const response = await request(app).post("/sessions").send({email:userData.email, password:"wrong-password"});
    expect(response.status).toBe(401);
    expect(response.body).toEqual({message: "Incorrect email or password"});
  })

  it("should not be able to authenticate a user with wrong email", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmaail.com", password: "123456"};
    await request(app).post("/users").send(userData);
    const response = await request(app).post("/sessions").send({email:"wrongemail@teste.com.br", password:userData.password});
  })

});
