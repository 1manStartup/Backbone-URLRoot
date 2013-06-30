
var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose');



mongoose.connect('mongodb://localhost/bb-url2')
var Schema = mongoose.Schema;

/*
var Article = new Schema({
  articlename: String,
  _dog : {type: Schema.ObjectId, ref: 'Dog'}
});
*/

/*
var Dog = new Schema({
  name: String,
  articles: [new Schema({
  articlename: String,
  _dog : {type: Schema.ObjectId, ref: 'Dog'}
})]
});
*/
var Article = new Schema({
  articlename: String,
  _dog : {type: Schema.ObjectId, ref: 'Dog'}
})


var Article = mongoose.model('Article', Article);

var Dog = new Schema({
  name: String,
  articles: [{type: Schema.ObjectId, ref: 'Article'}]
})

var Dog = mongoose.model('Dog', Dog);
var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/moo', routes.index);

app.get('/', function(req, res){
  res.render('demo-routerurl.jade', { 
    title: 'Router URL and Dynamic URL'
  });
});

app.post('/api/makedog', function( request, response ) {
  console.log("sale en p0st");
    var dog = new Dog({
    name: request.body.name,
  });
//dog.articles.push({articlename: 'kushmoon'});
  dog.save({});
  return response.send( dog );
   });

/*
app.put('/api/makedog/:id', function (req, res) {
  return FrameworkModel.findById(req.params.id, function (err, framework) {
    framework.title = req.body.title;
    framework.url = req.body.url;
    return framework.save(function (err) {
      if (!err) {
        return res.send(framework);
      } else {
        return console.log(err);
      }
    });
  });
});
*/

/*
app.put('/api/makedog/:id', function (req, res) {
  return Dog.findById(request.params.id, function (err, dog) {
console.log("dimelo");
 var article = new Article({
    articlename: request.body.articlename,
    _dog: request.params.id
  });

    return dog.save(function (err) {
      if (!err) {
        return response.send(article);
      } else {
        return console.log(err);
      }
    });
  });
});
*/


app.post('/api/makedog/:id', function(req, res){
  Dog.findById(req.params.id, function (err, doc){

    var article = new Article({
    articlename: req.body.articlename,
    _dog: req.params.id
  });


    article.save(function(err) {
      if (!err){
        console.log("added embedded");
        res.redirect('/');
      }
      else {
        console.log("y u no work");
      }
    });
  });
});


app.post('/api/makearticle', function( request, response ) {
  console.log("Article Posted");  
    var article = new Article({
    articlename: request.body.articlename,
    _dog: request.body.parentref
  });
  article.save({});
  return response.send( article );
   });

//Not Optimized
app.get( '/api/makedog/:id', function( request, response ) {
  return Dog.findById( request.params.id, function( err, dog ) {
    if( !err ) {
      return response.send( dog );
    } else {
      return console.log( err );
    }
  });
});


//Working Route, get articles by parent
app.get('/api/makearticle/:id', function(req, res){
 Article.find({ _dog : req.params.id}, function (err,docs) {
   //Todo.user = req.user._id;
  res.send(docs);
  });
});

app.get('/api/zoo', function (req, res) {
  Article.find({}).populate('_dog','name').exec(function (err, surveys) {
    return res.send(surveys);
  });
});


app.get('/api/makedog', function(req, res){
  Dog.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.get('/api/makearticle', function(req, res){
  Article.find({}, function (err, docs) {
    res.send(docs);
  });
});



app.delete( '/api/makedog/:id', function( request, response ) {
    console.log( 'Deleting dog with id: ' + request.params.id );
    return Dog.findById( request.params.id, function( err, dog ) {
        return dog.remove( function( err ) {
            if( !err ) {
                console.log( 'Dog removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
});

console.log("worker is loaded");
var bob = app.listen(4500);
