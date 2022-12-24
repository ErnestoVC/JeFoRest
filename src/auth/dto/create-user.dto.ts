import {
    IsString, 
    IsEmail, 
    MinLength,
    MaxLength,
    Matches,
    IsNotEmpty
} from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    @IsNotEmpty()
    password: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    documentType: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(18)
    document: string;
}