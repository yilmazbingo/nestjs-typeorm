import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // this decorator requires because of using generic types
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    // create does not save or persist data inside of your database. It takes some information, creates a new instance of user entity and then assignn that data to the entity.
    const user = this.repo.create({ email, password });
    // now we pass created userEntitiy to the save method. save() is used for actual persistance
    // we could just pass manual obj instead of entity. BUt sometimes we add a validation logic to the entity so we want the object get validated before persistence.
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }
  find(email: string) {
    return this.repo.find({ email });
  }

  // insert and update made to beused with the plain objects, but no hooks associated with them will be executed because we are not working with the entity instance.
  // if we were making update with plain object, we did not need to fetch data and then save it. but fetching will bring an enttity object so hooks will be called
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  // remove designed to work with an entity. so we need to fetch it but delete receives a plain object
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
