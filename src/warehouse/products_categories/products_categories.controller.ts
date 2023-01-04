import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create_product_category';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../../auth/entities/user.entity';
import { ProductCategoryService } from './products_categories.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from '../../auth/interfaces/valid-roles';

@Controller('products-categories')
export class ProductsCategoriesController {
    constructor(private readonly productoCategoryService : ProductCategoryService){}

    @Post('create')
    @Auth(ValidRoles.admin, ValidRoles.almacenero)
    create(
        @Body() createProductCategoryDto : CreateProductCategoryDto,
        @GetUser() user: User,
    ){
        return this.productoCategoryService.create(createProductCategoryDto, user);
    }

    @Get('getAll')
    @Auth(ValidRoles.admin, ValidRoles.almacenero)
    getAll(){
        return this.productoCategoryService.getAll();
    }

    @Get(':term')
    @Auth(ValidRoles.admin, ValidRoles.almacenero)
    findOne(@Param('term') term: string){
        return this.productoCategoryService.findOne(term);
    }
}
