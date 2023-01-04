import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ProductCategory } from '../../warehouse/products_categories/entities/product_category.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    documentType: string;

    @Column('text', {
        unique: true
    })
    document: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
    })
    roles: string[];

    @CreateDateColumn({
        name: 'crated_at'
    })
    createdAt: Date;

    @Column({
        nullable: true,
        name: 'created_by'
    })
    createdBy?: string;

    @ManyToOne(
        () => User,
        user => user.id
    )
    @JoinColumn({
        name: 'created_by',
    })
    cratedById? : User
    
    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: string;

    @Column({
        nullable: true,
        name: 'updated_by'
    })
    updatedBy?: string;

    @ManyToOne(
        () => User,
        user => user.id,
    )
    @JoinColumn({
        name: 'updated_by',
    })
    updatedById? : User

    @OneToMany(
        () => ProductCategory,
        (productsCategories) => productsCategories.user
    )
    productsCategories: ProductCategory

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }
}