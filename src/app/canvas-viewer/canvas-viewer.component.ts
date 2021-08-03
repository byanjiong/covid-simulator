import { ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { AnimateService } from '../services/animate.service';
import { ConfigService } from '../services/config.service';
import { ControllerAction, ControllerService } from '../services/controller.service';
import { CovidService } from '../services/covid.service';
import { DrawService } from '../services/draw.service';
import { PersonService } from '../services/person.service';
import { RegionService } from '../services/region.service';
import { SimulatorService } from '../services/simulator.service';
import { StatisticService } from '../services/statistic.service';

@Component({
    selector: 'app-canvas-viewer',
    templateUrl: './canvas-viewer.component.html',
    styleUrls: ['./canvas-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasViewerComponent implements OnInit {
    @ViewChild('myCanvas', {static: true}) myCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('myCanvasOverlay', {static: true}) myCanvasOverlay: ElementRef<HTMLCanvasElement>;
    
    ctx: any;
    ctxOverlay: any;

    running = false;

    private controllerActionSubscription: Subscription;


    constructor(
        private cfg: ConfigService,
        private rs: RegionService,
        private ps: PersonService,
        private as: AnimateService,
        private ds: DrawService,
        private cs: CovidService,
        public sts: StatisticService,
        private clrs: ControllerService,
        public sims: SimulatorService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.initViewer();
        this.sims.init(this.ctxOverlay);

        this.controllerActionSubscription = this.clrs.controllerActionChanged$.subscribe(a => {
            switch(a) {
                case ControllerAction.Start: {
                    this.sims.start();
                    break;
                }
                case ControllerAction.Stop: {
                    this.sims.stop();
                    break;
                }
                case ControllerAction.Reset: {
                    this.initViewer();
                    this.ps.listDraw(this.ctxOverlay);
                    break;
                }
                case ControllerAction.DrawGrid: {
                    this.canvasInit();
                    this.rs.init(this.ctx);
                    break;
                }
                case ControllerAction.DrawPerson: {
                    this.ps.listDraw(this.ctxOverlay);
                    // this.ps.init(this.ctxOverlay);
                    break;
                }
            }
            this.cd.markForCheck();
        });
    }

    initViewer() {
        this.canvasInit();

        this.rs.init(this.ctx);
        this.ps.init(this.ctxOverlay);
        this.sts.resetStat(this.ps.personList);
        this.clrs.emitControllerAction(ControllerAction.Ready);
    }

    ngOnDestroy() {
        if (this.controllerActionSubscription) {
            this.controllerActionSubscription.unsubscribe();
        }
        
    }


    canvasInit() {
        this.ctx = this.myCanvas.nativeElement.getContext('2d');
        this.ds.initCanvas(this.ctx);

        // overlay        
        this.ctxOverlay = this.myCanvasOverlay.nativeElement.getContext('2d');
        this.ds.initCanvas(this.ctxOverlay);
    }

}
