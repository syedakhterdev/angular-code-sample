import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { sharedModule } from '../sharedModule/sharedModule.module';
import { WMSRoutingModule } from './wms.routing.module';
import { MaterialModule } from '../material.module';
import { ModalModule } from 'ngx-bootstrap';

// import components
import { WmsMenuComponent } from './menu/menu-component';
import { WmsPricePrintComponent } from './price-print/wms-price-print.component';
import { WmsReceiveComponent } from './receive/wms-receive.component';
import { WmsStowComponent } from './stow/wms-stow.component';
import { WmsBulkStowComponent } from './bulkStow/wms-bulkStow.component';
import { WmsRemoveInventoryComponent } from './removeInventory/wms-removeInventory.component';
import { WmsPickComponent } from './pick/wms-pick.component';
import { WmsStoreStowComponent } from './storeStow/wms-storeStow.component';
import { ReceiveToStow } from './receivetostow/wms-receivetostow.component';
import { InventoryTaskComponent } from './inventory-task/inventory-task.component';
import { InventoryTasksListComponent } from './inventory-tasks-list/inventory-tasks-list.component';
import { OnlineOrdersList } from './online-orders-list/online-orders-list.component';
import { OnlineOrder } from './online-order/online-order.component';
import { PackAndShipTasks } from './pack-ship-tasks-list/packAndShip-tasks-list.component';
import { PackAndShip } from './pack-ship-task/PackAndShip-task.component';
import { AddMissedItems } from './add-missed-items/add-missed-items.component';
import { InventoryCountWMS } from './inventory-count/inventory-count.component';
import { CompleteDelivery } from './complete-delivery/complete-delivery.component';

// import data service
import { DataService } from './wmsServices/data.service';

@NgModule({
  declarations: [
    WmsMenuComponent,
    WmsPricePrintComponent,
    WmsReceiveComponent,
    WmsStowComponent,
    WmsBulkStowComponent,
    WmsRemoveInventoryComponent,
    WmsPickComponent,
    WmsStoreStowComponent,
    ReceiveToStow,
    InventoryTaskComponent,
    InventoryTasksListComponent,
    OnlineOrdersList,
    OnlineOrder,
    PackAndShipTasks,
    PackAndShip,
    AddMissedItems,
    InventoryCountWMS,
    CompleteDelivery
  ],
  imports: [
    WMSRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AngularFontAwesomeModule,
    sharedModule,
    MaterialModule
  ],
  providers: [DataService]
})
export class WMSModule {}
