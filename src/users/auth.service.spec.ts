import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //  create a fake copy of the users service so we inject this instead of real UsersService
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      // providers is a list of all different classes we might want to inject into our DI container. Then DI can create any instance we want
      providers: [
        // authService will tell DI container that at some point in time we want to create an instance of auth service.
        AuthService,
        {
          // provide means usersSErvice is injected into AuthService
          provide: UsersService,
          // this is gonna trick, reroute the DI system. This will change how different classes or things get resolved whenever we ask for a copy of Authservice
          // If anyone asks for copy of UsersService, then give them the value fake users service.
          // provide means, If anyone asks for UsersService
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    //   reacht the DI container and get the authentication service
    // this will cause DI container to create the new instance of the auth service with all of its different dependencies already initalized
    service = module.get(AuthService);
  });

  it('can create an ins tance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('some.@email.com', 'somePassword');
    expect(user.password).not.toEqual('somePassword');
    const [salt, hash] = user.password.split('.');
    console.log('Salt', salt);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // jest does not work well with async. thats why "done" is used
  it('throws an error if uses signs up with email that is in use', (done) => {
    // firs call we succed. user will be pushed to the users[]
    service.signUp('emailadress', 'asdf').then(() => done());

    service.signUp('emailadress', 'asdf').catch(() => done());
    // try {
    //   service.signUp('sameEmailAddress', 'asdf');
    // } catch (e) {
    //   // signup funtion will throw error. we are going to catch, so done() will be called, means our test suite is complete
    //   done();
    // }
    // if done() does not get called in 5 seconds jest will assume that we have failed.
  });
  it('throws if signin is called with an unused email', (done) => {
    service.signin('anyemai@hoodf', 'passrod').catch(() => done());
  });
  it('throws if an invalid password is provided', (done) => {
    service.signUp('any user', 'password').then(() => done());
    service.signin('any user', 'password').catch(() => done());
    // ---- if you enter same credentials till will fail the test
    // service.signin('any user', 'password').then(() => done());
  });
  it('returns a user if correct password is provided', async () => {
    await service.signUp('adsf@hotmail.com', 'mypassword');

    const user = await service.signin('adsf@hotmail.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
