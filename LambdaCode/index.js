'use strict';

const crypto = require('crypto');
const fileType = require('file-type');
const multipart = require('parse-multipart');

const S3AdapterBase = require('./Adapters/S3AdapterBase');
const s3Adapter = new S3AdapterBase('lambda-test1-upload');

const jpg = 'jpg';
const png = 'png';

function genMd5(data) {
    let buff = data;
    if (typeof buff === 'string') Buffer.from(buff, 'base64');
    return crypto.createHash('md5').update(buff).digest('hex');
}

exports.handler = async (event, context) => {
    console.log(Object.keys(event));

    const boundary = multipart.getBoundary(event.headers['content-type']);
    if (!boundary) return {statusCode: 400, body: 'Cannot find boundary from header content-type'};

    try {
        const bodyBuff = Buffer.from(event.body, 'base64');
        const parts = multipart.Parse(bodyBuff, boundary);
        console.log(parts);

        const imgType = fileType(parts[0].data).ext;
        if (imgType !== jpg || imgType !== png) return {statusCode: 400, body: 'Unsupported image type'};
        const imgMd5 = genMd5(imgBuff);
        console.log(imgMd5);
    } catch (e) {
        console.log(e);
        return {statusCode: 400, body: e.message};
    }

    // const imgType = fileType(imgBuff).ext;
    // const imgMd5 = genMd5(imgBuff);
    //
    // //// check image is existed in S3 or not
    // const isImgExisted = await s3Adapter.headObject(imgMd5 + imgType).then(() => true).catch(() => false);
    //
    // if (!isImgExisted) {
    //     const param = {
    //         Body: imgBuff,
    //         Key: imgMd5 + imgType,
    //     };
    //     await s3Adapter.putObject(param);
    // }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
};
