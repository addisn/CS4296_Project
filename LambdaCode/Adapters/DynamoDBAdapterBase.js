'use strict';

// const debug = require('debug')('dynamoDB:request ');
const AWS = require('aws-sdk');
// AWS.config.update({ region: 'ap-southeast-1' });

//// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
//// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

class DynamoDBAdapterBase {
    constructor(tableName, indexName, region = 'us-east-1') {
        // this.dynamodb = new AWS.DynamoDB();
        this.dynamodbDC = new AWS.DynamoDB.DocumentClient({region});
        this.tName = tableName;
        this.iName = indexName;
    }

    getItem(params) {
        return new Promise((resolve, reject) => {
            // debug('[getItem] - Start');
            params.TableName = this.tName;
            this.dynamodbDC.get(params, (err, data) => {
                // debug('[getItem] - End');
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }

    scan(params) {
        return new Promise((resolve, reject) => {
            // debug('[scan] - Start');
            params.TableName = this.tName;
            if (this.iName) params.IndexName = this.iName;
            this.dynamodbDC.scan(params, function (err, data) {
                // debug('[scan] - End');
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }

    query(params) {
        return new Promise((resolve, reject) => {
            // debug('[query] - Start');
            params.TableName = this.tName;
            if (this.iName) params.IndexName = this.iName;
            this.dynamodbDC.query(params, function (err, data) {
                // debug('[query] - End');
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }

    putItem(params) {
        return new Promise((resolve, reject) => {
            // debug('[putItem] - Start');
            params.TableName = this.tName;
            /* If Enable Return Value */
            // params.ReturnConsumedCapacity = 'TOTAL';
            // params.ReturnItemCollectionMetrics = 'SIZE';
            // params.ReturnValues = 'ALL_OLD';
            this.dynamodbDC.put(params, function (err, data) {
                // debug('[putItem] - End');
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }

    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateItem-property
    updateItem(params) {
        return new Promise((resolve, reject) => {
            // debug('[updateItem] - Start');
            params.TableName = this.tName;
            this.dynamodbDC.update(params, function (err, data) {
                // debug('[updateItem] - End');
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }
}

module.exports = DynamoDBAdapterBase;