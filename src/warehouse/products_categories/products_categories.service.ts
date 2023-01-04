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

    private handleDBExceptions(error: any) {

        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error)
        // console.log(error)
        throw new InternalServerErrorException('Unexpected error, check server logs');

    }

    async create(createProductCategoryDto: CreateProductCategoryDto, user: User) {

        try {
            const newProductCategory = createProductCategoryDto;

            if (isUUID(newProductCategory.parentProductCategoryId)) {

                const parente_category = await this.productCategoryRepository.findOneBy({ id: newProductCategory.parentProductCategoryId })

                const productCategory = new ProductCategory()
                productCategory.categoryName = newProductCategory.categoryName;
                productCategory.description = newProductCategory.description;
                productCategory.parentProductCategory = parente_category;
                productCategory.user = user

                await this.dataSource.manager.save(productCategory)

                return { ...productCategory };
            } else {
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
<<<<<<< HEAD
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

            console.log(productCategory);
        }

        if (!productCategory) {
            throw new NotFoundException(`Product with ${term} not found`);
        }

        return productCategory;
=======
        
>>>>>>> parent of e252f02 (Merge pull request #6 from ErnestoVC/2-listar-las-cateogorías-por-id-o-término)
    }

    async deactivate(id: string){

        if(isUUID(id)){

            const ProductCategory = await this.findOne(id)
            await this.productCategoryRepository.update(id, {state: 0})
            
            return ProductCategory
        } else{
            throw new BadRequestException(`The id: ${id} does not exists`)
        }
    }
}
