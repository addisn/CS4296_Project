'use strict';

const RekognitionAdapterBase = require('./Adapters/RekognitionAdapterBase');
const ImageResultsModel = require('./Models/ImageResultsModel');

const rekognitionAdapter = new RekognitionAdapterBase();
const imageResultsModel = new ImageResultsModel();

exports.handler = async (event) => {
    const allJobs = [];

    console.log(JSON.stringify(event));

    event.Records.forEach((record) => {
        console.log(record.s3);
        const params = rekognitionAdapter.createParams(record.s3.bucket.name, record.s3.object.key);
        const promise = rekognitionAdapter.detectLabels(params)
            .then(r => imageResultsModel.putImageLabelResults(record.s3.object.key, r));
        allJobs.push(promise);
    });

    await Promise.all(allJobs);

    console.log('done');

    return event;
};
