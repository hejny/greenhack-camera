import { forTime, forAnimationFrame } from "https://cdn.skypack.dev/waitasecond@1.6.0";
import { Editor } from "./classes/Editor.js";
import { effect } from "./utils/effect.js";

export async function main() {



    if (!navigator.mediaDevices.getUserMedia) {
        alert(`Problem with your camera! Please try to use newest browser and device with webcam or mobile phone.`);
        return;
    }



    const videoElement = document.createElement('video');
    videoElement.setAttribute('autoPlay', true);



    const sceneCtx = document.getElementById('scene').getContext('2d')
    const maskCtx = document.createElement('canvas').getContext('2d')
    const maskedVideoCtx = document.createElement('canvas').getContext('2d')



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


    for (const { canvas } of [sceneCtx, maskCtx, maskedVideoCtx]) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
    }


    const editor = new Editor(sceneCtx.canvas, maskCtx);

    //sceneCtx.globalAlpha = 0.9;

    while (true) {
        await forAnimationFrame();

        sceneCtx.drawImage(videoElement, 0, 0);



        maskedVideoCtx.globalCompositeOperation = 'source-over';
        maskedVideoCtx.drawImage(videoElement, 0, 0);
        effect(maskedVideoCtx);
        maskedVideoCtx.globalCompositeOperation = 'destination-in';
        maskedVideoCtx.drawImage(maskCtx.canvas, 0, 0);

        sceneCtx.drawImage(maskedVideoCtx.canvas, 0, 0);
        //sceneCtx.drawImage(maskCtx.canvas, 0, 0);
    }






    //return await (await fetch(canvas.toDataURL(type, quality))).blob();



}