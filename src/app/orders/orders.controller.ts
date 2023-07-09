import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/v0/orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
}
