import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailsComponent } from './order-details/order-details.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsComponent
  ],
  imports: [
    OrdersRoutingModule,

    SharedModule
  ]
})
export class OrdersModule { }
