/**
 * Created by hackbansu on 4/4/17.
 */

const mysql = require('mysql');
const database = require('./database.js');
const pool = database.pool;
const createQueryHavingWhereClause = database.createQueryHavingWhereClause;

//get required details(via details(array)) of products via identity(object) and call done(result, fields)
function getProductsDetails(identity, details, done) {
    let sql = createQueryHavingWhereClause('SELECT ?? FROM products WHERE', identity);

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(sql, [details], function (err, result, fields) {
            connection.release();
            if (err) throw err;

            done(result, fields);
        });
    });
}

//get required details(via details(array)) of products via p_name_identity(object) and call done(result, fields)
function searchProducts(identity, details, done) {
    let sql = "SELECT ?? FROM products WHERE p_name LIKE '%";
    for (i of identity.p_name) {
        sql += i + '%';
    }
    sql += "'";

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(sql, [details], function (err, result, fields) {
            connection.release();
            if (err) throw err;

            done(result, fields);
        });
    });
}

//decrement available quantity by 1 of products via identity(object) and call done(result, fields)
function decrementProductsQuantity(identity, done) {
    let sql = createQueryHavingWhereClause('UPDATE products SET available_quantity = available_quantity - 1 WHERE', identity);

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;

            done(result, fields);
        });
    });
}

//increment available quantity by 1 of products via identity(barcode) and call done(result, fields)
function incrementProductsQuantity(identity, done) {
    let sql = 'UPDATE products SET available_quantity = available_quantity + ' + mysql.escape(identity.quantity)
        + ' WHERE barcode = ' + mysql.escape(identity.barcode);

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;

            done(result, fields);
        });
    });
}


module.exports = {
    getProductsDetails,
    searchProducts,
    decrementProductsQuantity,
    incrementProductsQuantity,
};