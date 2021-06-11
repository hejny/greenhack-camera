import { Effect } from "../Effect.js";

export class IdentityEffect extends Effect{
    constructor(){
        super(({ r, g, b }) => { return ({ r: r, g: g, b: b }) });
    }
}