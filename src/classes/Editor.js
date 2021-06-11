import TC from "https://cdn.skypack.dev/touchcontroller@4.0.0";


export class Editor {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.init();
    }

    init() {

        this.ctx.lineWidth = 50;
        this.ctx.lineCap = 'round';
        //this.ctx.globalAlpha = 0.5;

        const touchController = TC.TouchController.fromCanvas(this.canvas);
        // Plugins.toggleTouchByTap(touchController);

        touchController.hoveredFrames.subscribe((frame) => {
            // console.info('Hover frame');
        });

        touchController.touches.subscribe((touch) => {
            const color = `black`;//'#' + Math.floor(Math.random() * 16777215).toString(16);

            touch.frameTuples({ itemsPerTuple: 2, startImmediately: true }).subscribe(([frame1, frame2]) => {
                // console.log([frame1, frame2]);
                this.ctx.strokeStyle = color;
                this.ctx.beginPath();
                this.ctx.moveTo(frame1.position.x, frame1.position.y);
                this.ctx.lineTo(frame2.position.x, frame2.position.y);
                this.ctx.stroke();
            });
        });

        new TC.TouchControllerDebugLayer(touchController);
    }
}


