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

    //// check multipart/form boundary
    const boundary = multipart.getBoundary(event.headers['content-type']);
    if (!boundary) return {
        statusCode: 400,
        body: JSON.stringify({message: 'Cannot find boundary from header content-type'})
    };

    //// parse image data from base64 multipart/form, check image type
    let imgBuff, imgExt;
    try {
        const bodyBuff = Buffer.from(event.body, 'base64');
        const parts = multipart.Parse(bodyBuff, boundary);
        console.log(parts);

        imgBuff = parts[0].data;
        const fType = fileType(imgBuff);
        imgExt = fType && fType.ext;
        if (!imgExt || (imgExt !== jpg && imgExt !== png)) return {
            statusCode: 400,
            body: JSON.stringify({message: 'Unsupported image type'})
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 400,
            body: JSON.stringify({message: e.message})
        };
    }

    const imgMd5 = genMd5(imgBuff);
    console.log(imgMd5);

    //// check image is existed in S3 or not
    const isImgExisted = await s3Adapter.headObject(`${imgMd5}.${imgExt}`).then(() => true).catch(() => false);

    if (!isImgExisted) {
        const param = {
            Body: imgBuff,
            Key: `${imgMd5}.${imgExt}`,
        };
        await s3Adapter.putObject(param);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            imageFile: `${imgMd5}.${imgExt}`
        }),
    };
};
