import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SymbolColor } from '../models/symbol.model';

@Component({
    selector: 'app-dialog-help',
    templateUrl: './dialog-help.component.html',
    styleUrls: ['./dialog-help.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogHelpComponent implements OnInit {

    constructor() { }

    colorUnknown = SymbolColor.Unknown;
    colorGeneral = SymbolColor.BaseGrid;
    colorHealthy = SymbolColor.Healthy;
    colorAsymptomatic = SymbolColor.Asymptomatic;
    colorMild = SymbolColor.Mild;
    colorSevere = SymbolColor.Severe;
    colorCritical = SymbolColor.Critical;
    colorDeath = SymbolColor.Dead;

    colorLockdown = SymbolColor.Lockdown;
    colorVaccine = SymbolColor.Vaccine;
    colorTesting = SymbolColor.Testing;
    
    ngOnInit(): void {
    }

}
