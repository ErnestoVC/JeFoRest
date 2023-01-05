import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

    async getAll() {
        const productsCategories = await this.dataSource.manager.getTreeRepository(ProductCategory).findTrees()

        return productsCategories

    }

    async findOne(term: string) {
        let productCategory: ProductCategory;

        if (isUUID(term)) {
            productCategory = await this.productCategoryRepository.findOneBy({ id: term });
        } else {
            productCategory = await this.productCategoryRepository.createQueryBuilder('products_categories')
                .where('products_categories.categoryName =:categoryName', {
                    categoryName: term,
                })
                .orWhere('products_categories.slug =:slug', {
                    slug: term,
                })
                .getOne();
        }

        if (!productCategory) {
            throw new NotFoundException(`Product Category with ${term} not found`);
        }

        return productCategory;
    }

    async desActivate(id: string) {
        const productCategory = await this.findOne(id);

        switch (productCategory.state) {
            case true:
                await this.productCategoryRepository.update(id, { state: false })
                return {
                    message: `Product Category with id ${id} has been desactivate`
                }
                break;
            case false:
                await this.productCategoryRepository.update(id, { state: true })
                return {
                    message: `Product Category with id ${id} has been activated`
                }
            default:
                throw new BadRequestException(`Product Category State only can be false or true`);
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
