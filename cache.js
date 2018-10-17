"use strict";
const readline = require('readline');
const Storage = require('./storage');
const storage = Storage.CreateStorage();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('SIGINT', () => {
    rl.close();
    process.exit(1);
});

function handle(cmd, callback) {
    let args = cmd.trim().split(/\s+/);
    switch (args[0]) {
        case "SET":
            if (args.length !== 3) {
                callback('Error: the number of parameters')
            }
            storage.setValue(args[1], args[2], callback);
            break;
        case "GET":
            if (args.length !== 2) {
                callback('Error: the number of parameters')
            }
            storage.getValue(args[1], callback);
            break;
        case "COUNT":
            if (args.length !== 2) {
                callback('Error: the number of parameters')
            }
            storage.count(args[1], callback);
            break;
        case "DELETE":
            if (args.length !== 2) {
                callback('Error: the number of parameters')
            }
            storage.deleteKey(args[1], callback);
            break;
        case "BEGIN":
            if (args.length !== 1) {
                callback('Error: the number of parameters')
            }
            storage.begin(callback);
            break;
        case "ROLLBACK":
            if (args.length !== 1) {
                callback('Error: the number of parameters')
            }
            storage.rollback(callback);
            break;
        case "COMMIT":
            if (args.length !== 1) {
                callback('Error: the number of parameters')
            }
            storage.commit(callback);
            break;
        case "exit": process.exit(0);
        default:
            callback('Error: no command ' + args[0]);
    }
}

function listen_input(err) {
    if (err) {
        console.error(err);
    }
    rl.question(">> ", (cmd) => {
        handle(cmd, listen_input);
    });
}

listen_input();