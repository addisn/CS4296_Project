'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

//// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

class S3AdapterBase {
    constructor(bucket) {
        this.bucket = bucket;
    }

    getObject(key, bucket = this.bucket) {
        const params = {
            Bucket: bucket,
            Key: key
        };
        return new Promise((resolve, reject) => {
            s3.getObject(params, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }

    headObject(key, bucket = this.bucket) {
        const params = {
            Bucket: bucket,
            Key: key
        };
        return new Promise((resolve, reject) => {
            s3.headObject(params, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }

    putObject(params) {
        /** example params
         const param = {
            Body: '',
            Bucket: '',
            Key: '',
            ACL: '', // optional
            ContentType: '' // optional
        };
         **/
        if (!params['Bucket']) params['Bucket'] = this.bucket;
        return new Promise((resolve, reject) => {
            s3.putObject(params, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }
}

// const s3Adapter=new S3AdapterBase('lambda-test1-upload');
// s3Adapter.headObject('aaa.jpg').then(console.log);

module.exports = S3AdapterBase;