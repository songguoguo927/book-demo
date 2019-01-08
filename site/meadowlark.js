var express = require('express');

var app = express();

app.set('port',precess.env.PORT || 3000);

//定制404页面
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('404-not found');
});

//定制500页面
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});