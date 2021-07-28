import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { Person } from "../models/person.model";

export enum ControllerAction {
    Start,
    Stop,
    Save,
    Load,

    Reset,

    DrawGrid,
    DrawPerson,

    Ready
}

@Injectable({
    providedIn: 'root'
})
export class ControllerService {

    constructor(
    ) {}

    private controllerActionChangedSource = new Subject<ControllerAction>();
    controllerActionChanged$ = this.controllerActionChangedSource.asObservable();
    emitControllerAction(controllerAction: ControllerAction) {
        this.controllerActionChangedSource.next(controllerAction);
    }


}
