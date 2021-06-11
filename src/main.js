import { forTime, forAnimationFrame } from "https://cdn.skypack.dev/waitasecond@1.6.0";

export async function main() {

    if (!navigator.mediaDevices.getUserMedia) {
        alert(`Problem with your camera! Please try to use newest browser and device with webcam or mobile phone.`);
        return;
    }



    const videoElement = document.getElementById('videoElement');
    const sceneElement = document.getElementById('scene');

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


    while (true) {
        await forAnimationFrame();
        sceneElement.getContext('2d').drawImage(videoElement, 0, 0);
    }






    //return await (await fetch(canvas.toDataURL(type, quality))).blob();



}