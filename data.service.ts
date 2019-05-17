import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SharedService } from '../../sharedServices/sharedService.service';

const url = environment.baseUrl;

@Injectable()
export class DataService {
  url: any;
  headers: any;

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  // get all locations
  getLocations(): Observable<any> {
    return this.http.get(`${url}/api/get_locations`);
  }

  // creating inventory on receive product
  receiveProduct(objSend): Observable<any> {
    return this.http.post(`${url}/api/create_inventory`, objSend);
  }

  // get product details based on product and location ids
  getProductDetails(barcode): Observable<any> {
    let params = new HttpParams();
    params = params.append('ProductID', `${barcode}`);
    params = params.append('LocationID', this.sharedService.getUserLocation());
    return this.http.get(`${url}/api/get_product_lite`, { params: params });
  }

  // move inventory on stow and pick product
  stowOrPickProduct(objSend): Observable<any> {
    return this.http.put(
      `${url}/api/move_inventory?barcode=${objSend.barcode}&source_container=${
        objSend.source_container
      }&target_container=${objSend.target_container}&quantity=${
        objSend.quantity
      }`,
      {},
      { headers: this.headers }
    );
  }

  // get inventory based on given container
  getInventory(containerId): Observable<any> {
    let params = new HttpParams();
    params = params.append('container', `${containerId}`);
    return this.http.get(`${url}/api/container_inventory`, {
      params,
      headers: this.headers
    });
  }

  // get product inventory for check inventory process
  getProduct(sendObject): Observable<any> {
    let params = new HttpParams();
    params = params.append('barcode', `${sendObject.barcode}`);
    params = params.append('location', `${sendObject.location}`);
    return this.http.get(`${url}/api/product_inventory`, {
      params,
      headers: this.headers
    });
  }

  // move inventory for bulk stow
  moveInventoryBulk(objSend): Observable<any> {
    return this.http.put(
      `${url}/api/move_inventory_bulk?source_container=${
        objSend.source_container
      }&target_container=${objSend.target_container}`,
      {}, // No body for this PUT request
      { headers: this.headers }
    );
  }

  // remove inventory
  removeInventory(objSend): Observable<any> {
    let params = new HttpParams();
    params = params.append('barcode', `${objSend.barcode}`);
    params = params.append('container', `${objSend.container}`);
    return this.http.delete(`${url}/api/delete_inventory`, {
      params,
      headers: this.headers
    });
  }

  /*
  Inventory Tasks Work
  */

  // get current user from local storate
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  // get current user location from local storate
  getUserLocation() {
    return JSON.parse(localStorage.getItem('user_location'));
  }

  // get available tasks based on task type like Inventory, Online and Pack.
  getAvailableTasks(taskType): Observable<any> {
    let location = this.getUserLocation();
    let params = new HttpParams();
    params = params.append('location', `${location}`);
    params = params.append('type', taskType);
    return this.http.get(`${url}/api/taskgroup/get_available`, {
      params,
      headers: this.headers
    });
  }

  // get inprogress tasks based on task type like Inventory, Online and Pack
  getInprogressTasks(taskType): Observable<any> {
    let location = this.getUserLocation();
    let params = new HttpParams();
    params = params.append('location', `${location}`);
    params = params.append('type', taskType);
    return this.http.get(`${url}/api/taskgroup/get_inprogress`, {
      params,
      headers: this.headers
    });
  }

  // get inprogress tasks
  getNextTask(taskGroupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('taskgroup_id', `${taskGroupId}`);
    return this.http.get(`${url}/api/task/get_next`, {
      params,
      headers: this.headers
    });
  }

  // complete task with 0 quantity.
  taskComplete(data): Observable<any> {
    const endpoint = `${url}/api/task/complete`;
    let params = new HttpParams();
    params = params.append('task_id', data.task_id);
    params = params.append('quantity', data.quantity);
    params = params.append('source_container', data.source_container);
    params = params.append('target_container', data.target_container);

    return this.http.put(endpoint, {}, { params, headers: this.headers });
  }

  skipTask(id): Observable<any> {
    const endpoint = `${url}/api/task/skip_task`;
    let body = { task_id: id };
    return this.http.put(endpoint, body);
  }

  // get online order containers information
  getOrderInfo(taskGroupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', taskGroupId);
    return this.http.get(`${url}/api/taskgroup/setup`, {
      params,
      headers: this.headers
    });
  }

  // update totes
  updateTotes(taskgroupid, data) {
    return this.http.post(`${url}/api/taskgroup/setup`, {
      id: taskgroupid,
      container: data
    });
  }

  // update task
  updateTask(data): Observable<any> {
    return this.http.put(
      `${url}/api/task/update?task_id=${data.task_id}&source_container=${
        data.source_container
      }&target_container=${data.target_container}`,
      {}, // No body for this PUT request
      { headers: this.headers }
    );
  }

  // complete Task
  completeTask(data): Observable<any> {
    return this.http.put(
      `${url}/api/task/complete?task_id=${data.task_id}&quantity=${
        data.quantity
      }&source_container=${data.source_container}&target_container=${
        data.target_container
      }`,
      {}, // No body for this PUT request
      { headers: this.headers }
    );
  }

  // get next task for pack and ship
  getNextFulfill(taskIsRestricted, taskGroupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('taskgroup_id', taskGroupId);
    params = params.append('is_restricted', taskIsRestricted);
    return this.http.get(`${url}/api/task/get_next_fulfill`, {
      params,
      headers: this.headers
    });
  }

  // fulfill task
  fulfillTask(data): Observable<any> {
    let body = {
      task_id: data.task_id,
      target_container: data.target_container,
      quantity: data.quantity
    };
    return this.http.put(`${url}/api/task/fulfill`, body);
  }

  // add missed items
  adjustInventory(body) {
    const endpoint = `${url}/api/adjust_inventory`;
    return this.http.put(endpoint, body);
  }

  // adjust shelf inventory
  adjustShelfInventory(body) {
    const endpoint = `${url}/api/adjust_shelf_inventory`;
    return this.http.put(endpoint, body);
  }

  // fulfill replenish order
  fulfillReplenishOrder(data) {
    const endpoint = `${url}/api/fulfill_replenish_order`;
    return this.http.put(endpoint, data);
  }
}
