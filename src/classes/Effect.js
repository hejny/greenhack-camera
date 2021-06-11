export class Effect {

    constructor(mapPoint) {
        this.mapPoint = mapPoint;
    }

    apply(context) {
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        let dataArr = imageData.data;

        for (let i = 0; i < dataArr.length; i += 4) {
            let r = dataArr[i]; // Red color lies between 0 and 255
            let g = dataArr[i + 1]; // Green color lies between 0 and 255
            let b = dataArr[i + 2]; // Blue color lies between 0 and 255
            let a = dataArr[i + 3]; // Transparency lies between 0 and 255

            const mapped = this.mapPoint({ r, g, b });

            dataArr[i] = mapped.r;
            dataArr[i + 1] = mapped.g;
            dataArr[i + 2] = mapped.b;
        }

        context.putImageData(imageData, 0, 0);

    }
}