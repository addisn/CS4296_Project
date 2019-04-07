'use strict';

const crypto = require('crypto');
const fileType = require('file-type');
const multipart = require('aws-lambda-multipart-parser');

const S3AdapterBase = require('./Adapters/S3AdapterBase');
const s3Adapter = new S3AdapterBase('lambda-test1-upload');

function genMd5(data) {
    let buff = data;
    if (typeof buff === 'string') Buffer.from(buff, 'base64');
    return crypto.createHash('md5').update(buff).digest('hex');
}

exports.handler = async (event, context) => {
    console.log(Object.keys(event));
    // console.log(event.body);
    const uploaded=multipart.parse(event, false);
    const imgBuff = Buffer.from(event.body, 'base64');
    const imgType = fileType(imgBuff).ext;
    const imgMd5 = genMd5(imgBuff);

    //// check image is existed in S3 or not
    const isImgExisted = await s3Adapter.headObject(imgMd5 + imgType).then(() => true).catch(() => false);

    if (!isImgExisted) {
        const param = {
            Body: imgBuff,
            Key: imgMd5 + imgType,
        };
        await s3Adapter.putObject(param);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
};
