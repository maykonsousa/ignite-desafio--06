import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createuserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createuserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it('should be able to create a user', async () => {
    const user = await createuserUseCase.execute({
      name: 'Maykon Sousa',
      email: 'maykon.sousa@hotmail.com',
      password: '123456'
  })

  expect(user).toHaveProperty('id');
});

it('should not be able to create a user with same email', async () => {
  await createuserUseCase.execute({
    name: 'Maykon Sousa',
    email: 'maykon.sousa@hotmail.com',
    password: '123456'})

    expect(async()=>{
      await createuserUseCase.execute({
        name: 'Maykon Sousa 2',
        email: 'maykon.sousa@hotmail.com',
        password: '123456'})
    }).rejects.toBeInstanceOf(CreateUserError);
});
})
