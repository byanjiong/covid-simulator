export enum PersonStatus {
    Unknown,
    Known
}

export enum PersonCondition {
    Healthy,
    Asymptomatic,
    Mild,
    Severe,
    Critical,
    Dying
}


export class Person {
    status: PersonStatus;
    condition: PersonCondition;
    vaccinated: boolean;
    x: number;
    y: number;
    counter: number;
    /** desire to self-lock, higher the value indicate more willing to stay at home */
    lock: number;
    history: number; // counter for past covid infection
    tested: number; // if test for covid, then a counter will be applied and fade away by time
    isMe: boolean; // is the player himself, just to make game more engaging
}
