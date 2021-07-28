import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Person, PersonCondition } from "../models/person.model";
import { SymbolColor } from "../models/symbol.model";
import { ConfigService } from "./config.service";
import { MessageService } from "./message.service";

export enum StatisticChange {
    Reset,
    Refresh
}

@Injectable({
    providedIn: 'root'
})
export class StatisticService {
    constructor(
        private cfg: ConfigService,
        private msgs: MessageService
    ) {
    }
    
    private statisticChangedSource = new Subject<StatisticChange>();
    statisticChanged$ = this.statisticChangedSource.asObservable();
    emitStatistic(done: StatisticChange) {
        this.statisticChangedSource.next(done);
    }

    chart1: any = {
        data: [],
        // options
        view: [700, 250],
        legend: true,
        showLabels: true,
        animations: true,
        xAxis: false,
        yAxis: true,
        showYAxisLabel: true,
        showXAxisLabel: true,
        // xAxisLabel: 'Time',
        yAxisLabel: 'Cases',
        timeline: true,
        colorScheme: {
            domain: [SymbolColor.ActiveInfection, SymbolColor.Infection, SymbolColor.Recovery, SymbolColor.Testing, 'Red', 'Red']
        }
    };

    chart2: any = {
        data: [],
        // options
        view: [700, 250],
        legend: true,
        showLabels: true,
        animations: true,
        xAxis: false,
        yAxis: true,
        showYAxisLabel: true,
        showXAxisLabel: true,
        // xAxisLabel: 'Time',
        yAxisLabel: 'Percentage',
        timeline: true,
        colorScheme: {
            domain: ['Orange', 'Orange']
        }
    };

    // challenge data
    challengeWin = false;
    challengeTimer = 0;
    challengeDaysPassed = 0;

    // current data
    currentInfection = 0;
    currentTest = 0;
    currentHealthy = 0;
    currentAsymptomaticInfection = 0;
    currentMildInfection = 0;
    currentSevereInfection = 0;
    currentCriticalInfection = 0;
    currentDeathInfection = 0;
    currentLockdownLvl3 = 0;
    currentLockdownLvl2 = 0;
    currentLockdownLvl1 = 0;
    currentVaccinated = 0;

    // temporarily accumulate data
    tempNewInfection = 0;
    tempNewRecovery = 0;
    tempNewTest = 0;
    tempNewTestPositive = 0;

    tempAsymptomaticInfection = 0;
    tempMildInfection = 0;
    tempSevereInfection = 0;
    tempCriticalInfection = 0;
    tempDeathInfection = 0;

    // timeline data
    private _activeInfection: number[] = [0];
    private _newInfection: number[] = [0];
    private _newRecovery: number[] = [0];
    private _newTest: number[] = [0];
    private _newTestPositive: number[] = [0];

    private _asymptomaticInfection: number[] = [0];
    private _mildInfection: number[] = [0];
    private _severeInfection: number[] = [0];
    private _criticalInfection: number[] = [0];
    private _deathInfection: number[] = [0];

    initTempStatWithCurrent() {
        this.tempNewInfection = this.currentInfection;
        this.tempNewRecovery = 0;
        this.tempNewTest = this.currentTest;
    
        this.tempAsymptomaticInfection = this.currentAsymptomaticInfection;
        this.tempMildInfection = this.currentMildInfection;
        this.tempSevereInfection = this.currentSevereInfection;
        this.tempCriticalInfection = this.currentCriticalInfection;
        this.tempDeathInfection = this.currentDeathInfection;
    }

    resetChallenge() {
        this.challengeWin = false;
        this.challengeTimer = 120;
        this.challengeDaysPassed = 0;
    }

    resetCurrent() {
        this.currentInfection = 0;
        this.currentTest = 0;
        this.currentHealthy = 0;
        this.currentAsymptomaticInfection = 0;
        this.currentMildInfection = 0;
        this.currentSevereInfection = 0;
        this.currentCriticalInfection = 0;
        this.currentDeathInfection = 0;
        this.currentLockdownLvl3 = 0;
        this.currentLockdownLvl2 = 0;
        this.currentLockdownLvl1 = 0;
        this.currentVaccinated = 0;
    }

    resetStat(personList: Person[]) {
        this.resetChallenge();
        this.clearTempStat();
        this.clearTimelineData();
        this.chart1.data = [];

        this.getCurrentPersonListStat(personList);
        this.initTempStatWithCurrent();
        
        // this.sampleTempStat();

        this.plotGraph(personList);
    }

    plotGraph(personList: Person[]) {
        this.challengeDaysPassed++;
        this.sampleTempStat();
        this.prepareChartData();
        this.getCurrentPersonListStat(personList);
        this.emitStatistic(StatisticChange.Refresh);
    }

    clearTimelineData() {
        this._activeInfection = [0];
        this._newInfection = [0];
        this._newRecovery = [0];
        this._newTest = [0];
        this._newTestPositive = [0];
    
        this._asymptomaticInfection = [0];
        this._mildInfection = [0];
        this._severeInfection = [0];
        this._criticalInfection = [0];
        this._deathInfection = [0];
    }

    clearTempStat() {
        this.tempNewInfection = 0;
        this.tempNewRecovery = 0;
        this.tempNewTest = 0;
        this.tempNewTestPositive = 0;

        this.tempAsymptomaticInfection = 0;
        this.tempMildInfection = 0;
        this.tempSevereInfection = 0;
        this.tempCriticalInfection = 0;
        this.tempDeathInfection = 0;        
    }

    updateTempInfectionStat(condition: PersonCondition) {
        switch (condition) {
            case PersonCondition.Asymptomatic: {
                this.tempAsymptomaticInfection++;
                this.tempNewInfection++;
                break;
            }
            case PersonCondition.Mild: {
                this.tempMildInfection++;
                this.tempNewInfection++;
                break;
            }
            case PersonCondition.Severe: {
                this.tempSevereInfection++;
                this.tempNewInfection++;
                break;
            }
            case PersonCondition.Critical: {
                this.tempCriticalInfection++;
                this.tempNewInfection++;
                break;
            }
            case PersonCondition.Dying: {
                this.tempDeathInfection++;
                this.tempNewInfection++;
                break;
            }
        }
    }

    private sampleTempStat() {
        const lastActive = this._activeInfection[ this._activeInfection.length - 1 ];
        const currentActive = lastActive + this.tempNewInfection - this.tempNewRecovery - this.tempDeathInfection;

        this._activeInfection.push(currentActive);
        this._newInfection.push(this.tempNewInfection);
        this._newRecovery.push(this.tempNewRecovery);
        this._newTest.push(this.tempNewTest);
        this._newTestPositive.push(this.tempNewTestPositive);
    
        this._asymptomaticInfection.push(this.tempAsymptomaticInfection);
        this._mildInfection.push(this.tempMildInfection);
        this._severeInfection.push(this.tempSevereInfection);
        this._criticalInfection.push(this.tempCriticalInfection);
        this._deathInfection.push(this.tempDeathInfection);
        
        this.clearTempStat();
    }


    private prepareChartData() {
        // chart 1
        const multiData: any = [];
        multiData.push(this.getChartDataSeries(this._activeInfection, "Active"));
        multiData.push(this.getChartDataSeries(this._newInfection, "New infection"));
        multiData.push(this.getChartDataSeries(this._newRecovery, "New Recovery"));
        multiData.push(this.getChartDataSeries(this._newTest, "New test"));

        this.chart1.data = multiData;

        // chart 2
        const multiData2: any = [];
        const positiveRate: number[] = this._newTestPositive.map((v, i) => {
            return this._newTest[i] > 0 ? Math.round(v / this._newTest[i] * 100) : 0;
        });
        multiData2.push(this.getChartDataSeries(positiveRate, "Test Positive Rate"));

        this.chart2.data = multiData2;
    }

    private getChartDataSeries(statData: number[], name: string) {
        const obj: any = {
            name,
            series: []
        };
        statData.forEach((v, idx) => {
            obj.series.push({
                name: idx.toString(),
                value: v
            });
        });
        return obj;
    }

    getCurrentPersonListStat(personList: Person[]) {
        this.resetCurrent();
        personList.forEach(p => {
            switch (p.condition) {
                case PersonCondition.Healthy: {
                    this.currentHealthy++;
                    break;
                }
                case PersonCondition.Asymptomatic: {
                    this.currentInfection++;
                    this.currentAsymptomaticInfection++;
                    break;
                }
                case PersonCondition.Mild: {
                    this.currentInfection++;
                    this.currentMildInfection++;

                    break;
                }
                case PersonCondition.Severe: {
                    this.currentInfection++;
                    this.currentSevereInfection++;

                    break;
                }
                case PersonCondition.Critical: {
                    this.currentInfection++;
                    this.currentCriticalInfection++;

                    break;
                }
                case PersonCondition.Dying: {
                    this.currentInfection++;
                    this.currentDeathInfection++;
                    break;
                }
            }
            if (p.lock > this.cfg._lockdownThresholdLvl3) {
                this.currentLockdownLvl3++;
            } else if (p.lock > this.cfg._lockdownThresholdLvl2) {
                this.currentLockdownLvl2++;
            } else if (p.lock > this.cfg._lockdownThresholdLvl1) {
                this.currentLockdownLvl1++;
            }
            if (p.vaccinated) {
                this.currentVaccinated++;
            }
        });
        if (this.currentInfection === 0) {
            if (! this.challengeWin) {
                this.msgs.open(`Congrats, all Covid-19 cases have been cleared. 😋`);
            }
            this.challengeWin = true;
        }
    }

}
