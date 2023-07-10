import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ default: '' })
  pictureUrl: string;

  @Column()
  donation: boolean;

  @Column({ default: false })
  traded: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
