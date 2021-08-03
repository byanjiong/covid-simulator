import { Injectable } from "@angular/core";
import { Person, PersonCondition, PersonStatus } from "../models/person.model";
import { ConfigService } from "./config.service";

interface PresetData {
    name: string,
    config: Partial<ConfigService>
}

@Injectable({
    providedIn: 'root'
})
export class PresetService {

    constructor(
        private cfg: ConfigService
    ) {}

    patchData(config: any) {
        Object.keys(this.cfg).forEach(name => {
            if (config.hasOwnProperty(name)) {
                (this.cfg as any)[name] = config[name];
            }
        });
    }

    reset() {

    }

    preset: PresetData[] = [
        {
            name: 'Basic demo',
            config: {
                row: 8,
                column: 16,
                symbolSize: 50,
                populationDensity: 0.3,
                initialInfectionRate: 0.1,
            }
        },
        {
            name: 'Quarantine',
            config: {
                row: 11,
                column: 22,
                symbolSize: 25,
                animationSpeed: 30,
                populationDensity: 0.5,
                initialInfectionRate: 0.7,
                quarantineStrictness: 0.95,
                displayAll: true
            }
        },
        {
            name: 'Vaccine',
            config: {
                row: 11,
                column: 22,
                symbolSize: 25,
                animationSpeed: 30,
                populationDensity: 0.5,
                initialInfectionRate: 0.7,
                vaccinationRate: 0.8,
                displayAll: true
            }
        },
        {
            name: 'Mass testing',
            config: {
                row: 11,
                column: 22,
                symbolSize: 25,
                animationSpeed: 30,
                populationDensity: 0.5,
                initialInfectionRate: 0.7,
                testingRate: 0.4,
                displayAll: true
            }
        },
        {
            name: 'Region',
            config: {
                row: 11,
                column: 22,
                symbolSize: 25,
                animationSpeed: 30,
                populationDensity: 0.5,
                initialInfectionRate: 0.1,
                region: 5,
                displayAll: true
            }
        },
        {
            name: 'Celebration',
            config: {
                row: 11,
                column: 22,
                symbolSize: 25,
                animationSpeed: 30,
                populationDensity: 0.9,
                initialInfectionRate: 0.1,
                displayAll: true
            }
        },
        {
            name: 'Work from home',
            config: {
                row: 11,
                column: 22,
                symbolSize: 25,
                animationSpeed: 30,
                populationDensity: 0.1,
                initialInfectionRate: 0.1,
                quarantineStrictness: 0.5,
                displayAll: true
            }
        },
        {
            name: 'Real world',
            config: {
                row: 50,
                column: 80,
                symbolSize: 8,
                animationSpeed: 0,
                populationDensity: 0.3,
                initialInfectionRate: 0.2,
                region: 5,
                quarantineStrictness: 0.4,
                vaccinationRate: 0.4,
                testingRate: 0.1,
                displayAll: false,
                displayGrid: false
            }
        },
    ];
}
