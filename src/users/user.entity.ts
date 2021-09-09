import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Report } from '../reports/repot.entity';

// Connnect the entity to the User Module
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  // @Exclude() nest.js suggest this not good for admin because admin wants to see whole data
  password: string;
  // one user can have many reports, but on Report we set many-to-one on user
  // this decorator does not cause change in db. but ManyToOne causes change in db
  // Association is not automatically fetched when ww fetch a User
  // () => Report this tells User will be associated with type Report

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
  @Column({ default: true })
  admin: boolean;
}

/*
() => Report this is function becasue we have circular dependency between User.entity and Report.entiity.
Circular dependency will cause one of the imports, User or Report whichever executed latest, will be undefined. 
Because of circular dependency we cannot make direct reference of User or Report. tha

*/

/* 
 (report) => report.user
 lets say in the future, we have one user who issued the report and another user approved the reports. 
 Report and User are related in more than one way. 
 
 */
