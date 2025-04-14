import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty({ message: 'A rendszám megadása kötelező.' })
  license_plate_number: string;

  @IsString()
  @IsNotEmpty({ message: 'A márka megadása kötelező.' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'A modell megadása kötelező.' })
  model: string;

  @IsInt({ message: 'A napi költség csak egész szám lehet.' })
  @Min(1, { message: 'A napi költség pozitív egész szám kell legyen.' })
  @IsNotEmpty({ message: 'A napi költség megadása kötelező.' })
  daily_cost: number;
}

