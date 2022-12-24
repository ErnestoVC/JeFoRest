import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../auth/entities/user.entity';

@Entity({name:'products_categories'})
export class ProductCategory {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    categoryName: string;

    @Column('text',{
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @ManyToOne(
        () => ProductCategory,
        productCategory => productCategory.childProductsCategories
    )
    parentProductCategory: ProductCategory

    @OneToMany(
        () => ProductCategory,
        productCategory => productCategory.parentProductCategory
    )
    childProductsCategories: ProductCategory[]

    @ManyToOne(
        () => User,
        (user) => user.productsCategories,
        {eager: true}
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.categoryName;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
}