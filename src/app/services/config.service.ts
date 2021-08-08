import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Person } from "../models/person.model";
import { ControllerAction, ControllerService } from "./controller.service";



@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(
        private clrs: ControllerService
    ) {
        const cfg = this.getDefault();
        this.setValue(cfg);
    }

    // environment
    row: number;
    column: number;
    symbolSize: number; // even number is better
    padding: number; // padding inside the box
    animationSpeed: number; // 10 - 500, miliseconds for each animation step

    // population & person
    populationDensity: number; // 0 - 1, dont make too high, else no space for people to move around
    initialInfectionRate: number; // 0 - 1

    // disease
    infectionRate: number; // 0 - 1, how easy a person will be infected
    recoverRate: number;
    incubationPeriod: number; // day

    // intervention - movement
    region: number; // 1 - 6
    quarantineStrictness: number;

    // intervention - vaccine
    vaccinationRate: number;
    vaccineEfficacy: number;

    // intervention - testing
    testingRate: number;

    // display
    displayAll: boolean;
    displayVaccinated: boolean;
    displayLock: boolean;
    displayGrid: boolean;


    // speed
    /** how many activities within 1 day, e.g. if (totalPerson * 2), then it means averagely each person can move twice per day, also use to calculate statistic overview */
    _maxActivityPerDay: number; 

    // drawing
    _gridStrokeWidth = 2;

    // misc
    _quarantineBehaviorChangeRate = 0.5; // the higher the value, then more people will change their quarantine value every round
    _quarantineEfficacy = 0.99; // % reduce in infection for quarantine person vs no quarantine
    _quarantineThresholdLvl3 = 0.9;
    _quarantineThresholdLvl2 = 0.6;
    _quarantineThresholdLvl1 = 0.3;
    
    _unknownSickSelfQuarantineDayDelay = 3; // day
    
    _unknownSickSeekTestingWillingness = 0.5; // 0 - 1

    _testingValidForDay = 5; // day

    _antibodyEfficacy = 0.65;

    _AsymptomaticSickDays = 14; // day
    _MildSickDays = 20; // day
    _SevereSickDays = 40; // day
    _CriticalSickDays = 60; // day
    _DyingSickDays = 30; // day

    // animation
    _chartAnimationDelay = 1000; // ms

    setValue(config: Partial<ConfigService>) {
        Object.keys(config).forEach(name => {
            // assign
            (this as any)[name] = (config as any)[name];
        });

        // Object.keys(this).forEach(name => {
        //     if (config.hasOwnProperty(name)) {
        //         // assign
        //         (this as any)[name] = (config as any)[name];
        //     }
        // });
    }

    getDefault() {
        const cfg: Partial<ConfigService> = {
            // environment
            // row: 5,
            // column: 8,

            row: 16,
            column: 20,
            symbolSize: 25,
            padding: 4,
            animationSpeed: 100,

            // population & person
            populationDensity: 0.3,
            initialInfectionRate: 0.1,

            // disease
            infectionRate: 0.2,
            recoverRate: 20,
            incubationPeriod: 6,

            // intervention - movement
            region: 1,
            quarantineStrictness: 0,

            // intervention - vaccine
            vaccinationRate: 0,
            vaccineEfficacy: 0.8,

            // intervention - testing
            testingRate: 0,

            // display
            displayAll: true,
            displayVaccinated: true,
            displayLock: true,
            displayGrid: true,
        }
        return cfg;
    }

}
