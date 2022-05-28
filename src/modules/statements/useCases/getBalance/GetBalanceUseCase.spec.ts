import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
const userData = {name:"Maykon Sousa", email:"maykon.sousa@hotmail.com", password:"123456"}
const statementdepositData = {user_id:"1", type:OperationType.DEPOSIT, amount:1000, description:"job"}
const statementwithdrawData = {user_id:"1", type:OperationType.WITHDRAW, amount:500, description:"mercado"}

describe('GetBalanceUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });


  it('should return the balance of user', async () => {
    const user = await usersRepository.create(userData);
     await statementsRepository.create({...statementdepositData, user_id:user.id as string});
     await statementsRepository.create({...statementwithdrawData, user_id:user.id as string});
    const balance = await getBalanceUseCase.execute({user_id:user.id as string});
    expect(balance.balance).toBe(500);
    expect(balance.statement).toHaveLength(2);

  })


  it('should return the balance of user with no statements', async () => {
    const user = await usersRepository.create(userData);
    const balance = await getBalanceUseCase.execute({user_id:user.id as string});
    expect(balance.balance).toBe(0);
    expect(balance.statement).toHaveLength(0);
  });


  it('should return error when user not found', async () => {
    expect(async ()=>{
      await getBalanceUseCase.execute({user_id:"1"});
    }).rejects.toBeInstanceOf(GetBalanceError);

  });
});
