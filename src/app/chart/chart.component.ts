import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { AnimateService } from '../services/animate.service';
import { ControllerService } from '../services/controller.service';
import { SimulatorService } from '../services/simulator.service';
import { StatisticService } from '../services/statistic.service';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {

    constructor(
        public sts: StatisticService,
        private clrs: ControllerService,
        public ans: AnimateService,
        public sims: SimulatorService,
        private cd: ChangeDetectorRef
    ) {
    }

    private statisticSubscription: Subscription;
    private controllerActionSubscription: Subscription;
    isStop = true;
    
    ngOnInit(): void {
        this.statisticSubscription = this.sts.statisticChanged$.subscribe(data => {
            this.cd.markForCheck();
        });
        this.controllerActionSubscription = this.clrs.controllerActionChanged$.subscribe(a => {
            this.cd.markForCheck();
        });
    }

    ngOnDestroy() {
        this.statisticSubscription.unsubscribe();
        this.controllerActionSubscription.unsubscribe();
    }

    onSelect(data: any): void {
        // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data: any): void {
        // console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data: any): void {
        // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    animateChartStart() {
        this.isStop = false;
        this.ans.startAnimateChart();
    }

    animateChartStop() {
        this.isStop = true;
        this.ans.stopAnimateChart();
    }
}

