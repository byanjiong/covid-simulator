import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { debounceTime } from 'rxjs/operators';
import { ControllerAction, ControllerService } from '../services/controller.service';
import { ConfigFormService } from '../services/config-form.service';
import { DialogHelpComponent } from '../dialog-help/dialog-help.component';
import { MatDialog } from '@angular/material/dialog';
import { PresetService } from '../services/preset.service';
import { StatisticChange, StatisticService } from '../services/statistic.service';

@Component({
    selector: 'app-config-dashboard',
    templateUrl: './config-dashboard.component.html',
    styleUrls: ['./config-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigDashboardComponent implements OnInit {
    constructor(
        public cfg: ConfigService,
        public cfgf:ConfigFormService,
        private cd: ChangeDetectorRef,
        private clrs: ControllerService,
        public prs: PresetService,
        private sts: StatisticService,
        public dialog: MatDialog
    ) { }

    currentConfig = '';
    isStop = true;

    private configFormSubscription: Subscription;
    private controllerActionSubscription: Subscription;

    ngOnInit(): void {
        this.configFormSubscription = this.cfgf.configForm.valueChanges.pipe(
            debounceTime(200)
        ).subscribe(
            v => {
                const formCfg = this.cfgf.getFormData();
                
                this.cfgf.applyConfig(formCfg);
                this.cd.markForCheck();
            }
        );

        this.controllerActionSubscription = this.clrs.controllerActionChanged$.subscribe(a => {
            switch(a) {
                case ControllerAction.Start: {
                    this.isStop = false;
                    break;
                }
                case ControllerAction.Stop: {
                    this.isStop = true;
                    break;
                }
            }
        });
    }

    ngOnDestroy() {
        this.configFormSubscription.unsubscribe();
        this.controllerActionSubscription.unsubscribe();
    }

    applyPresetConfig(config: Partial<ConfigService>) {
        // this.cfgf.resetConfig();
        const defaultVal = this.cfg.getDefault();
        const outConfig = {
            ...defaultVal,
            ...config
        };

        this.cfgf.resolveOtherConfigVariables();
        
        this.cfgf.configForm.patchValue(outConfig);
        // this.clrs.emitControllerAction(ControllerAction.Reset);
        // this.sts.emitStatistic(StatisticChange.Reset);
    }

    onSubmit() {

    }

    showConfig(name: string) {
        if (name === this.currentConfig) {
            this.currentConfig = '';
            return;
        }
        this.currentConfig = name;
    }

    onStart() {
        this.clrs.emitControllerAction(ControllerAction.Start);
    }

    onStop() {
        this.clrs.emitControllerAction(ControllerAction.Stop);
    }

    onSave() {
        this.clrs.emitControllerAction(ControllerAction.Save);
    }

    onNew() {
        this.clrs.emitControllerAction(ControllerAction.Stop);
        this.clrs.emitControllerAction(ControllerAction.Reset);
        this.sts.emitStatistic(StatisticChange.Reset);
    }

    openDialog() {
        let dialogRef = this.dialog.open(DialogHelpComponent);
          
    }

    percentage(value: number) {
        console.log(value);
        return `${value * 100}%`
    }
}



