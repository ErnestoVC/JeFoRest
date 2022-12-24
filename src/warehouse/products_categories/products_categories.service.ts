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
            const { parentProductCategoryId, ...productCategoriesDetails } = createProductCategoryDto;

            if (isUUID(parentProductCategoryId)) {

                const parente_category = await this.productCategoryRepository.findOneBy({ id: parentProductCategoryId })

                const productCategory = this.productCategoryRepository.create(
                    {
                        parentProductCategory: parente_category,
                        ...productCategoriesDetails,
                        user
                    }
                );

                await this.productCategoryRepository.save(productCategory);

                return { ...productCategory };
            } else {
                const productCategory = this.productCategoryRepository.create(
                    {
                        parentProductCategory: null,
                        ...productCategoriesDetails,
                        user
                    }
                );

                await this.productCategoryRepository.save(productCategory);

                return { ...productCategory };
            }



        } catch (error) {
            this.handleDBExceptions(error)
        }
    }

    private handleDBExceptions(error: any) {

        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error)
        // console.log(error)
        throw new InternalServerErrorException('Unexpected error, check server logs');

    }
}
