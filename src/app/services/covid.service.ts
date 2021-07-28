import { Injectable } from "@angular/core";
import { Person, PersonCondition, PersonStatus } from "../models/person.model";
import { ConfigService } from "./config.service";



@Injectable({
    providedIn: 'root'
})
export class CovidService {

    constructor(
        private cfg: ConfigService
    ) {}


    getInfectionCounter(condition: PersonCondition) {
        switch (condition) {
            case PersonCondition.Asymptomatic: {
                return this.cfg._AsymptomaticSickDays;
            }
            case PersonCondition.Mild: {
                return this.cfg._MildSickDays;
            }
            case PersonCondition.Severe: {
                return this.cfg._SevereSickDays;
            }
            case PersonCondition.Critical: {
                return this.cfg._CriticalSickDays;
            }
            case PersonCondition.Dying: {
                return this.cfg._DyingSickDays;
            }
            default: { // healthy
                return 0;
            }
        }
    }


    getDiseaseCondition(): PersonCondition {
        const r = Math.random();
        if (r > 0.99) { // 1%
            return PersonCondition.Dying;
        } else if (r > 0.95) { // 4%
            return PersonCondition.Critical;
        } else if (r > 0.83) { // 12%
            return PersonCondition.Severe;
        } else if (r > 0.38) { // 45%
            return PersonCondition.Mild;
        } else { // 38%
            return PersonCondition.Asymptomatic;
        }
    }

    newInfection(origin: Person, target: Person) {
        if (origin.condition === PersonCondition.Healthy) {
            return false;
        }
        if (target.condition !== PersonCondition.Healthy) {
            return false;
        }
        let rate: number = 0;
        switch (origin.condition) {
            case PersonCondition.Asymptomatic: {
                rate = this.cfg.infectionRate * 0.2;
                break;
            }
            case PersonCondition.Mild: {
                rate = this.cfg.infectionRate * 0.8;
                break;
            }
            case PersonCondition.Severe: {
                rate = this.cfg.infectionRate;
                break;
            }
            case PersonCondition.Dying: {
                rate = this.cfg.infectionRate;
                break;
            }
        }

        // lockdown
        const rand1 = Math.random();
        if (origin.lock > rand1) {
            rate *= (1 - this.cfg._lockdownEfficacy * origin.lock);
        }
        if (target.lock > rand1) {
            rate *= (1 - this.cfg._lockdownEfficacy * target.lock);
        }

        // test
        if (origin.tested) {
            rate *= this.cfg._testedPatientReduceInfectionToOthers;
        }

        // vaccine & anti-body
        if (target.vaccinated) {
            rate *= (1 - this.cfg.vaccineEfficacy);
        } else if (target.history > 0) {
            rate *= (1 - this.cfg.vaccineEfficacy * 0.8);
        }

        const rand2 = Math.random();
        if (rate > rand2) {
            return true;
        }
        return false;
    }


}
