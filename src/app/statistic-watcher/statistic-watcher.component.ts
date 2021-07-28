import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SymbolColor } from '../models/symbol.model';
import { ControllerAction, ControllerService } from '../services/controller.service';
import { PersonService } from '../services/person.service';
import { RegionService } from '../services/region.service';
import { StatisticService } from '../services/statistic.service';

@Component({
    selector: 'app-statistic-watcher',
    templateUrl: './statistic-watcher.component.html',
    styleUrls: ['./statistic-watcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticWatcherComponent implements OnInit {

    constructor(
        public rs: RegionService,
        public ps: PersonService,
        public sts: StatisticService,
        private clrs: ControllerService,
        private cd: ChangeDetectorRef
    ) { }

    colorGeneral = SymbolColor.BaseGrid;
    colorHealthy = SymbolColor.Healthy;
    colorAsymptomatic = SymbolColor.Asymptomatic;
    colorMild = SymbolColor.Mild;
    colorSevere = SymbolColor.Severe;
    colorCritical = SymbolColor.Critical;
    colorDeath = SymbolColor.Dead;

    private controllerActionSubscription: Subscription;

    ngOnInit(): void {
        this.controllerActionSubscription = this.clrs.controllerActionChanged$.subscribe(a => {
            switch(a) {
                case ControllerAction.Stop: 
                case ControllerAction.Ready: {
                    this.sts.getCurrentPersonListStat(this.ps.personList);
                    this.cd.markForCheck();
                    break;
                }
            }
        });

    }

    ngOnDestroy() {
        this.controllerActionSubscription.unsubscribe();
    }

    refresh() {
        this.sts.getCurrentPersonListStat(this.ps.personList);
    }

    debug() {
    }


}
