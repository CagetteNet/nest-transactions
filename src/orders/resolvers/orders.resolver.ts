import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Transactional } from '../../transactions/Transactional';
import { CreateOrderInput } from '../dtos/create-order.dto';
import { Order } from '../models/order.model';
import { OrderProductsService } from '../services/order-products.service';
import { OrdersService } from '../services/orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderProductsService: OrderProductsService,
  ) {}

  @Query(() => [Order])
  orders() {
    return this.ordersService.findAll();
  }

  @ResolveField()
  async orderProducts(@Parent() order: Order) {
    return this.orderProductsService.findByOrder(order.id);
  }

  @Transactional()
  @Mutation(() => Order, { name: 'createOrder' })
  async create(@Args('input') input: CreateOrderInput) {
    return this.ordersService.create(input.user, input.orderProducts);
  }
}
