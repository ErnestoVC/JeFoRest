import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { User } from '../../../auth/entities/user.entity';

@Entity({name:'products_categories'})
@Tree('closure-table')
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

    @TreeParent()
    parentProductCategory: ProductCategory

    @TreeChildren()
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