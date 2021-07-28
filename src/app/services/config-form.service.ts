import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ConfigService } from "./config.service";
import { ControllerAction, ControllerService } from "./controller.service";
import { PersonService } from "./person.service";
import { RegionService } from "./region.service";
import { StatisticChange, StatisticService } from "./statistic.service";



@Injectable({
    providedIn: 'root'
})
export class ConfigFormService {
    constructor(
        private fb: FormBuilder,
        private cfg: ConfigService,
        private clrs: ControllerService,
        private rs: RegionService,
        private sts: StatisticService,
        private ps: PersonService
    ) {
        const defaultConfigValue = this.cfg.getDefault();
        this.createConfigForm(defaultConfigValue);
    }

    // form
    configForm: FormGroup;



    createConfigForm(config: Partial<ConfigService>) {
        this.configForm = this.fb.group(config);
    }

    getFormData() {
        const val: Partial<ConfigService> = this.configForm.value;
        return val;
    }

    applyConfig(config: Partial<ConfigService>) {
        let resetStat = false;
        // require controller action
        const act: ControllerAction[] = [ ControllerAction.Stop ];


        const cachedOldCfg = { ...this.cfg } as ConfigService;

        // check what type of action required
        Object.keys(cachedOldCfg).forEach(name => {
            if (config.hasOwnProperty(name)) {

                // assign
                (this.cfg as any)[name] = (config as any)[name];

                switch(name) {
                    case 'row': case 'column': case 'populationDensity': {
                        if ((cachedOldCfg as any)[name] !== (config as any)[name]) {
                            act.push(ControllerAction.Reset);
                            resetStat = true;
                        }
                        break;
                    }
                    case 'symbolSize': case 'region': case 'displayGrid': {
                        if ((cachedOldCfg as any)[name] !== (config as any)[name]) {
                            act.push(ControllerAction.DrawGrid);
                            act.push(ControllerAction.DrawPerson);
                        }
                        break;
                    }
                    case 'displayAll': case 'displayVaccinated': case 'displayLock': {
                        if ((cachedOldCfg as any)[name] !== (config as any)[name]) {
                            act.push(ControllerAction.DrawPerson);
                        }
                        break;
                    }
                    case 'initialInfectionRate': {
                        if ((cachedOldCfg as any)[name] !== (config as any)[name]) {
                            this.ps.listApplyInitialInfection();
                            act.push(ControllerAction.Reset);
                            resetStat = true;
                        }
                        break;
                    }
                    case 'vaccinationRate': {
                        if ((cachedOldCfg as any)[name] !== (config as any)[name]) {
                            this.ps.listCreateVaccinated();
                            act.push(ControllerAction.DrawPerson);
                            resetStat = true;
                        }
                        break;
                    }
                    case 'testingRate': {
                        if (this.sts.challengeTimer <= 1) {
                            if ((cachedOldCfg as any)[name] !== (config as any)[name]) {
                                this.ps.listApplyTest();
                                act.push(ControllerAction.DrawPerson);
                                resetStat = true;
                            }
                        }
                        break;
                    }
                    case 'quarantineStrictness': {
                        if ((cachedOldCfg as any)[name] !== (config as any)[name]) {
                            this.ps.listApplyLock();
                            act.push(ControllerAction.DrawPerson);
                        }
                        break;
                    }
                }
            }
        });

        this.resolveOtherConfigVariables();

        let uniqueItems = [...new Set(act)]

        if (uniqueItems.includes(ControllerAction.Reset)) {
            uniqueItems = [ ControllerAction.Stop, ControllerAction.Reset ];
        }
        uniqueItems.forEach(a => {
            this.clrs.emitControllerAction(a);
        });

        if (resetStat) {
            this.sts.emitStatistic(StatisticChange.Reset);
        }

    }

    resolveOtherConfigVariables() {
        // resolve padding
        const p = Math.floor(this.cfg.symbolSize / 6);
        if (this.cfg.displayGrid) {
            this.cfg.padding = p > 1 ? p : 2;
        } else {
            this.cfg.padding = p > 1 ? p : 0;
        }
    }

    

}
