'use strict';

const AWS = require('aws-sdk');

//// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html

class RekognitionAdapterBase {
    constructor(region) {
        this.rekognition = new AWS.Rekognition({region});
    }

    createParams(s3Bucket, s3ObjectKey, maxLabels = 20, minConfidence = 70) {
        return {
            Image: {
                S3Object: {
                    Bucket: s3Bucket,
                    Name: s3ObjectKey
                }
            },
            MaxLabels: maxLabels,
            MinConfidence: minConfidence
        }
    }

    detectLabels(params) {
        return new Promise((resolve, reject) => {
            this.rekognition.detectLabels(params, function (err, data) {
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }
}

// const paramsExample = {
//     Image: {
//         S3Object: {
//             Bucket: "lambda-test1-upload",
//             Name: "a3peo"
//         }
//     },
//     MaxLabels: maxLabels,
//     MinConfidence: minConfidence
// };
// const rekognitionAdapter = new RekognitionAdapterBase();
// rekognitionAdapter.detectLabels(paramsExample).then((r) => console.log(r));

module.exports = RekognitionAdapterBase;