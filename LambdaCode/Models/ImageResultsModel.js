'use strict';

const DynamoDBAdapterBase = require('../Adapters/DynamoDBAdapterBase');

class ImageResultsModel extends DynamoDBAdapterBase {
    constructor(tableName, indexName, region) {
        super(tableName, indexName, region);
    }

    getImageLabelResults(filename) {
        const params = {
            Key: {
                "Filename": filename
            }
        };
        return this.getItem(params);
    }

    putImageLabelResults(filename, labelResults) {
        const params = {
            Item: {
                "Filename": filename,
                "Results": labelResults
            },
            Expected: {
                "Filename": {
                    Exists: false
                }
            }
        };
        return this.putItem(params);
    }
}

// const imageResultsModel=new ImageResultsModel();
// imageResultsModel.putImageLabelResults('fefafafa',{a:'fefse'});

module.exports = ImageResultsModel;
