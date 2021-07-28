import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { Person, PersonCondition, PersonStatus } from "../models/person.model";
import { SnackbarMessageComponent } from "../shared/component/snackbar-message/snackbar-message.component";
import { ConfigService } from "./config.service";


@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(
        private cfg: ConfigService,
        public snackBar: MatSnackBar,
    ) {}

    private autoHide = 5000;

    // for snackbar
    open(msg: string) {
        const data = {
            message: msg
        };

        this.openMaterialSnackbar('', msg);
    }



    logObj(data: any) {
        console.log(JSON.parse(JSON.stringify(data)));
    }

    private openMaterialSnackbar(operation = 'operation', msg: string, type?: string) {
        const data = {
            msg,
            type
        };
        const config: MatSnackBarConfig = {
            data,
            duration: this.autoHide,
        };
        this.snackBar.openFromComponent(SnackbarMessageComponent, config);
    }

    
}
