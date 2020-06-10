import { Component, OnInit } from '@angular/core';
// import { CrudService } from '../../shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { OrdersService } from '../services/orders.service';
import * as moment from 'moment';
import { OrderInvoiceComponent } from '../order-invoice/order-invoice';
// import { PasswordPromptComponent } from '../../shared/components/password-prompt/password-prompt';
import { Router } from '@angular/router';
import { parsePhoneNumberFromString, format, AsYouType } from 'libphonenumber-js';

@Component({
  selector: 'ngx-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  shippingCountry: Array<any> = []
  shippingStateData: Array<any> = []
  billingStateData: Array<any> = []
  billingCountry: Array<any> = []
  groups: Array<any> = []
  selectedGroups: Array<any> = []
  loadingList = false;
  orderDetailsData: any;
  historyListData: Array<any> = [];
  statusList: Array<any> = [{ 'name': 'ORDERED', 'id': 'ORDERED' }, { 'name': 'PROCESSED', 'id': 'PROCESSED' }, { 'name': 'DELIVERED', 'id': 'DELIVERED' }, { 'name': 'REFUNDED', 'id': 'REFUNDED' }, { 'name': 'CANCELED', 'id': 'CANCELED' }]
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  info = {
    userName: '',
    language: '',
    emailAddress: '',
    datePurchased: ''
  }
  statusFields = {
    comments: '',
    status: ''
  }
  shipping = {
    phone: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    zone: '',
    country: '',
    postalCode: '',

  }
  billing = {
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    zone: '',
    country: '',
    postalCode: '',
    phone: ''
  }
  orderID: any;
  defaultCountry: any;
  title: any = ''
  buttonText: any = 'Update Order'
  languages: Array<any> = [{ 'code': 'en', 'name': 'English' }, { 'code': 'fr', 'name': 'French' }]
  constructor(private ordersService: OrdersService, private toastr: ToastrService,
    private dialogService: NbDialogService, private router: Router) {
    // console.log(this.router.getCurrentNavigation());
    this.getCountry();


  }
  getOrderDetails() {
    this.loadingList = true;
    this.ordersService.getOrderDetails(this.orderID)
      .subscribe(data => {
        this.loadingList = false;
        console.log(data);
        this.orderDetailsData = data;
        this.onBillingChange(data.billing.country)


        this.info.emailAddress = data.customer.emailAddress;
        this.info.datePurchased = data.datePurchased;
        // this.info.language = data.language;
        // this.info.userName = data.userName;
        this.billing = data.billing;
        if (data.delivery) {
          this.onShippingChange(data.delivery.country)
          this.shipping = data.delivery;
        }

      }, error => {
        this.loadingList = false;
      });
  }
  ngOnInit() {
    if (localStorage.getItem('orderID')) {
      this.orderID = localStorage.getItem('orderID')
      this.getOrderDetails();
      this.title = "Order ID " + this.orderID
    }
    this.getHistory();
  }
  getHistory() {
    this.ordersService.getHistory(this.orderID)
      .subscribe(data => {
        console.log(data);
        this.historyListData = data;
      }, error => {

      });
  }
  getCountry() {
    this.ordersService.getCountry()
      .subscribe(data => {
        this.shippingCountry = data;
        this.billingCountry = data;
      }, error => {

      });
  }
  onBillingChange(value) {
    this.ordersService.getBillingZone(value)
      .subscribe(data => {
        this.billingStateData = data;
      }, error => {

      });
  }
  onShippingChange(value) {
    this.ordersService.getShippingZone(value)
      .subscribe(data => {
        this.shippingStateData = data;
      }, error => {

      });
  }
  updateHistory() {
    let param = {
      comments: this.statusFields.comments,
      date: moment().format('YYYY-DD-MMMM HH:MM:SS.ss'),
      status: this.statusFields.status
    }
    this.ordersService.addHistory(this.orderID, param)
      .subscribe(data => {
        this.toastr.success("History Status has been updated successfully");
        // this.shippingStateData = data;
      }, error => {
        this.toastr.success("History Status has been updated fail");

      });
  }
  updateOrder() {
    let param = {
      "emailAddress": this.info.emailAddress,
      "billing": {
        "postalCode": this.billing.postalCode,
        "firstName": this.billing.firstName,
        "lastName": this.billing.lastName,
        "company": "",
        "phone": this.billing.phone,
        "address": this.billing.address,
        "city": this.billing.city,
        "billingAddress": false,
        "zone": this.billing.zone,
        "country": this.billing.country
      },
      "delivery": {
        "postalCode": this.shipping.postalCode,
        "firstName": this.shipping.firstName,
        "lastName": this.shipping.lastName,
        "company": "",
        "phone": this.shipping.phone,
        "address": this.shipping.address,
        "city": this.shipping.city,
        "billingAddress": false,
        "zone": this.shipping.zone,
        "country": this.shipping.country
      }
    }
    this.ordersService.updateOrder(this.orderID, param)
      .subscribe(data => {
        this.toastr.success("Order has been updated successfully");
        // this.shippingStateData = data;
      }, error => {
        this.toastr.success("Order has been updated fail");
      });
  }
  onPhoneChange() {
    this.billing.phone = new AsYouType('US').input(this.billing.phone);
  }
  onShippingPhoneChange() {
    this.shipping.phone = new AsYouType('US').input(this.shipping.phone);
  }

  showDialog(value) {
    // console.log(value)
    if (value == 1) {

    } else {
      this.dialogService.open(OrderInvoiceComponent)
        .onClose.subscribe(res => {

        });
    }
  }
}
