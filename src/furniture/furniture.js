tf = window.tf;
let model;

((async () => {
    const modelWeigths = await tf.loadModel('https://adrianodennanni.github.io/furniture_classifier/model/model.json');
    // Return a model that outputs an internal activation.
    const layer = modelWeigths.getLayer('dense');
    model = await tf.model({ inputs: modelWeigths.inputs, outputs: layer.output });

})());





async function recognizeFurnitureFromContext(context) {


    if (!model) return [];

    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height/*224, 224*/);
    const imagePixels = tf.fromPixels(imageData).expandDims(0).toFloat().div(tf.scalar(255));
    const predictedArray = await model.predict(imagePixels).as1D().data();

    let response = {}

    for (i = 0; i <= 127; i++) {
        if (Number.isFinite(response[labels[i][1]])) {
            response[labels[i][1]] += predictedArray[i];
        }
        else {
            response[labels[i][1]] = predictedArray[i];
        }
    };

    response = Object.keys(response).map(item => [item, response[item]]);

    response.sort(function (a, b) {
        return a[1] < b[1] ? 1 : -1;
    });

    return response;

}