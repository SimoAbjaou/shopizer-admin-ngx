import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getOrders(): Observable<any> {
    const params = {
      'count': '25',
      'start': '0'
    };
    return this.crudService.get('/v1/admin/orders', params);
  }

}
