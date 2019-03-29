'use strict';

const DynamoDBAdapterBase = require('../Adapters/DynamoDBAdapterBase');


class UserModel extends DynamoDBAdapterBase {
    constructor() {
        super('user-image-binding');
    }

    putNewUser(){

    }

    updateUserImages(){

    }
}

module.exports = UserModel;