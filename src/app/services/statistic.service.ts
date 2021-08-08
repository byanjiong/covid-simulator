import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Person, PersonCondition, PersonStatus } from "../models/person.model";
import { SymbolColor } from "../models/symbol.model";
import { ConfigService } from "./config.service";
import { MessageService } from "./message.service";

export enum StatisticChange {
    Reset,
    Refresh
}

interface TimelineData {
    showAll: boolean,
    showTested: boolean,
    title: string,
    color: string,
    all: number[],
    tested: number[]
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

    chartCasesYMax = 10;

    chart1: any = {
        data: [],
        // options
        view: [800, 300],
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
            domain: ['#555555']
        }
    };
    
    chart2: any = {
        data: [],
        // options
        view: [800, 300],
        legend: true,
        showLabels: true,
        animations: true,
        xAxis: false,
        yAxis: true,
        showYAxisLabel: true,
        showXAxisLabel: true,
        // xAxisLabel: 'Time',
        yAxisLabel: 'Cases (All)',
        timeline: true,
        colorScheme: {
            domain: ['#555555']
        }
    };

    chart3: any = {
        data: [],
        // options
        view: [800, 300],
        legend: true,
        showLabels: true,
        animations: true,
        xAxis: false,
        yAxis: true,
        showYAxisLabel: true,
        showXAxisLabel: true,
        // xAxisLabel: 'Time',
        yAxisLabel: 'Cases (Tested)',
        timeline: true,
        colorScheme: {
            domain: ['#555555']
        }
    };
    
    chart4: any = {
        data: [],
        // options
        view: [800, 300],
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
            domain: ['#555555']
        }
    };
    
    chart5: any = {
        data: [],
        // options
        view: [800, 300],
        legend: true,
        showLabels: true,
        animations: true,
        xAxis: false,
        yAxis: true,
        showYAxisLabel: true,
        showXAxisLabel: true,
        // xAxisLabel: 'Time',
        yAxisLabel: 'Cases (new)',
        timeline: true,
        colorScheme: {
            domain: ['#555555']
        }
    };

    // challenge data
    challengeWin = false;
    challengeTimer = 0;
    challengeDaysPassed = 0;

    // main data [all, tested, periodic]
    statHealthy = [0, 0, 0];
    statAsymptomatic = [0, 0, 0];
    statMild = [0, 0, 0];
    statSevere = [0, 0, 0];
    statCritical = [0, 0, 0];
    statDying = [0, 0, 0];

    // current data
    currentTestTotal = 0;
    currentTestPositive = 0;
    currentQuarantineLvl3 = 0;
    currentQuarantineLvl2 = 0;
    currentQuarantineLvl1 = 0;
    currentVaccinated = 0;

    // timeline data
    public timeActive: TimelineData = { // only make this public, able to identify the length of the timeline
        title: 'Active',
        showAll: true,
        showTested: true,
        color: SymbolColor.ActiveInfection,
        all: [0],
        tested: [0]
    };
    private timeNewInfection: TimelineData = {
        title: 'Infection',
        showAll: true,
        showTested: true,
        color: SymbolColor.Infection,
        all: [0],
        tested: [0]
    };
    private timeNewRecovery: TimelineData = {
        title: 'Recovery',
        showAll: true,
        showTested: true,
        color: SymbolColor.Recovery,
        all: [0],
        tested: [0]
    };
    private timeNewTested: TimelineData = {
        title: 'New tested',
        showAll: false,
        showTested: true,
        color: SymbolColor.Testing,
        all: [0],
        tested: [0]
    };
    private timeTestPositive: TimelineData = {
        title: 'Positive rate',
        showAll: false,
        showTested: true,
        color: SymbolColor.Testing,
        all: [0],
        tested: [0]
    };
    private timeHealthy: TimelineData = {
        title: 'Healthy',
        showAll: true,
        showTested: true,
        color: SymbolColor.Healthy,
        all: [0],
        tested: [0]
    };
    private timeAsymptomatic: TimelineData = {
        title: 'Asymptomatic',
        showAll: true,
        showTested: true,
        color: SymbolColor.Asymptomatic,
        all: [0],
        tested: [0]
    };

    private timeMild: TimelineData = {
        title: 'Mild',
        showAll: true,
        showTested: true,
        color: SymbolColor.Mild,
        all: [0],
        tested: [0]
    };

    private timeSevere: TimelineData = {
        title: 'Severe',
        showAll: true,
        showTested: true,
        color: SymbolColor.Severe,
        all: [0],
        tested: [0]
    };

    private timeCritical: TimelineData = {
        title: 'Critical',
        showAll: true,
        showTested: true,
        color: SymbolColor.Critical,
        all: [0],
        tested: [0]
    };
    private timeDying: TimelineData = {
        title: 'Dying',
        showAll: true,
        showTested: true,
        color: SymbolColor.Dead,
        all: [0],
        tested: [0]
    };



    resetChallenge() {
        this.challengeWin = false;
        this.challengeTimer = 120;
        this.challengeDaysPassed = 0;
    }

    resetStat() {
        this.statHealthy = [0, 0, 0];
        this.statAsymptomatic = [0, 0, 0];
        this.statMild = [0, 0, 0];
        this.statSevere = [0, 0, 0];
        this.statCritical = [0, 0, 0];
        this.statDying = [0, 0, 0];

        this.currentQuarantineLvl3 = 0;
        this.currentQuarantineLvl2 = 0;
        this.currentQuarantineLvl1 = 0;
        this.currentVaccinated = 0;
    }

    resetAll(personList: Person[]) {
        this.resetChallenge();
        this.resetTimeline();
        this.chartCasesYMax = 10;
        this.chart1.data = [];
        this.chart2.data = [];
        this.chart3.data = [];
        this.chart4.data = [];

        this.refreshStat(personList);
        
        this.plotGraph(personList);
    }

    plotGraph(personList: Person[]) {
        this.refreshStat(personList);
        this.appendToTimeline();
        this.prepareChartData(-1);
        this.emitStatistic(StatisticChange.Refresh);
    }

    resetTimeline() {
        this.timeActive.all = [0];
        this.timeActive.tested = [0];
        this.timeNewInfection.all = [0];
        this.timeNewInfection.tested = [0];
        this.timeNewRecovery.all = [0];
        this.timeNewRecovery.tested = [0];
        this.timeNewTested.all = [0];
        this.timeNewTested.tested = [0];
        this.timeTestPositive.all = [0];
        this.timeTestPositive.tested = [0];
        this.timeHealthy.all = [0];
        this.timeHealthy.tested = [0];
        this.timeAsymptomatic.all = [0];
        this.timeAsymptomatic.tested = [0];
        this.timeMild.all = [0];
        this.timeMild.tested = [0];
        this.timeSevere.all = [0];
        this.timeSevere.tested = [0];
        this.timeCritical.all = [0];
        this.timeCritical.tested = [0];
        this.timeDying.all = [0];
        this.timeDying.tested = [0];
    }



    private appendToTimeline() {
        // core variable
        const previousActiveAll = this.timeActive.all[ this.timeActive.all.length - 1 ];
        const currentActiveAll = this.statAsymptomatic[0] + this.statMild[0] + this.statSevere[0] + this.statCritical[0] + this.statDying[0];

        const previousActiveTested = this.timeActive.tested[ this.timeActive.tested.length - 1 ];
        const currentActiveTested = this.statAsymptomatic[1] + this.statMild[1] + this.statSevere[1] + this.statCritical[1] + this.statDying[1];

        // dead calculation
        let currentDeadAll = this.timeDying.all[ this.timeDying.all.length - 1 ] - this.statDying[0];
        currentDeadAll = currentDeadAll > 0 ? currentDeadAll : 0;

        let currentDeadTested = this.timeDying.tested[ this.timeDying.tested.length - 1 ] - this.statDying[1];
        currentDeadTested = currentDeadTested > 0 ? currentDeadTested : 0;

        // recovery calculation
        let currentRecoveryAll = previousActiveAll - currentActiveAll - currentDeadAll;
        currentRecoveryAll = currentRecoveryAll > 0 ? currentRecoveryAll : 0;

        let currentRecoveryTested = previousActiveTested - currentActiveTested - currentDeadTested;
        currentRecoveryTested = currentRecoveryTested > 0 ? currentRecoveryTested : 0;

        // new infection calculation
        let newInfectionAll = currentActiveAll - previousActiveAll - currentDeadAll;
        newInfectionAll = newInfectionAll > 0 ? newInfectionAll : 0;

        let newInfectionTested = currentActiveTested - previousActiveTested - currentDeadTested;
        newInfectionTested = newInfectionTested > 0 ? newInfectionTested : 0;

        // test calculation
        const currentPopulationTested = currentActiveTested + this.statHealthy[1];

        const positiveRate = this.currentTestTotal > 0 ? Math.round(this.currentTestPositive / this.currentTestTotal * 1000)/10 : 0;

        // timeline
        this.timeActive.all.push(currentActiveAll);
        this.timeActive.tested.push(currentActiveTested);

        this.timeNewInfection.all.push(newInfectionAll);
        this.timeNewInfection.tested.push(newInfectionTested);

        this.timeNewRecovery.all.push(currentRecoveryAll);
        this.timeNewRecovery.tested.push(currentRecoveryTested);

        // this.timeNewTested.all.push(  );
        this.timeNewTested.tested.push(this.currentTestTotal);

        // this.timeTestPositive.all.push(  );
        this.timeTestPositive.tested.push(positiveRate);

        this.timeHealthy.all.push( this.statHealthy[0] );
        this.timeHealthy.tested.push( this.statHealthy[1] );

        this.timeAsymptomatic.all.push( this.statAsymptomatic[0] );
        this.timeAsymptomatic.tested.push( this.statAsymptomatic[1] );
        
        this.timeMild.all.push( this.statMild[0] );
        this.timeMild.tested.push( this.statMild[1] );

        this.timeSevere.all.push( this.statSevere[0] );
        this.timeSevere.tested.push( this.statSevere[1] );

        this.timeCritical.all.push( this.statCritical[0] );
        this.timeCritical.tested.push( this.statCritical[1] );

        this.timeDying.all.push( this.statDying[0] );
        this.timeDying.tested.push( this.statDying[1] );
    }


    prepareChartData(maxIdx: number) {
        // y-axis max
        const currentMax = this.timeActive.all[ this.timeActive.all.length - 1];
        if (currentMax > this.chartCasesYMax) {
            this.chartCasesYMax = currentMax;
        }

        // chart 1
        const multiData1: any = [];
        const color1: string[] = [];
        this.extractChartDataSeries(multiData1, color1, this.timeActive, true, true, maxIdx);
        this.extractChartDataSeries(multiData1, color1, this.timeNewTested, false, true, maxIdx);
        this.chart1.data = multiData1;
        this.chart1.colorScheme = {
            domain: color1
        };

        // chart 2
        const multiData2: any = [];
        const color2: string[] = [];
        this.extractChartDataSeries(multiData2, color2, this.timeAsymptomatic, true, false, maxIdx);
        this.extractChartDataSeries(multiData2, color2, this.timeMild, true, false, maxIdx);
        this.extractChartDataSeries(multiData2, color2, this.timeSevere, true, false, maxIdx);
        this.extractChartDataSeries(multiData2, color2, this.timeCritical, true, false, maxIdx);
        this.extractChartDataSeries(multiData2, color2, this.timeDying, true, false, maxIdx);
        this.chart2.data = multiData2;
        this.chart2.colorScheme = {
            domain: color2
        };

        // chart 3
        const multiData3: any = [];
        const color3: string[] = [];
        this.extractChartDataSeries(multiData3, color3, this.timeAsymptomatic, false, true, maxIdx);
        this.extractChartDataSeries(multiData3, color3, this.timeMild, false, true, maxIdx);
        this.extractChartDataSeries(multiData3, color3, this.timeSevere, false, true, maxIdx);
        this.extractChartDataSeries(multiData3, color3, this.timeCritical, false, true, maxIdx);
        this.extractChartDataSeries(multiData3, color3, this.timeDying, false, true, maxIdx);
        this.chart3.data = multiData3;
        this.chart3.colorScheme = {
            domain: color3
        };

        // chart 4
        const multiData4: any = [];
        const color4: string[] = [];
        this.extractChartDataSeries(multiData4, color4, this.timeTestPositive, false, true, maxIdx);
        this.chart4.data = multiData4;
        this.chart4.colorScheme = {
            domain: color4
        };
        
        // chart 5
        const multiData5: any = [];
        const color5: string[] = [];
        this.extractChartDataSeries(multiData5, color5, this.timeNewInfection, true, true, maxIdx);
        this.extractChartDataSeries(multiData5, color5, this.timeNewRecovery, true, true, maxIdx);
        this.chart5.data = multiData5;
        this.chart5.colorScheme = {
            domain: color5
        };
    }


    private extractChartDataSeries(chartData: any, color: string[], data: TimelineData, enableAll: boolean, enableTested: boolean, maxIdx: number) {
        if (data.showAll && enableAll) {
            const obj: any = {
                name: data.title,
                series: []
            };
            data.all.forEach((v, idx) => {
                if (maxIdx === -1 || idx <= maxIdx) {
                    obj.series.push({
                        name: idx.toString(),
                        value: v
                    });
                }
            });
            chartData.push(obj);
            color.push(data.color);
        }
        if (data.showTested && enableTested) {
            const obj: any = {
                name: data.title + ` (tested)`,
                series: []
            };
            data.tested.forEach((v, idx) => {
                if (maxIdx === -1 || idx <= maxIdx) {
                    obj.series.push({
                        name: idx.toString(),
                        value: v
                    });
                }
            });
            chartData.push(obj);
            const adjustedColor = (!enableAll) && enableTested ? data.color : this.LightenDarkenColor(data.color, -40);
            color.push(adjustedColor);
        }
    }


    LightenDarkenColor(color: string, amount: number) {
        let usePound = false;
      
        if (color[0] == "#") {
            color = color.slice(1);
            usePound = true;
        }
     
        let num = parseInt(color,16);
     
        let r = (num >> 16) + amount;
     
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;
     
        let b = ((num >> 8) & 0x00FF) + amount;
     
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;
     
        let g = (num & 0x0000FF) + amount;
     
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
     
        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    }


    refreshStat(personList: Person[]) {
        this.resetStat();
    
        personList.forEach(p => {
            switch (p.condition) {
                case PersonCondition.Healthy: {
                    this.statHealthy[0]++;
                    break;
                }
                case PersonCondition.Asymptomatic: {
                    this.statAsymptomatic[0]++;
                    break;
                }
                case PersonCondition.Mild: {
                    this.statMild[0]++;
                    break;
                }
                case PersonCondition.Severe: {
                    this.statSevere[0]++;
                    break;
                }
                case PersonCondition.Critical: {
                    this.statCritical[0]++;
                    break;
                }
                case PersonCondition.Dying: {
                    this.statDying[0]++;
                    break;
                }
            }
            if (p.status === PersonStatus.Known) {
                switch (p.condition) {
                    case PersonCondition.Healthy: {
                        this.statHealthy[1]++;
                        break;
                    }
                    case PersonCondition.Asymptomatic: {
                        this.statAsymptomatic[1]++;
                        break;
                    }
                    case PersonCondition.Mild: {
                        this.statMild[1]++;
                        break;
                    }
                    case PersonCondition.Severe: {
                        this.statSevere[1]++;
                        break;
                    }
                    case PersonCondition.Critical: {
                        this.statCritical[1]++;
                        break;
                    }
                    case PersonCondition.Dying: {
                        this.statDying[1]++;
                        break;
                    }
                }
            }
            if (p.lock > this.cfg._quarantineThresholdLvl3) {
                this.currentQuarantineLvl3++;
            } else if (p.lock > this.cfg._quarantineThresholdLvl2) {
                this.currentQuarantineLvl2++;
            } else if (p.lock > this.cfg._quarantineThresholdLvl1) {
                this.currentQuarantineLvl1++;
            }
            if (p.vaccinated) {
                this.currentVaccinated++;
            }
        });
    
        if (
            this.statAsymptomatic[0] === 0 &&
            this.statMild[0] === 0 &&
            this.statSevere[0] === 0 &&
            this.statCritical[0] === 0 &&
            this.statDying[0] === 0
        ) {
            if (this.challengeDaysPassed > 2) {
                if (! this.challengeWin) {
                    this.msgs.open(`Congrats, all Covid-19 cases have been cleared. 😋`);
                }
                this.challengeWin = true;
            }
            
        }
    }

}
