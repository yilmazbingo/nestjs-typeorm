import { Expose } from 'class-transformer';

// this is a serizalization dto
export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
}
