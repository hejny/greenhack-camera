import { Effect } from "../Effect.js";

export class NegativeEffect extends Effect{
    constructor(){
        super(({ r, g, b }) => { return ({ r: 255 - r, g: 255 - g, b: 255 - b }) });
    }
}