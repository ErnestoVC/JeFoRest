import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { validate as isUUID } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product_category.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create_product_category';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class ProductCategoryService {
    private readonly logger = new Logger('ProductsCategoriesService');

    constructor(
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>,

        private readonly dataSource: DataSource
    ) { }

    async create(createProductCategoryDto: CreateProductCategoryDto, user: User) {

        try {
            const newProductCategory = createProductCategoryDto;

            if (isUUID(newProductCategory.parentProductCategoryId)) {

                const parente_category = await this.productCategoryRepository.findOneBy({ id: newProductCategory.parentProductCategoryId })

                // const productCategory = this.productCategoryRepository.create(
                //     {
                //         parentProductCategory: parente_category,
                //         ...productCategoriesDetails,
                //         user
                //     }
                // );

                const productCategory = new ProductCategory()
                productCategory.categoryName = newProductCategory.categoryName;
                productCategory.description = newProductCategory.description;
                productCategory.parentProductCategory = parente_category;
                productCategory.user = user

                await this.dataSource.manager.save(productCategory)

                //await this.productCategoryRepository.save(productCategory);

                return { ...productCategory };
            } else {
                // const productCategory = this.productCategoryRepository.create(
                //     {
                //         parentProductCategory: null,
                //         ...productCategoriesDetails,
                //         user
                //     }
                // );

                // await this.productCategoryRepository.save(productCategory);

                const productCategory = new ProductCategory()
                productCategory.categoryName = newProductCategory.categoryName;
                productCategory.description = newProductCategory.description;
                productCategory.parentProductCategory = null;
                productCategory.user = user

                await this.dataSource.manager.save(productCategory)

                return { ...productCategory };
            }

        } catch (error) {
            this.handleDBExceptions(error)
        }
    }

    async getAll(){
        const productsCategories = await this.dataSource.manager.getTreeRepository(ProductCategory).findTrees()

        return productsCategories
        
    }

    private handleDBExceptions(error: any) {

        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error)
        // console.log(error)
        throw new InternalServerErrorException('Unexpected error, check server logs');

    }
}
