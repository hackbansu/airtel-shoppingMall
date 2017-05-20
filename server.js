/**
 * Created by hackbansu on 10/5/17.
 */
const express = require('express');
const db = require('./database/JS/database')
const path = require('path');
const app = express();


app.get('/', function (req, res) {
    res.send('working shopping mall');
});

//req.query = {barcode}
app.get('/getProductDetails', function (req, res) {
    let barcode = req.query.barcode;
    if (!barcode || barcode.length > 13 || barcode.length < 12) {
        res.send('invalid barcode!');
        return;
    }

    db.productsTable.getProductsDetails({barcode: barcode}, ['*'], function (result, fields) {
        // console.log(result);
        res.send(result);
    })
});

//req.query = {name}
app.get('/searchProducts', function (req, res) {
    let name = req.query.name;
    if (!name) {
        res.send('invalid name!');
        return;
    }

    db.productsTable.searchProducts({p_name: name.split(' ')}, ['*'], function (result, fields) {
        // console.log(result);
        res.send(result);
    })
});

//req.query = {barcode}
app.get('/addProductToCart', function (req, res) {
    let barcode = req.query.barcode;
    if (!barcode || barcode.length > 13 || barcode.length < 12) {
        res.send('invalid barcode!');
        return;
    }

    db.productsTable.decrementProductsQuantity({barcode: barcode}, function (result, fields) {
        // console.log(result);
        if (result.changedRows === 1) {
            db.productsTable.getProductsDetails({barcode: barcode}, ['*'], function (result, fields) {
                // console.log(result);
                res.send(result);
            })
        }
        else {
            res.json("error")
        }
    })
});

//req.query = {barcode, quantity}
app.get('/removeProductFromCart', function (req, res) {
    let barcode = req.query.barcode;
    let quantity = parseInt(req.query.quantity);
    if (!barcode || !quantity || barcode.length > 13 || barcode.length < 12) {
        res.send('invalid barcode!');
        return;
    }

    db.productsTable.incrementProductsQuantity({barcode: barcode, quantity: quantity}, function (result, fields) {
        // console.log(result);
        if (result.changedRows === 1) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
})

//req.body={}
app.post('/checkout', function (req, res) {
    res.send('proceding to payment...');
})

app.use('/getImage', express.static(path.join(__dirname, '/database/images/')));
app.use('/getDescription', express.static(path.join(__dirname, '/database/descriptions/')));

app.listen(4000, function () {
    console.log("server successfully started at 4000");
})