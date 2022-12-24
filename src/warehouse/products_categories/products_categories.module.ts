import { Module } from '@nestjs/common';
import { ProductsCategoriesController } from './products_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product_category.entity';
import { AuthModule } from '../../auth/auth.module';
import { ProductCategoryService } from './products_categories.service';

@Module({
  controllers: [ProductsCategoriesController],
  providers: [ProductCategoryService],
  imports: [
    TypeOrmModule.forFeature([ProductCategory]),
    AuthModule,
  ],
  exports: [
    ProductCategoryService,
    TypeOrmModule,
  ]
})
export class ProductsCategoriesModule {}
