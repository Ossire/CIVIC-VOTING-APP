import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  singUp(@Body() signupDto: SignUpDto) {
    return this.authService.create(signupDto);
  }

  @Post('login')
  logIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
