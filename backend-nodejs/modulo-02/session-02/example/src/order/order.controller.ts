import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	findAll() {
		return this.orderService.findAll();
	}

	@Post()
	create(@Body() body: CreateOrderDto) {
		return this.orderService.createOrder(body.userId, body.items);
	}
}
