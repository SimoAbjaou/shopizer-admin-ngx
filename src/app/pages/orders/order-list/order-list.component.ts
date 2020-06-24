import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { StoreService } from '../../store-management/services/store.service';
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
  @ViewChild('item', { static: false }) accordion;
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  stores: Array<any> = [];
  selectedStore: String = '';
  // perPage = 10;
  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;
  roles;
  searchValue: string = '';
  isSuperAdmin: boolean;
  params = this.loadParams();

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private mScrollbarService: MalihuScrollbarService,
    private translate: TranslateService,
    private storageService: StorageService,
    private storeService: StoreService,
  ) {
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.getStoreList();
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        this.stores = res;
      });
  }
  ngOnInit() {
    this.getOrderList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getOrderList();
    });
  }
  loadParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
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
          },
          filterFunction(cell: any, search?: string): boolean {
            console.log('Cell ' + JSON.stringify(cell));
            console.log('Search ' + search);
            return true;
          }
        },
        total: {
          title: this.translate.instant('ORDER.TOTAL'),
          type: 'string',
          filter: false,
          valuePrepareFunction: (total) => {
            return total.value;
          }
        },
        datePurchased: {
          title: this.translate.instant('ORDER.ORDER_DATE'),
          type: 'string',
          filter: false,
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
          filter: false,
          type: 'string',
        },
        paymentModule: {
          title: this.translate.instant('ORDER.PAYMENT_MODULE'),
          filter: false,
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
  onSelectStore(value) {
    this.params["store"] = value;
    this.getOrderList();
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
