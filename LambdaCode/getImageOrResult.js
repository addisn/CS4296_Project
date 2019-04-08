'use strict';

const S3AdapterBase = require('./Adapters/S3AdapterBase');
const ImageResultsModel = require('./Models/ImageResultsModel');

const Region = process.env.Region;
const ImageResultsTable = process.env.ImageResultsTable;
const ImageStoreBucket = process.env.ImageStoreBucket;

const s3Adapter = new S3AdapterBase(ImageStoreBucket);
const imageResultsModel = new ImageResultsModel(ImageResultsTable, undefined, Region);

const eventTemplate = {
    "resource": "/uploaded-image",
    "path": "/uploaded-image",
    "httpMethod": "GET",
    "headers": null,
    "multiValueHeaders": null,
    "queryStringParameters": {
        "aaaa": "bbbb"
    },
    "multiValueQueryStringParameters": {
        "aaaa": [
            "bbbb"
        ]
    },
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "path": "/uploaded-image",
        "accountId": "551676285156",
        "resourceId": "wy8yca",
        "stage": "test-invoke-stage",
        "domainPrefix": "testPrefix",
        "requestId": "bd6e70ef-592e-11e9-9044-250940b1e0a3",
        "identity": {
            "cognitoIdentityPoolId": null,
            "cognitoIdentityId": null,
            "apiKey": "test-invoke-api-key",
            "cognitoAuthenticationType": null,
            "userArn": "arn:aws:iam::551676285156:root",
            "apiKeyId": "test-invoke-api-key-id",
            "userAgent": "aws-internal/3 aws-sdk-java/1.11.498 Linux/4.9.137-0.1.ac.218.74.329.metal1.x86_64 OpenJDK_64-Bit_Server_VM/25.202-b08 java/1.8.0_202",
            "accountId": "551676285156",
            "caller": "551676285156",
            "sourceIp": "test-invoke-source-ip",
            "accessKey": "ASIAYA4TYCDSK4GAZVNT",
            "cognitoAuthenticationProvider": null,
            "user": "551676285156"
        },
        "domainName": "testPrefix.testDomainName",
        "resourcePath": "/uploaded-image",
        "httpMethod": "GET",
        "extendedRequestId": "XxF09GW4IAMF3iw=",
        "apiId": "p81v4825wl"
    },
    "body": null,
    "isBase64Encoded": false
};

async function getImgFromS3(filename) {
    const s3Object = await s3Adapter.getObject(filename);
    return {
        statusCode: 200,
        headers: {
            'Content-Type': s3Object.ContentType,
        },
        body: s3Object.Body.toString('base64'),
        isBase64Encoded: true
    };
}

async function getImgLabels(filename) {
    const imgRes = await imageResultsModel.getImageLabelResults(filename);
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(imgRes)
    };
}

const funcMap = {
    '/uploaded-image': getImgFromS3,
    '/labelled-result': getImgLabels
};

exports.handler = async (event, context) => {
    // console.log(JSON.stringify(event))

    const reqPath = event.resource;
    const filename = event.queryStringParameters && event.queryStringParameters.filename;

    if (funcMap.hasOwnProperty(reqPath) && filename) {
        return await funcMap[reqPath](filename).catch((e) => {
            console.log(e);
            return {statusCode: 200, body: ''};
        });
    }

    return {
        statusCode: 200,
        body: '',
    };
};