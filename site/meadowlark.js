var express = require('express');
var app = express();
//设置 handlebars 视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

//给首页和关于页面加上路由。
app.get('/', function(req, res){
    res.type('text/plain');
    res.send('Meadowlark Travel');
});
app.get('/about', function(req, res){
    res.type('text/plain');
    res.send('About Meadowlark Travel');
});
// 定制 404 页面
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
// 定制 500 页面
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});