import { Injectable } from "@angular/core";
import { randomNumber, valueWithin } from "../helper/functions";
import { Person, PersonCondition, PersonStatus } from "../models/person.model";
import { regionColorPicker, SymbolColor } from "../models/symbol.model";
import { ConfigService } from "./config.service";
import { CovidService } from "./covid.service";
import { DrawService } from "./draw.service";
import { RegionService } from "./region.service";
import { StatisticChange, StatisticService } from "./statistic.service";



@Injectable({
    providedIn: 'root'
})
export class PersonService {
    constructor(
        private cfg: ConfigService,
        private rs: RegionService,
        private cs: CovidService,
        private ds: DrawService,
        private sts: StatisticService
    ) {
        this.sts.statisticChanged$.subscribe(type => {
            if (type === StatisticChange.Reset) {
                this.sts.resetStat(this.personList);
            }
        });
    }



    personList: Person[] = [];
    customList: Person[] = [];
    population: (Person|null)[][] = [];

    infectedPersonLoopIndex = 0; // if -1, then no infected person

    init(ctx: CanvasRenderingContext2D) {
        this.personList = [];
        this.population = new Array(this.cfg.row).fill(null).map(() => new Array(this.cfg.column).fill(null));

        this.listCreate();
        this.listCreateVaccinated();
        this.listDraw(ctx);
    }

    customListReset() {
        this.customList = [];
    }
    customListAdd(person: Person) {
        const idx = this.customList.findIndex(p => p === person);
        if (idx === -1) {
            this.customList.push(person);
        }
    }
    customListDraw(ctx: CanvasRenderingContext2D) {
        this.customList.forEach( p => this.personDraw(ctx, p));
    }

    personCreate(): Person {
        const p: Person = {
            status: PersonStatus.Unknown,
            condition: PersonCondition.Healthy,
            vaccinated: false,
            x: 0,
            y: 0,
            counter: 0,
            lock: 0,
            history: 0,
            tested: 0,
            isMe: false
        };
        return p;
    }

//++
    personMove(ctx: CanvasRenderingContext2D, person: Person) {
        // return if not willing to move
        const rand = Math.random();
        if (person.lock > rand) {
            return;
        }

        // get move direction
        const currentX = person.x;
        const currentY = person.y;

        const [targetX, targetY] = this.getMoveDirection(currentX, currentY);
        if (currentX === targetX && currentY === targetY) {
            return;
        }

        // all ok, then start move
        person.x = targetX;
        person.y = targetY;

        this.population[currentY][currentX] = null;
        this.population[targetY][targetX] = person;

        this.ds.clearRegion(ctx, currentX, currentY);

        this.personDraw(ctx, person); 
    }

    personDraw(ctx: CanvasRenderingContext2D, person: Person) {
        let color: string = SymbolColor.Error;
        
        // fill symbol
        if (this.cfg.displayAll || person.status === PersonStatus.Known) {
            switch (person.condition) {
                case PersonCondition.Healthy: {
                    color = SymbolColor.Healthy;
                    break;
                }
                case PersonCondition.Asymptomatic: {
                    color = SymbolColor.Asymptomatic;
                    break;
                }
                case PersonCondition.Mild: {
                    color = SymbolColor.Mild;
                    break;
                }
                case PersonCondition.Severe: {
                    color = SymbolColor.Severe;
                    break;
                }
                case PersonCondition.Critical: {
                    color = SymbolColor.Critical;
                    break;
                }
                case PersonCondition.Dying: {
                    color = SymbolColor.Dead;
                    break;
                }
            }
        } else {
            color = SymbolColor.Unknown;
        }
        const offset = this.cfg.padding;
        const w = this.cfg.symbolSize - 2 * offset;
        const h = this.cfg.symbolSize - 2 * offset;
        ctx.fillStyle = color;
        ctx.fillRect(person.x * this.cfg.symbolSize + offset, person.y * this.cfg.symbolSize + offset, w, h);

        // stroke symbol
        ctx.lineWidth = this.cfg.padding;
        if (this.cfg.displayLock) {
            let alpha = 0;
            if (person.lock > this.cfg._quarantineThresholdLvl3) {
                alpha = 1;
            } else if (person.lock > this.cfg._quarantineThresholdLvl2) {
                alpha = 0.6
            } else if (person.lock > this.cfg._quarantineThresholdLvl1) {
                alpha = 0.3;
            }
            if (alpha > 0) {
                ctx.globalAlpha = alpha;
                ctx.drawImage(this.ds.ctxSymbol1.canvas, person.x * this.cfg.symbolSize, person.y * this.cfg.symbolSize);
                ctx.globalAlpha = 1;
            }
        }
        if (this.cfg.displayVaccinated && person.vaccinated) {
            ctx.drawImage(this.ds.ctxSymbol2.canvas, person.x * this.cfg.symbolSize, person.y * this.cfg.symbolSize);
        }
        if (person.tested) {
            ctx.drawImage(this.ds.ctxSymbol3.canvas, person.x * this.cfg.symbolSize, person.y * this.cfg.symbolSize);
        }
        if (person.isMe) {
            ctx.drawImage(this.ds.ctxSymbol4.canvas, person.x * this.cfg.symbolSize, person.y * this.cfg.symbolSize);
        }
    }
//++
    getRandomPerson() {
        const person = this.personList[Math.floor(Math.random()*this.personList.length)];
        return person;
    }
//++
    getNextInfectedPersonIndex() {
        if (! this.personList.length) {
            this.infectedPersonLoopIndex = -1;
            return;
        } else  if (this.infectedPersonLoopIndex >= this.personList.length) {
            // if already pointed to last person, then search from the beginning
            const idx = this.personList.findIndex(p => {
                return p.condition !== PersonCondition.Healthy;
            });
            this.infectedPersonLoopIndex = idx;
            return;
        } else {
            // continue to search next infected person, starting from current index
            for (let i = this.infectedPersonLoopIndex + 1; i < this.personList.length; i++) {
                if (this.personList[i].condition !== PersonCondition.Healthy) {
                    this.infectedPersonLoopIndex = i;
                    return;
                }
            }
            // not found? then search from the beginning until the current index
            for (let i = 0; i < this.infectedPersonLoopIndex; i++) {
                if (this.personList[i].condition !== PersonCondition.Healthy) {
                    this.infectedPersonLoopIndex = i;
                    return;
                }
            }
            // else, also not found?
            this.infectedPersonLoopIndex = -1;
            return;
        }
    }
//++
    personChangeSickness(person: Person) {
        const condition = this.cs.getDiseaseCondition();
        const counter = this.cs.getInfectionCounter(condition);
        person.condition = condition;
        person.counter = counter;
    
        // if previously tested, then make it invalid
        if (person.tested > 1) {
            person.status = PersonStatus.Unknown;
            person.tested = 0;
        }

        // this.personChangeLock(person);
        this.sts.updateTempInfectionStat(condition);
    }
//++
    personChangeRecovery(person: Person) {
        person.condition = PersonCondition.Healthy;
        person.history = person.history++;

        this.personChangeLock(person);

        this.sts.tempNewRecovery++;
    }
//++
    personIsWillingToSeekTest(person: Person) {
        // if (person.tested) {
        //     return false;
        // }

        // general testing willingness
        const rand1 = Math.random();
        if (this.cfg.testingRate > rand1) {
            return true;
        }

        // additional willingness if feel sick for few days
        if (!(person.condition === PersonCondition.Healthy || person.condition === PersonCondition.Asymptomatic)) {
            let defaultSickDayLength: number;
            switch (person.condition) {
                // case PersonCondition.Asymptomatic: {
                //     defaultSickDayLength = this.cfg._AsymptomaticSickDays;
                //     break;
                // }
                case PersonCondition.Mild: {
                    defaultSickDayLength = this.cfg._MildSickDays;
                    break;
                }
                case PersonCondition.Severe: {
                    defaultSickDayLength = this.cfg._SevereSickDays;
                    break;
                }
                case PersonCondition.Critical: {
                    defaultSickDayLength = this.cfg._CriticalSickDays;
                    break;
                }
                case PersonCondition.Dying: {
                    defaultSickDayLength = this.cfg._DyingSickDays;
                    break;
                }
            }
            const rand2 = Math.random();
            if (person.counter < defaultSickDayLength - this.cfg._unknownSickSeekTestingDayDelay) {   
                if (this.cfg._unknownSickSeekTestingWillingness > rand2) {
                    return true;
                }
            }
        }

        return false;
    }
//++
    personChangeTested(person: Person) {
        person.status = PersonStatus.Known;
        if (person.condition === PersonCondition.Healthy) {
            person.tested = this.cfg._testingValidForDay;
        } else {
            person.tested = person.counter;
            this.personChangeLock(person);
            this.sts.tempNewTestPositive++;
        }
        this.sts.tempNewTest++;
    }



//++
    personChangeLock(person: Person) {
        let lock1 = 0;
        let lock2 = 0;
        let lock3 = 0;
        const minOffset = Math.min(0.1, 1 - this.cfg.quarantineStrictness);
        
        // known and not healthy, will try to stay at home, trying not to infect other people
        if (person.status === PersonStatus.Known) {
            switch (person.condition) {
                case PersonCondition.Asymptomatic: {
                    const min = Math.max(this.cfg.quarantineStrictness - minOffset, 0.9);
                    lock1 = randomNumber(min, 1);
                    break;
                }
                case PersonCondition.Mild: {
                    const min = Math.max(this.cfg.quarantineStrictness - minOffset, 0.92);
                    lock1 = randomNumber(min, 1);
                    break;
                }
                case PersonCondition.Severe: {
                    const min = Math.max(this.cfg.quarantineStrictness - minOffset, 0.97);
                    lock1 = randomNumber(min, 1);
                    break;
                }
            }
        } 
        if (person.history) {
            // past covid survivor
            const min = Math.max(0.5, this.cfg.quarantineStrictness - minOffset);
            const max = this.cfg.quarantineStrictness;
            const lock = randomNumber(min, max);
            lock2 = lock;
        } 
        // general population
        let offset: number;
        const rand1 = Math.random();
        if (rand1 < 0.95) {
            // 95% of the people will comply with the global quarantine level
            offset = minOffset;
        } else {
            // 5% of the people will have more flexible level, e.g. essential workers or stubborn people
            offset = 2 * minOffset;
        }
        let lock = randomNumber(this.cfg.quarantineStrictness - offset, this.cfg.quarantineStrictness + offset);
        lock = valueWithin(lock, 0, 1);

        lock3 = lock;
        person.lock = Math.max(lock1, lock2, lock3);
    }

    personRemoveDead(ctx: CanvasRenderingContext2D, person: Person) {
        const idx = this.personList.indexOf(person);
        if (idx > -1) {
            this.personList.splice(idx, 1);
        }
        const x = person.x;
        const y = person.y;
        this.population[y][x] = null;

        this.ds.clearRegion(ctx, x, y);
    }

    



    getNeighbouringUninfectedPersonList(person: Person) {
        const uninfectedPersonList: Person[] = [];
        const x = person.x;
        const y = person.y;
        const allDirections = [ [x + 1, y - 1], [x, y - 1], [x - 1, y - 1],
                                [x + 1, y], [x - 1, y],
                                [x + 1, y + 1], [x, y + 1], [x - 1, y + 1] ];
        allDirections.forEach( direction => {
            
            if (
                this.rs.coordinateValid(direction[0], direction[1]) && 
                this.population[ direction[1] ] [ direction[0] ] !== null &&
                this.rs.region[y][x] === this.rs.region[ direction[1] ] [ direction[0] ]
            ) {
                const tempNeighbour = this.population[ direction[1] ] [ direction[0] ];
                if ((tempNeighbour as Person).condition === PersonCondition.Healthy) {
                    uninfectedPersonList.push(tempNeighbour as Person);
                }
            }
        });

        return uninfectedPersonList;
    }

    private populationIsEmpty(x: number, y: number) {
        // x, y must be a valid coordinate before exec this function
        if (this.population[y][x] === null) {
            return true;
        }
        return false;
    }

//++
    private getMoveDirection(x: number, y: number): number[] {
        // get a list of empty space to move
        const validDirection: number[][] = [ [x, y] ]; // stay at the same location is always a valid move

        const allDirections = [ [x + 1, y - 1], [x, y - 1], [x - 1, y - 1],
                                [x + 1, y], [x - 1, y],
                                [x + 1, y + 1], [x, y + 1], [x - 1, y + 1] ];
        allDirections.forEach( direction => {
            if (
                this.rs.coordinateValid(direction[0], direction[1]) && 
                this.population[ direction[1] ] [ direction[0] ] === null &&
                this.rs.region[y][x] === this.rs.region[ direction[1] ] [ direction[0] ]
            ) {
                validDirection.push(direction);
            }
        });
        
        // randomly select a destination from the list
        const final = validDirection[Math.floor(Math.random()*validDirection.length)];

        return final;
    }

//++
    private listCreate() {
        const maxPeople = Math.floor(this.cfg.row * this.cfg.column * this.cfg.populationDensity);
        for (let i = 0; i < maxPeople; i++) {
            const p = this.personCreate();
            this.personList.push(p);
        }

        const me = this.getRandomPerson();
        me.isMe = true;

        this.listCreateLocate();
        this.listApplyInitialInfection();
        this.listApplyTest();
        this.listCreateVaccinated();
        this.listApplyLock();
    }
//++
    private listCreateLocate() {
        let personIdx = 0;
        for (let j = 0; j < this.cfg.row; j++) {
            for (let i = 0; i < this.cfg.column; i++) {
                if (personIdx >= this.personList.length) {
                    return;
                }
                const rand = Math.random();
                if (rand < this.cfg.populationDensity) {
                    this.personList[personIdx].x = i;
                    this.personList[personIdx].y = j;
                    this.population[j][i] = this.personList[personIdx];
                    personIdx++;
                }
            }
        }
        // if unable to locate all person into related grid in the first trial,
        // then just locate those extra people at the beginning
        if (personIdx < this.personList.length) {
            for (let j = 0; j < this.cfg.row; j++) {
                for (let i = 0; i < this.cfg.column; i++) {
                    if (this.population[j][i] === null) {
                        this.personList[personIdx].x = i;
                        this.personList[personIdx].y = j;    
                        this.population[j][i] = this.personList[personIdx];
                        personIdx++;
                        if (personIdx >= this.personList.length) {
                            break;
                        }
                    }
                }
                if (personIdx >= this.personList.length) {
                    break;
                }
            }
        }
    }

    listCreateVaccinated() {
        const allTotal = this.personList.length;
        
        const require = Math.floor(allTotal * this.cfg.vaccinationRate);

        const requireRate = require / allTotal;

        this.personList.forEach(p => {
            const rand = Math.random();
            if (requireRate > rand) {
                p.vaccinated = true;
            } else {
                p.vaccinated = false;
            }
        });
    }


    listApplyInitialInfection() {
        // reset all
        this.personList.forEach(p => {
            p.condition = PersonCondition.Healthy;
            p.counter = 0;
        });
        // apply infection
        this.personList.forEach(p => {
            const rand1 = Math.random();
            if (this.cfg.initialInfectionRate > rand1) {
                this.personChangeSickness(p);
            }
    
        });
    }

    listDraw(ctx: CanvasRenderingContext2D) {
        this.ds.clearAll(ctx);
        this.personList.forEach( p => this.personDraw(ctx, p));
    }

    listApplyTest() {
        // reset all
        this.personList.forEach(p => {
            p.status = PersonStatus.Unknown;
            p.tested = 0;
        });
        // apply test
        this.personList.forEach(p => {
            const isWilling = this.personIsWillingToSeekTest(p);
            if (isWilling) {
                this.personChangeTested(p);
            }
        });
    }

    listTestingManager(ctx: CanvasRenderingContext2D) {
        this.personList.forEach(p => {
            let redraw = false;
            // reduce tested counter
            if (p.tested > 0) {
                p.tested--;
                if (p.tested === 0) {
                    p.status = PersonStatus.Unknown;
                    redraw = true;
                }
            }
            if (!(p.status === PersonStatus.Known && p.condition !== PersonCondition.Healthy)) {
                // handling new test
                const isWilling = this.personIsWillingToSeekTest(p);
                if (isWilling) {
                    this.personChangeTested(p);
                    redraw = true;
                }
            }

            if (redraw) {
                this.customListAdd(p);
            }
        });
    }


    listRecoveryManager(ctx: CanvasRenderingContext2D) {
        this.personList.forEach(p => {
            if (p.condition !== PersonCondition.Healthy) {
                p.counter--;
                if (p.counter  === 0) {
                    if (p.condition === PersonCondition.Dying) {
                        this.personRemoveDead(ctx, p);
                    } else {
                        this.personChangeRecovery(p);
                        this.customListAdd(p);
                    }
                }
            }
        });
    }

//++
    listLockManager(ctx: CanvasRenderingContext2D) {
        this.listApplyLock();
        this.listDraw(ctx);
    }

    listApplyLock() {
        // const rand = Math.random();
        this.personList.forEach(p => {
            this.personChangeLock(p);
            // if (this.cfg._quarantineBehaviorChangeRate > rand) { // not appropriate to use random here
            //     this.personChangeLock(p);
            // }
        });
    }

    

}
