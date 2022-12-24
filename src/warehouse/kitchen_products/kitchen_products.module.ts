import { Module } from '@nestjs/common';
import { KitchenProductsController } from './kitchen_products.controller';
import { KitchenProductsService } from './kitchen_products.service';

@Module({
  controllers: [KitchenProductsController],
  providers: [KitchenProductsService]
})
export class KitchenProductsModule {}
