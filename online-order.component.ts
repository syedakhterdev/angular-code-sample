import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ScannerSound } from '../../sharedServices/sound';
import { DataService } from '../wmsServices/data.service';
import { Logs } from 'selenium-webdriver';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'online-order',
  templateUrl: './online-order.component.html',
  styleUrls: ['./online-order.component.css']
})
export class OnlineOrder {
  routeParams = this.activeRoute.snapshot.params;
  taskGroupId: any;
  errorMessage: any;
  productDetails: any;
  totalContainers: number;
  remainingContainers: number;
  task: any;
  orderInfo: any;
  orderQuantity: any;
  scanedContainers = [];
  input_container: any;
  source_shelf: any;
  tote_container: any;
  pickQuantity: number;
  barcode: any;
  readonlyContainer: boolean = false;
  readonlySourceShelf: boolean = false;
  readonlyTote: boolean = false;
  hideContainer: boolean = false;
  hideSourceShelf: boolean = true;
  hideTote: boolean = true;
  hideBarcode: boolean = true;
  hideForm: boolean = false;
  beep = new ScannerSound();
  logs = [];

  // define regex
  locationRegex = /-STR|-WRH/;
  containerRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\-)\S+$/;
  productRegex = /^[0-9]*$/;

  @ViewChild('containerReff')
  containerReff: ElementRef;
  @ViewChild('sourceshelfReff')
  sourceshelfReff: ElementRef;
  @ViewChild('toteReff')
  toteReff: ElementRef;
  @ViewChild('barcodeReff')
  barcodeReff: ElementRef;

  constructor(
    private service: DataService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.taskGroupId = this.routeParams.id;
    this.getOrderInfo(this.taskGroupId);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.containerReff.nativeElement.focus();
    }, 10);
  }

  // scan the required number of containers
  scanContainers() {
    if (this.remainingContainers > 0) {
      this.updateTotes(this.input_container);
      setTimeout(() => {
        this.containerReff.nativeElement.focus();
      }, 10);
    } else {
      this.logs.unshift({
        type: 'error',
        message:
          'You can not enter more containers than required. This one will not include.'
      });
    }
    this.input_container = '';
  }

  // update totes
  updateTotes(data) {
    this.service.updateTotes(this.taskGroupId, data).subscribe(
      res => {
        this.remainingContainers--;
        let response: any = res;
        this.beep.success();
        this.logs.unshift({
          type: 'success',
          message: response.message
        });

        if (this.remainingContainers == 0) {
          this.getNextTask(this.taskGroupId);
          this.hideContainer = true;
          this.hideSourceShelf = false;
          setTimeout(() => {
            this.sourceshelfReff.nativeElement.focus();
          }, 10);
        }
      },
      err => {
        this.beep.failure();
        this.logs.unshift({
          type: 'error',
          message: err.error.message
        });
      }
    );
  }

  // scan the shelf (the sourch container)
  scanShelfContainer() {
    if (this.source_shelf == this.task.SourceContainer) {
      this.readonlySourceShelf = true;
      this.hideTote = false;
      this.beep.success();
      setTimeout(() => {
        this.toteReff.nativeElement.focus();
      }, 10);
    } else {
      this.beep.failure();
      this.logs.unshift({
        type: 'error',
        message: 'Wrong shelf is scanned!'
      });
    }
  }

  // scan the tote (the target container)
  scanToteContainer() {
    if (this.tote_container == this.task.TargetContainer) {
      this.readonlyTote = true;
      this.hideBarcode = false;
      this.beep.success();
      // get products details
      this.service.getProductDetails(this.task.ProductID).subscribe(res => {
        if (res.status == 'OK') this.productDetails = res.data[0];
      });
      setTimeout(() => {
        this.barcodeReff.nativeElement.focus();
      }, 10);
    } else {
      this.beep.failure();
      this.logs.unshift({
        type: 'error',
        message: 'Wrong tote is scanned!'
      });
    }
  }

  // scan the item and update task
  scanItemAndUpdateTask() {
    if (
      this.productRegex.test(this.barcode) &&
      this.barcode == this.task.ProductID
    ) {
      this.service
        .updateTask({
          task_id: this.task.ID,
          source_container: this.source_shelf,
          target_container: this.tote_container
        })
        .subscribe(
          res => {
            this.beep.success();
            this.logs.unshift({
              type: 'success',
              message: res.message
            });
            if (res.status == 'updated') {
              this.pickQuantity -= 1;
              setTimeout(() => {
                this.barcodeReff.nativeElement.focus();
              }, 10);
            } else if (res.status == 'completed') {
              // get next task
              this.getNextTask(this.taskGroupId);
              this.productDetails = '';
            }
          },
          err => {
            this.beep.failure();
            if (err.status == 400) {
              this.logs.unshift({
                type: 'error',
                message: err.error.message
              });
            } else {
              err.statusText == 'Unknown Error'
                ? (this.errorMessage =
                    'System error. Please try again or contact your administrator.')
                : (this.errorMessage = err.error.message);
              this.logs.unshift({
                type: 'error',
                message: this.errorMessage
              });
            }
          }
        );
    } else {
      this.beep.failure();
      this.barcode = '';
      this.logs.unshift({
        type: 'error',
        message: `Wrong item scaned!`
      });
    }
    this.barcode = '';
  }

  // get the order informations
  getOrderInfo(taskGroupId) {
    this.orderInfo = '';
    this.hideContainer = true;
    this.service.getOrderInfo(taskGroupId).subscribe(
      res => {
        let response: any = res;
        this.orderInfo = response.data;
        this.totalContainers = this.remainingContainers = this.orderInfo.containerCount;
        this.hideContainer = false;
      },
      err => {
        if (err.status == 404) {
          // If setup returns 404, that means setup is done. Nothing goes to the log.
          // and picking start.
          this.getNextTask(this.taskGroupId);
          this.hideContainer = true;
          this.hideSourceShelf = false;
        } else {
          this.logs.unshift({
            type: 'error',
            message: err.error.message
          });
        }
      }
    );
  }

  // get the next task
  getNextTask(taskGroupId) {
    this.tote_container = '';
    this.barcode = '';
    this.task = '';
    this.productDetails = '';
    this.readonlyTote = false;
    this.hideBarcode = true;
    this.pickQuantity = 0;

    this.service.getNextTask(taskGroupId).subscribe(
      res => {
        this.hideForm = false;
        this.task = res.data[0];
        // this is the demanded quantity in task
        this.pickQuantity = this.task.Quantity - this.task.QuantityFilled;

        if (this.source_shelf == this.task.SourceContainer) {
          setTimeout(() => {
            this.toteReff.nativeElement.focus();
          }, 10);
        } else {
          setTimeout(() => {
            this.sourceshelfReff.nativeElement.focus();
          }, 10);
          this.hideTote = true;
          this.source_shelf = '';
          this.readonlySourceShelf = false;
        }
      },
      err => {
        this.logs.unshift({
          type: 'error',
          message: err.error.message
        });
        if (err.status == 404) {
          this.logs.unshift({
            type: 'success',
            message:
              'The task is complete, please take the totes to the Packing Station.'
          });
          this.hideForm = true;
        }
      }
    );
  }

  // when no more items is clicked complete the task
  noMoreItems() {
    this.completeTask();
  }

  // complete task
  completeTask() {
    this.service
      .completeTask({
        task_id: this.task.ID,
        quantity: 0,
        source_container: this.source_shelf,
        target_container: this.tote_container
      })
      .subscribe(
        res => {
          this.getNextTask(this.taskGroupId);
          this.beep.success();
          this.logs.unshift({
            type: 'success',
            message: res.message
          });
          this.productDetails = '';
        },
        err => {
          this.beep.failure();
          this.getNextTask(this.taskGroupId);
          err.status >= 500
            ? (this.errorMessage =
                'System error. Please try again or contact your administrator.')
            : (this.errorMessage = err.error.message);
          this.logs.unshift({
            type: 'error',
            message: this.errorMessage
          });
        }
      );
  }
}
