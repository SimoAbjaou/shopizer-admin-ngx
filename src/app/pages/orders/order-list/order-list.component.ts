import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OrdersService } from '../services/orders.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'ngx-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @ViewChild('item') accordion;
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  // perPage = 10;
  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;
  roles;
  searchValue: string = '';

  params = this.loadParams();

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private mScrollbarService: MalihuScrollbarService,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
    this.getOrderList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.ordersService.getLanguage();
      this.getOrderList();
    });


  }
  loadParams() {
    return {
      store: 'DEFAULT',
      lang: this.ordersService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }
  getOrderList() {
    this.params.page = this.currentPage;

    let data = [];
    this.loadingList = true;
    this.ordersService.getOrders(this.params)
      .subscribe(orders => {
        // console.log(orders)
        this.loadingList = false;
        data = orders.orders
        if (orders.orders && orders.orders.length !== 0) {
          this.source.load(orders.orders);
        } else {
          this.source.load([]);
        }

        this.totalCount = orders.recordsTotal;
      });
    this.setSettings();
  }

  setSettings() {
    this.settings = {
      // mode: 'external',
      // hideSubHeader: false,
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        custom: [
          {
            name: 'view',
            title: '<i class="nb-edit"></i>'
          }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',

        },
        billing: {
          title: this.translate.instant('ORDER.CUSTOMER_NAME'),
          type: 'string',
          valuePrepareFunction: (customer) => {
            return customer.firstName + ' ' + customer.lastName;
          }
        },
        total: {
          title: this.translate.instant('ORDER.TOTAL'),
          type: 'string',
          valuePrepareFunction: (total) => {
            return total.value;
          }
        },
        datePurchased: {
          title: this.translate.instant('ORDER.ORDER_DATE'),
          type: 'string',
          valuePrepareFunction: (date) => {
            if (date) {
              return new DatePipe('en-GB').transform(date, 'dd/MM/yyyy');
            }
          }
        },
        orderStatus: {
          title: this.translate.instant('ORDER.STATUS'),
          type: 'string',
        },
        shippingModule: {
          title: this.translate.instant('ORDER.SHIPPING_MODULE'),
          type: 'string',
        },
        paymentModule: {
          title: this.translate.instant('ORDER.PAYMENT_MODULE'),
          type: 'string',
        },
      },
    };
  }

  // paginator
  changePage(event) {
    switch (event.action) {
      case 'onPage': {
        this.currentPage = event.data;
        break;
      }
      case 'onPrev': {
        this.currentPage--;
        break;
      }
      case 'onNext': {
        this.currentPage++;
        break;
      }
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
      case 'onLast': {
        this.currentPage = event.data;
        break;
      }
    }
    this.getOrderList()
  }
  onSearch(query: string = '') {

    if (query.length == 0) {
      this.searchValue = null;
      return;
    }

    this.params["name"] = query;
    this.getOrderList();
    this.searchValue = query;

  }
  resetSearch() {
    this.searchValue = null;
    this.params = this.loadParams();
    this.getOrderList();
  }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
  route(e) {
    localStorage.setItem('orderID', e.data.id);
    this.router.navigate(['pages/orders/order-details']);
  }

}
