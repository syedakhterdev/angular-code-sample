import { Routes, RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';

// imports components
import { WmsMenuComponent } from './menu/menu-component';
import { WmsReceiveComponent } from './receive/wms-receive.component';
import { WmsPricePrintComponent } from './price-print/wms-price-print.component';
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

// import authorization guard
import { AuthorizationGuard } from '../sharedServices/authorization.guard';

const secondaryRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    data: {
      expectedRoles: ['^admin$', '^w_']
    },
    children: [
      {
        path: '',
        component: WmsMenuComponent
      },
      {
        path: 'receive',
        component: WmsReceiveComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_receive$']
        }
      },
      {
        path: 'receivetostow',
        component: ReceiveToStow,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_receive$']
        }
      },
      {
        path: 'stow',
        component: WmsStowComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_stow$']
        }
      },
      {
        path: 'pick',
        component: WmsPickComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_pick$']
        }
      },
      {
        path: 'online-orders',
        component: OnlineOrdersList,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_onlineorders$']
        }
      },
      {
        path: 'pack-and-ship-tasks',
        component: PackAndShipTasks,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_pack$']
        }
      },
      {
        path: 'bulkstow',
        component: WmsBulkStowComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_bulkstow$']
        }
      },
      {
        path: 'complete-delivery',
        component: CompleteDelivery,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^s_manager']
        }
      },
      {
        path: 'inventorycount',
        component: InventoryCountWMS,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_inventorycount$']
        }
      },
      {
        path: 'add-missed-items',
        component: AddMissedItems,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_inventorycount$']
        }
      },
      {
        path: 'removeInventory',
        component: WmsRemoveInventoryComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_removeinventory$']
        }
      },
      {
        path: 'price-print',
        component: WmsPricePrintComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_manager$', '^w_receive$']
        }
      },
      {
        path: 'inventory-tasks-list',
        component: InventoryTasksListComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_']
        }
      },
      {
        path: 'inventory-task/:id/:targetLocation',
        component: InventoryTaskComponent,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_']
        }
      },
      {
        path: 'pack-and-ship/:isRestricted/:id',
        component: PackAndShip,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_']
        }
      },
      {
        path: 'online-order/:id',
        component: OnlineOrder,
        canActivate: [AuthorizationGuard],
        data: {
          expectedRoles: ['^admin$', '^w_']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(secondaryRoutes)],
  exports: [RouterModule],
  providers: []
})
export class WMSRoutingModule {}
