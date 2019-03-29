'use strict';

const crypto = require('crypto');
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
    const imgBuff = Buffer.from(event.body, 'base64');
    const imgMd5 = genMd5(imgBuff);


    // console.log(event.params.header);
    const param = {
        Body: imgBuff,
        Key: 'aaaa.jpg',
    };

    await s3Adapter.putObject(param);
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
};
