
export async function main() {


    const videoElement = document.getElementById('videoElement');

    if (navigator.mediaDevices.getUserMedia) {
        videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    }



}