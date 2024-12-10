var express = require('express');
var router = express.Router();
var db = require("../models/index");

const getUser = async (email) => {
    try {
        const user = await db.User.findOne({ where: { email } });
        return user;
    } catch (error) {
        throw new Error('사용자를 조회하는 도중 오류가 발생했습니다.');
    }
}
    

module.exports = getUser;