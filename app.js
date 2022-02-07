var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs=require('fs')
const authmiddleware = require('./routes/authmiddleware.js')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/api/signup')
var memberRouter = require('./routes/member')
const http = require("http");
const session = require('express-session')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// 내장 기능 json 제공 기능을 추가
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', signupRouter);
app.use('/member', memberRouter);
// app.use('')
app.use(session({
    secret: 'secret code',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));
app.use(express.json({
    limit: '50mb'
}));

var PORT = 5000
app.listen(PORT, function () {
    console.log(PORT, '실행되었음')
});
http.createServer()

app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// app.post('/api/:alias', async (req, res) => {
//     try {
//         res.send(await req.db(request.params.alias, request.body.param, request.body.where));
//     } catch (err) {
//         res.status(500).send({
//             error: err
//         });
//     }
// });

// let sql = require('./db/sql.js')
// fs.watchFile(__dirname + '/db/sql.js', (current, prev) => {
//     console.log('sql 읽음')
//     delete require.cache[require.resolve('./db/sql.js')]
//     sql = require('./db/sql.js')
// })

module.exports = app;
