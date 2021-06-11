import { forTime, forAnimationFrame } from "https://cdn.skypack.dev/waitasecond@1.6.0";
import { Editor } from "./classes/Editor.js";
import { Effect } from "./classes/Effects/Effect.js";
import { GrayscaleEffect } from "./classes/Effects/wellKnown/GrayscaleEffect.js";
import { IdentityEffect } from "./classes/Effects/wellKnown/IdentityEffect.js";
import { NegativeEffect } from "./classes/Effects/wellKnown/NegativeEffect.js";

export async function main() {



    if (!navigator.mediaDevices.getUserMedia) {
        alert(`Problem with your camera! Please try to use newest browser and device with webcam or mobile phone.`);
        return;
    }



    const videoElement = document.createElement('video');
    videoElement.setAttribute('autoPlay', true);


    const videoRecognitionCtx = document.createElement('canvas').getContext('2d');
    const sceneCtx = document.getElementById('scene').getContext('2d');
    const editorMaskCtx = document.createElement('canvas').getContext('2d');
    const compositeMaskCtx = document.createElement('canvas').getContext('2d');
    const maskedVideoCtx = document.createElement('canvas').getContext('2d');
    const resultsMaskCtx = document.createElement('canvas').getContext('2d');


    for (const [streamName, context] of Object.entries({ editorMaskCtx, compositeMaskCtx, maskedVideoCtx, videoRecognitionCtx, resultsMaskCtx })) {
        const streamContainerElement = document.createElement('div');
        streamContainerElement.innerHTML = `<h3>${streamName}</h3>`;
        streamContainerElement.appendChild(context.canvas);
        document.getElementById('streams').appendChild(streamContainerElement);
    }



    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
        alert(`Problem with your camera! Your camera is probbably in use.`);
        throw error;
    }


    // console.log({ stream })
    videoElement.srcObject = stream;


    await forTime(100/* for camera size init TODO: Smarter */);


    for (const { canvas } of [sceneCtx, editorMaskCtx, compositeMaskCtx, maskedVideoCtx, resultsMaskCtx]) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
    }




    const editor = new Editor(sceneCtx.canvas, editorMaskCtx);

    const zone0 = new NegativeEffect()
        .join(new Effect(({ r, g, b }) => { return ({ r: r / 1.4, g: g / 1.4, b: b / 1.4 }) }))
        .join(new NegativeEffect)
        .join(new GrayscaleEffect);
    const zone1 = new IdentityEffect;

    //sceneCtx.globalAlpha = 0.9;

    ((async () => {
        while (true) {
            await forAnimationFrame();

            sceneCtx.drawImage(videoElement, 0, 0);
            zone0.apply(sceneCtx);

            maskedVideoCtx.globalCompositeOperation = 'source-over';
            maskedVideoCtx.drawImage(videoElement, 0, 0);
            zone1.apply(maskedVideoCtx);


            compositeMaskCtx.clearRect(0, 0, compositeMaskCtx.canvas.width, compositeMaskCtx.canvas.height);
            compositeMaskCtx.drawImage(editorMaskCtx.canvas, 0, 0);
            compositeMaskCtx.drawImage(resultsMaskCtx.canvas, 0, 0);

            maskedVideoCtx.globalCompositeOperation = 'destination-in';
            maskedVideoCtx.drawImage(compositeMaskCtx.canvas, 0, 0);



            sceneCtx.drawImage(maskedVideoCtx.canvas, 0, 0);
            //sceneCtx.drawImage(maskCtx.canvas, 0, 0);
        }
    })());



    ((async () => {

        videoRecognitionCtx.canvas.width = 224;
        videoRecognitionCtx.canvas.height = 224;

        while (true) {
            //await forTime(1000);
            await forAnimationFrame();

            videoRecognitionCtx.drawImage(videoElement, 0, 0, videoRecognitionCtx.canvas.width, videoRecognitionCtx.canvas.height);
            const recognition = await recognizeFurnitureFromContext(videoRecognitionCtx);
            //console.log({ recognition });

            resultsMaskCtx.clearRect(0, 0, resultsMaskCtx.canvas.width, resultsMaskCtx.canvas.height)
            resultsMaskCtx.font = "30px Verdana";
            // Create gradient
            //const gradient = ctx.createLinearGradient(0, 0, c.width, 0);
            //gradient.addColorStop("0", " magenta");
            //gradient.addColorStop("0.5", "blue");
            //gradient.addColorStop("1.0", "red");
            // Fill with gradient
            //maskCtx.fillStyle = gradient;
            resultsMaskCtx.fillText(recognition[0][0], 10, 40);
        }
    })());




    //return await (await fetch(canvas.toDataURL(type, quality))).blob();



}