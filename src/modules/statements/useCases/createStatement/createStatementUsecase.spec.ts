import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import {CreateStatementError} from './CreateStatementError'

let createStatementUsecase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;


describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUsecase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )
  });

  it("should be able to create a statement", async () => {
    const userdata = {name:"Maykon Sousa", email:"maykon.sousa@hotmaail.com", password:"123456"};
    const user = await usersRepositoryInMemory.create(userdata)
    const statementData = { user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'salário',}

    const statement = await createStatementUsecase.execute(statementData)

    expect(statement).toHaveProperty('id')
  })
  //user not found
  it("should not be able to create a statement with a user not found", async () => {
    const statementData = { user_id: "123456",
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'salário'
    }

    expect(async () => {
      await createStatementUsecase.execute(statementData)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  //insufficient funds
  it("should not be able to create a statement with insufficient funds", async () => {
    const userdata = {name:"Maykon Sousa", email:"maykon.sousa@hotmaail.com", password:"123456"};
    const user = await usersRepositoryInMemory.create(userdata)
    const statementData = { user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 1000,
      description: 'aluguel'
    }

    expect(async () => {
      await createStatementUsecase.execute(statementData)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

});
