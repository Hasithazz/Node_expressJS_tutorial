const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = "mongodb+srv://read_write_user:iUadHdjj9dOwpQBt@cluster0.w7yvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// _prefix is a naming convention to identify that this variable will be only used within this file
let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(url).then(client => {
        console.log('Successfully connected to mongodb');
        _db = client.db();
        callback(client);
    }).catch(err => {
        console.log(err);
        throw err;
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found.';

};

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;

