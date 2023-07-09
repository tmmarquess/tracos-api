import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
  ) {}

  async create(orderDto: CreateOrderDto) {
    await this.productService.findOne(orderDto.product);
    await this.userService.findOne(orderDto.trader);

    await this.orderRepository
      .find({
        where: { trader: orderDto.trader, product: orderDto.product },
      })
      .then((order) => {
        if (order.length != 0) {
          throw new ForbiddenException("Can't order same product twice");
        }
      });

    const orders = await this.getProductOrders(orderDto.product);
    orderDto.position = orders.length + 1;

    const order = await this.orderRepository.create(orderDto);
    return await this.orderRepository.save(order);
  }

  async getProductOrders(productId: string) {
    return await this.orderRepository.find({ where: { product: productId } });
  }

  async getProductTraders(productId: string) {
    return await this.orderRepository.find({
      select: { trader: true },
      where: { product: productId },
    });
  }

  async getUserOrders(userId: string) {
    return await this.orderRepository.find({ where: { trader: userId } });
  }
}
