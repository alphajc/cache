"use strict";

const Storage = function () {
    this.db = {};
    this.transactions = [];
    this.counts = new Map;
}

Storage.prototype.setValue = function (key, val, callback) {
    this.db[key] && this.counts[this.db[key]]--; //如果key原本存在，对应的val的count减一
    this.db[key] = val;
    this.counts[val] = (this.counts[val] || 0 ) + 1;
    callback();
}

Storage.prototype.getValue = function (key, callback) {
    console.log(this.db[key] || "NULL");
    callback();
}

Storage.prototype.count = function (val, callback) {
    console.log(this.counts[val] || "0");
    callback();
}

Storage.prototype.deleteKey = function (key, callback) {
    if (this.db[key]){
        this.counts[this.db[key]]--;
        delete this.db[key];
    }
    callback();
}

function deep_copy(old_obj){
    let new_obj = {};
    for(let k in old_obj) {
        new_obj[k] = old_obj[k]
    }
    return new_obj;
}

Storage.prototype.begin = function (callback) {
    this.transactions.push({db:deep_copy(this.db), counts:deep_copy(this.counts)});
    callback();
}

Storage.prototype.rollback = function (callback) {
    if (this.transactions.length < 1) {
        return callback('ERROR: no transaction');
    }
    let rb = this.transactions.pop();
    this.counts = rb.counts;
    this.db = rb.db;
    callback();
}

Storage.prototype.commit = function (callback) {
    if (this.transactions.length < 1) {
        return callback('ERROR: no transaction');
    }
    this.transactions=[];
    callback();
}

module.exports = {
    Storage,
    CreateStorage() {
        return new Storage();
    }
}