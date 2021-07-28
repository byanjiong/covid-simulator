export enum PersonStatus {
    Unknown,
    Known,
    Testing
}

export enum PersonCondition {
    Healthy,
    Asymptomatic,
    Mild,
    Severe,
    Critical,
    Dead
}


export class Person {
    status: PersonStatus;
    condition: PersonCondition;
    vaccinated: boolean;
    x: number;
    y: number;
    counter: number;
}



/////////////
export const regionColorPicker: string[] = ['#000000', '#eeeeee', '#dddddd', '#cccccc',  '#bbbbbb', '#aaaaaa', '#999999', '#777777'];

export enum SymbolColor {
    // box
    Unknown = '#cfd8dc',
    Known = '#d1c4e9',

    Healthy = '#b2ff59',
    Asymptomatic = '#ffccbc',
    Mild = '#ff6e40',
    Severe = '#d50000',
    Critical = '#9b0000',
    Dead = '#4e342e',

    // border
    Vaccine = '#448aff',
    Lockdown = '#7c4dff',
    Testing = '#ffab40',

    // stat
    ActiveInfection = '#880e4f',
    Infection = '#e91e63',
    Recovery = '#2196f3',

    BaseGrid = '#eceff1',
    RegionBorder = '#8d6e63',
    Error = '#ff3d00'
}
