import { Column, Entity } from 'typeorm';

@Entity({ name: 'orders' })
export class OrdersEntity {
  @Column({ primary: true })
  product: string;

  @Column({ primary: true })
  trader: string;

  @Column()
  position: number;

  @Column({ default: false })
  traded: boolean;
}
