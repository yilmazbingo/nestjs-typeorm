import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';

//   this is to estimate the value of the price
export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;
  //   value will be incoming "year" in string form
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
