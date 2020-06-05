import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OrdersService } from '../services/orders.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @ViewChild('item') accordion;
  source: LocalDataSource = new LocalDataSource();
  perPage = 10;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
  ) {
    this.ordersService.getOrders()
      .subscribe(orders => {
        this.source.load(orders.orders);
        this.source.setPaging(1, this.perPage, true);
        // open accordion tab
        this.accordion.toggle();
      });
  }

  ngOnInit() {
  }

  settings = {
    actions: {
      columnTitle: 'Details',
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      sort: true,
      custom: [
        {
          name: 'activate',
          title: '<a>Details</a>'
        }
      ],
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      billing: {
        title: 'Customer Name',
        type: 'string',
        valuePrepareFunction: (customer) => {
          return customer.firstName + ' ' + customer.lastName;
        }
      },
      total: {
        title: 'Total',
        type: 'string',
        valuePrepareFunction: (total) => {
          return total.value;
        }
      },
      datePurchased: {
        title: 'Order date',
        type: 'string',
        valuePrepareFunction: (date) => {
          if (date) {
            return new DatePipe('en-GB').transform(date, 'dd/MM/yyyy');
          }
        }
      },
      orderStatus: {
        title: 'Status',
        type: 'string',
      },
      paymentModule: {
        title: 'Payment module',
        type: 'string',
      },
    },
  };

  route(e) {
    // this.router.navigate(['pages/orders/order-details', e.data.id]);
  }

}
