import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";


let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

let userData = {name:"Maykon Sousa", email:"maykon.sousa@hotmail.com", password:"123456"}
let statementdepositData = {user_id:"1", type:OperationType.DEPOSIT, amount:1000, description:"job"}

describe('GetStatementOperationUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  })

  it('should be able to return the statement of user', async () => {
    const user = await usersRepository.create(userData);
    const statement = await statementsRepository.create({...statementdepositData, user_id:user.id as string});
    const statementOperation = await getStatementOperationUseCase.execute({
      user_id:user.id as string,
      statement_id:statement.id as string});

    expect(statementOperation.id).toBe(statement.id);
  })

  //statement not found
  it('should be able to return error when statement not found', async () => {
    const user = await usersRepository.create(userData);
    expect(async ()=>{
      await getStatementOperationUseCase.execute({
        user_id:user.id as string,
        statement_id:"1"});
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })

  //user not found
  it('should be able to return error when user not found', async () => {
    expect(async ()=>{
      await getStatementOperationUseCase.execute({
        user_id:"1",
        statement_id:"1"});
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

})
