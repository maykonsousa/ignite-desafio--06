import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: IUsersRepository;

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('AuthenticateUserUseCase', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

  })

  it('should be able to authenticate a user', async () => {
    const user = {name:"Maykon Sousa", email:"maykon.sousa@hotmail.com", password:"123456"};
     await createUserUseCase.execute(user);
    const userAuthenticated = await authenticateUserUseCase.execute({email:user.email, password:user.password});
    expect(userAuthenticated).toHaveProperty('user');
    expect(userAuthenticated).toHaveProperty('token');
  });

  it('should not be able to authenticate a user with incorrect email/password', async () => {
    const user = {name:"Maykon Sousa", email:"maykon.sousa@hotmail.com", password:"123456"};
     await createUserUseCase.execute(user);

     expect(async()=>{
        await authenticateUserUseCase.execute({email:user.email, password:"1234567"});
      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
});
