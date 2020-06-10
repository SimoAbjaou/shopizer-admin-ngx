import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderInvoiceComponent } from './order-invoice/order-invoice';

import { NbDialogModule } from '@nebular/theme';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsComponent,
    OrderInvoiceComponent
  ],
  entryComponents: [
    OrderInvoiceComponent
  ],
  imports: [
    OrdersRoutingModule,

    SharedModule,
    NbDialogModule.forChild(),
    MalihuScrollbarModule.forRoot(),
  ]
})
export class OrdersModule { }
