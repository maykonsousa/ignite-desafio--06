import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import {app} from "../../../../app";


let connection: Connection;

describe("ShowUserProfilecontroller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

  });

  //show profile
  it("should be able to show user profile", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmail.com", password: "123456"};
    const user = await request(app).post("/users").send(userData);
    const login = await request(app).post("/sessions").send({email:userData.email, password:userData.password});
    const token = login.body.token;
    const response = await request(app).get("/profile").send(user.body.id).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  })

  it("should not be able to show user profile with wrong token", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmail.com", password: "123456"};
    const user = await request(app).post("/users").send(userData);
    const token = "wrong-token";
    const response = await request(app).get("/profile").send(user.body.id).set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({message: "JWT invalid token!"});
  })

  //token is missing
  it("should not be able to show user profile without token", async () => {
    const userData = {name: "Maykon Sousa", email: "maykon.sousa@hotmail.com", password: "123456"};
    const user = await request(app).post("/users").send(userData);
    const response = await request(app).get("/profile").send(user.body.id);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({message: "JWT token is missing!"});
  })

});
