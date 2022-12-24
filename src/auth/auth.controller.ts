import { Controller, Post, Body, Get, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    createUser(@Body() createUserDTO: CreateUserDto) {
        return this.authService.create(createUserDTO);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('check-status')
    @Auth()
    checkAuthStatus(
        @GetUser() user: User
    ) {
        return this.authService.checkAuthStatus(user);
    }


    @Get('private')
    @UseGuards(AuthGuard())
    testingPrivateRoute(
        @Req() request: Express.Request,
        @GetUser() user: User,
        @GetUser('email') userEmail: string,

        @RawHeaders() rawHeaders: string[],
        @Headers() headers: IncomingHttpHeaders,
    ) {


        return {
            ok: true,
            message: 'Hola Mundo Private',
            user,
            userEmail,
            rawHeaders,
            headers
        }
    }
}
