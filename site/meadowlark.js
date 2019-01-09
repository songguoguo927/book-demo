var express = require('express');
var app = express();
var fortune = require('./lib/fortune.js');
//设置 handlebars 视图引擎
var handlebars = require('express3-handlebars').create({
        defaultLayout:'main',

    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    },
});
// ,extname:'.hbs'
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});
app.use(express.static(__dirname + '/public'));

app.use(require('body-parser')());

app.get('/newsletter', function(req, res){
// 我们会在后面学到 CSRF……目前，只提供一个虚拟值
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});
app.post('/process', function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you');
});
//旧路由
//给首页和关于页面加上路由。
// app.get('/', function(req, res){
//     res.type('text/plain');
//     res.send('Meadowlark Travel');
// });
// app.get('/about', function(req, res){
//     res.type('text/plain');
//     res.send('About Meadowlark Travel');
// });

// 定制 404 页面
// app.use(function(req, res){
//     res.type('text/plain');
//     res.status(404);
//     res.send('404 - Not Found');
// });
// // 定制 500 页面
// app.use(function(err, req, res, next){
//     console.error(err.stack);
//     res.type('text/plain');
//     res.status(500);
//     res.send('500 - Server Error');
// });
// app.get('/headers', function(req,res){
//     res.set('Content-Type','text/plain');
//     var s = '';
//     for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
//     res.send(s);
// });
//禁用 Express 的 X-Powered-By 头信息
//app.disable('x-powered-by');
//新路由
app.get('/', function(req, res) {
    res.render('home');
});
//想查看浏览器发送的信息
app.get('/login',function (req,res) {
    res.render('login');
});

app.get('/foo',function (req,res) {
   res.render('foo',{layout: null});//不使用布局，也可以使用别的模板
});
app.get('/about', function(req, res){
    // var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    //res.render('about', { fortune: randomFortune });
    res.render('about', {
        fortune: fortune.getFortune(),
        name:'<b>Buttercup</b>',
        pageTestScript:'/qa/tests-about.js'
    });
});
app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});
function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});
// 404 catch-all 处理器（中间件）
app.use(function(req, res, next){
    // res.status(404);
    // res.render('404');
    res.status(404).render('not-found');
});
// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
    console.error(err.stack);
    // res.status(500);
    // res.render('500');
    res.status(500).render('error');
});
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});