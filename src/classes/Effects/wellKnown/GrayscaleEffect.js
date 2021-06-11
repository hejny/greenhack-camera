import { Effect } from "../Effect.js";

export class GrayscaleEffect extends Effect{
    constructor(){
        super(({ r, g, b }) => { const a = (r + g + b) / 3; return ({ r: a, g: a, b: a }) });
    }
}