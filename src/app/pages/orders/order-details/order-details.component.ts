import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'ngx-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  form: FormGroup;
  order: any;
  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }
  loading: boolean;

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // console.log(paramMap.get('id'));
      // this.ordersService.getOrder(+paramMap.get('id')).subscribe(order => {
      //   console.log(order);
      // });
      // temporary
      this.ordersService.getOrders()
        .subscribe(orders => {
          this.order = orders.orders[0];
        });
    });
  }

  private createForm() {
    this.form = this.fb.group({
      username: [ '', [ Validators.required ] ],
      password: [ '', Validators.required ]
    });
  }

  onSubmit() {
    console.log('save');
  }

}
