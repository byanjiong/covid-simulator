import { Injectable } from "@angular/core";
import { defer, forkJoin, of, Subscription, timer } from "rxjs";
import { repeat } from "rxjs/operators";
import { Person } from "../models/person.model";
import { regionColorPicker } from "../models/symbol.model";
import { ConfigService } from "./config.service";
import { PersonService } from "./person.service";
import { RegionService } from "./region.service";
import { StatisticChange, StatisticService } from "./statistic.service";



@Injectable({
    providedIn: 'root'
})
export class AnimateService {
    constructor(
        private cfg: ConfigService,
        private rs: RegionService,
        private ps: PersonService,
        private sts: StatisticService
    ) {}

    timerSubscription: Subscription;
    chartAnimationStart = false;

    startAnimateChart() {
        if (this.timerSubscription) {
            if (! this.timerSubscription.closed) {
                return;
            }
        }

        this.chartAnimationStart = true;
        let currentIdx = 0;
        const maxIdx = this.sts.timeActive.all.length - 1;

        const source = forkJoin([
            timer(this.cfg._chartAnimationDelay),
            defer(() => {
                this.animateChart(currentIdx);
                currentIdx++;
                if (currentIdx > maxIdx) {
                    this.stopAnimateChart();
                }
                return of(0);
            })
        ]).pipe(
            repeat(),
        );
    
        this.timerSubscription = source.subscribe(count => {
            if (currentIdx > maxIdx) {
                this.stopAnimateChart();
            }
        });
    }

    stopAnimateChart() {
        this.chartAnimationStart = false;
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    animateChart(currentIdx: number) {
        this.sts.prepareChartData(currentIdx);
        this.sts.emitStatistic(StatisticChange.Refresh);
    }

}
