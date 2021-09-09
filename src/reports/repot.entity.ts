import { User } from 'src/users/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

//entity creates the table
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;
  // Many reports have one user
  // ManyToOne cause change in db, but OneToMany does not cause change in db on the report table
  //Association is not automatically fetched when we fetch a Report
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
