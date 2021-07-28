import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PersonService } from '../services/person.service';

@Component({
    selector: 'app-simulator-v1',
    templateUrl: './simulator-v1.component.html',
    styleUrls: ['./simulator-v1.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulatorV1Component implements OnInit {

    constructor(
        public ps: PersonService
    ) { }

    ngOnInit(): void {
    }

    debug() {
        console.log(this.ps.population);
    }
}
