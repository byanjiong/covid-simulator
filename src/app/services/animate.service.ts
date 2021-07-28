import { Injectable } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { Person } from "../models/person.model";
import { regionColorPicker } from "../models/symbol.model";
import { ConfigService } from "./config.service";
import { PersonService } from "./person.service";
import { RegionService } from "./region.service";



@Injectable({
    providedIn: 'root'
})
export class AnimateService {
    constructor(
        private cfg: ConfigService,
        private rs: RegionService,
        private ps: PersonService
    ) {}

}
