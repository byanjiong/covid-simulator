import { Injectable } from "@angular/core";
import { defer, forkJoin, of, Subscription, timer } from "rxjs";
import { repeat } from "rxjs/operators";
import { Person } from "../models/person.model";
import { regionColorPicker, SymbolColor } from "../models/symbol.model";
import { AnimateService } from "./animate.service";
import { ConfigService } from "./config.service";
import { ControllerService, ControllerAction } from "./controller.service";
import { CovidService } from "./covid.service";
import { DrawService } from "./draw.service";
import { PersonService } from "./person.service";
import { RegionService } from "./region.service";
import { StatisticService } from "./statistic.service";



@Injectable({
    providedIn: 'root'
})
export class SimulatorService {
    constructor(
        private cfg: ConfigService,
        private rs: RegionService,
        private ps: PersonService,
        private as: AnimateService,
        private ds: DrawService,
        private cs: CovidService,
        private sts: StatisticService,
        private clrs: ControllerService
    ) {}

    timerSubscription: Subscription;
    simulatorStart = false;
    simCounter = 0;

    ctxOverlay: CanvasRenderingContext2D;

    init(ctx: CanvasRenderingContext2D) {
        this.ctxOverlay = ctx;
    }

    



    start() {
        // stop other unrelated animation if have
        this.as.stopAnimateChart();

        // start
        if (this.timerSubscription) {
            if (! this.timerSubscription.closed) {
                return;
            }
        }
        this.simulatorStart = true;

        // daily activity
        this.cfg._maxActivityPerDay = 2 * this.ps.personList.length;

        const source = forkJoin([
            timer(this.cfg.animationSpeed),
            // timer(1000),
            defer(() => {
                this.simulation();
                return of(0); // just return any observable
            })
        ]).pipe(
            repeat(),
        );
    
        this.timerSubscription = source.subscribe(count => {
        });
    }

    stop() {
        this.simulatorStart = false;
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    private simulation() {
        // move
        const p =  this.ps.getRandomPerson();
        this.ps.personMove(this.ctxOverlay, p);

        // new infection
        this.ps.getNextInfectedPersonIndex();
        if (this.ps.infectedPersonLoopIndex !== -1) {
            const currentInfectedPerson = this.ps.personList[this.ps.infectedPersonLoopIndex];
            const list = this.ps.getNeighbouringUninfectedPersonList(currentInfectedPerson);
            list.forEach(p => {
                if (this.cs.newInfection(currentInfectedPerson, p)) {
                    this.ps.personChangeSickness(p);
                    this.ps.personDraw(this.ctxOverlay, p);
                }
            })
        }
        this.simCounter++;
        if (this.simCounter > this.cfg._maxActivityPerDay) {
            this.simCounter = 0;
            this.sts.challengeDaysPassed++;
            this.ps.customListReset();

            // testing
            this.ps.listTestingManager(this.ctxOverlay);

            // recovery
            this.ps.listRecoveryManager(this.ctxOverlay);

            // quarantine
            this.ps.listLockManager(this.ctxOverlay);
            
            

            // statistic and charts
            this.sts.plotGraph(this.ps.personList);
            this.clrs.emitControllerAction(ControllerAction.Ready);
        }
    }
}
