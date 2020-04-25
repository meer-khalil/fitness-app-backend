// // import external moduels
// ==========================================================================
require('dotenv').config();
var app = require('express')();
var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const multer = require('multer');
const cloudinary = require('cloudinary');
const PDFDocument = require('pdfkit');
const merge = require('easy-pdf-merge');
const PDFMerger = require('pdf-merger-js');
const WebSocket = require('ws');
const store = require('./store.js');


var fs = require('fs');
var ejs = require('ejs');
var path = require('path'); // node path module
var cors = require('cors');

app.use(cors());

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(allowCrossDomain);

var port = process.env.PORT || 1339;
var cookieParser = require('cookie-parser')
var device = require('express-device');
app.use(device.capture());
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
// initialize variables
app.use(express.static(__dirname + '/public'));
// app.set('views', __dirname + '/public/views');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/get', function (req, res) {
    res.render('pdf')
})
// ==============================================================================
app.set('view engine', 'ejs');
mongoose.Promise = global.Promise; // fix for "DeprecationWarning: Mongoose: mpromise replacement"
// set envrioment variables if production is false

// database connection
// ================================================================================================================================================//
mongoose.connect('mongodb://fitness:fitness@ec2-34-216-156-161.us-west-2.compute.amazonaws.com:27017/fitness-db', { poolSize: 20, keepAlive: 300000, useMongoClient: true });
mongoose
    .connection
    .once('connected', () => console.log('Connected to database'));

// configure middlewear
// =============================================================================
// = logger
app.use(morgan('dev'));
// json manipulation on server side
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//********************************************************************************** */

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('update', function incoming(message) {


        if (message.newSteps == undefined || message.newSteps == null || message.newSteps == '') {
            ws.send('invalid');
        }
        else if (message.username == undefined || message.username == null || message.username == '') {
            ws.send('invalid');
        }
        else if (message.ts == undefined || message.ts == null || message.ts == '') {
            ws.send('invalid');
        }
        else if (message.update_id == undefined || message.update_id == null || message.update_id == '') {
            ws.send('invalid');
        }
        else {
            stepService(store).add(message.username, message.ts, message.newSteps);
            store.findOne({ username: req.params.username }).exec(function (err, result) {
                if (result) {
                    result.stepCount = parseInt(result.stepCount) + parseInt(message.stepCount);
                    result.save();
                    ws.send('success');
                } else {
                    store.create({ username: message.username, ts: message.ts, update_id: message.update_id, stepCount: message.stepCount });
                    ws.send('success');
                }

            })
        }
    });

    app.get('/users/:username/steps', function (req, res) {
        store.findOne({ username: req.params.username }).exec(function (err, result) {
            if (result) {
                res.status(200).send({ "cumulativeSteps": parseInt(result.stepCount), "ts": parseInt(result.ts) })
            } else {
                res.status(404).send({ "error": "User doesn't exist" })
            }
        })
    });
});


/****************************************************************************************************************************************** */

app.listen(port, function () {
    console.log('listening on *:', port);
});
