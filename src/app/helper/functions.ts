export function randomNumber(min: number, max: number) {
    const rand = Math.random() * (max - min) + min;
    return rand;
}


export function randomInteger(min: number, max: number) {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand;
}

export function valueWithin(val: number, min: number, max: number) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    }
    return val;
}