import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { NigerianStates } from 'src/common/enums/state.enums';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be atleast 6 characters' })
  password: string;

  @IsEnum(NigerianStates, { message: 'Please enter a valid Nigerian state ' })
  state: NigerianStates;
}
