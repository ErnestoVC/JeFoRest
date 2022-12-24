import { IsArray, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateProductCategoryDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    categoryName: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    parentProductCategoryId: string;
}