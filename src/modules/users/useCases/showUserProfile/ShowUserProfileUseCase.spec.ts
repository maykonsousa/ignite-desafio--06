import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";


let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;
const userData = {name:"Maykon Sousa", email:"maykon.sousa@hotmail.com", password:"123456"}

describe('ShowUserProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  })

  it('should be able to return the user profile', async () => {
    const user = await usersRepository.create(userData);
    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile.id).toBe(user.id);
  })

  //user not found
  it('should be able to return error when user not found', async () => {
    expect(async ()=>{
      await showUserProfileUseCase.execute("1");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
