import { forTime, forAnimationFrame } from "https://cdn.skypack.dev/waitasecond@1.6.0";
import { Editor } from "./classes/Editor.js";

export async function main() {



    if (!navigator.mediaDevices.getUserMedia) {
        alert(`Problem with your camera! Please try to use newest browser and device with webcam or mobile phone.`);
        return;
    }



    const videoElement = document.createElement('video');
    videoElement.setAttribute('autoPlay', true);
    const sceneElement = document.getElementById('scene');
    const sceneContext = sceneElement.getContext('2d')
    const maskElement = document.createElement('canvas');
    const maskContext = maskElement.getContext('2d')



    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
        alert(`Problem with your camera! Your camera is probbably in use.`);
        throw error;
    }


    console.log({ stream })
    videoElement.srcObject = stream;


    await forTime(100/* for camera size init TODO: Smarter */);


    sceneElement.width = videoElement.videoWidth;
    sceneElement.height = videoElement.videoHeight;
    maskElement.width = videoElement.videoWidth;
    maskElement.height = videoElement.videoHeight;

    const editor = new Editor(sceneElement, maskContext);



    while (true) {
        await forAnimationFrame();
        sceneContext.globalCompositeOperation = 'source-over';
        sceneContext.drawImage(videoElement, 0, 0);
        sceneContext.globalCompositeOperation = 'destination-out';

        sceneContext.drawImage(maskElement, 0, 0);
    }






    //return await (await fetch(canvas.toDataURL(type, quality))).blob();



}