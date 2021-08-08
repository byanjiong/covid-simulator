import { Injectable } from "@angular/core";
import { randomInteger } from "../helper/functions";
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
        const offset = randomInteger(-3, 3);
        switch (condition) {
            case PersonCondition.Asymptomatic: {
                return this.cfg._AsymptomaticSickDays + offset;
            }
            case PersonCondition.Mild: {
                return this.cfg._MildSickDays + offset;
            }
            case PersonCondition.Severe: {
                return this.cfg._SevereSickDays + offset;
            }
            case PersonCondition.Critical: {
                return this.cfg._CriticalSickDays + offset;
            }
            case PersonCondition.Dying: {
                return this.cfg._DyingSickDays + offset;
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
                rate = this.cfg.infectionRate * 0.5;
                break;
            }
            case PersonCondition.Mild: {
                rate = this.cfg.infectionRate * 0.9;
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

        // quarantine
        const rand1 = Math.random();
        if (origin.lock > rand1) {
            rate *= (1 - this.cfg._quarantineEfficacy * origin.lock);
        }
        if (target.lock > rand1) {
            rate *= (1 - this.cfg._quarantineEfficacy * target.lock);
        }

        // vaccine & anti-body
        if (target.vaccinated) {
            rate *= (1 - this.cfg.vaccineEfficacy);
        } else if (target.history > 0) {
            rate *= (1 - this.cfg._antibodyEfficacy);
        }

        const rand2 = Math.random();
        if (rate > rand2) {
            return true;
        }
        return false;
    }


}
