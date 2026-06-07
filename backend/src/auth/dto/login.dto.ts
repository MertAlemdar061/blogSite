import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta giriniz.' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
