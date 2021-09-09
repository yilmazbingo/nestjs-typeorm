import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

// whenever we are testing methods inside of a controller, we do not get the ability to run or to make any use of the surronunding decorators
// we do not have the ability to make sure that something comes out the query string or make sure that that method is tied to GET request.
// to test decorators we need to write out end to end test
describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'dfdsf', password: 'sdafds' }),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'dsaa' }]),
      remove: (id: number) =>
        Promise.resolve({ id, email: 'afdfdsaf', password: 'dsaa' }),
      // update: () => {},
    };
    fakeAuthService = {
      // signUp: () => {},
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    // this is isolated DI container. creating an instance of a user's controller. User's controller needs usersService and authService
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // our controller methods are simple functions and that is what we want so it can be testable easily
  it('find all users returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asadad');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asadad');
  });
  it('findUser returns single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });
  it('signin update session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'afdasf', password: 'asdf' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
