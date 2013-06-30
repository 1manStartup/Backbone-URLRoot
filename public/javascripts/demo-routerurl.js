App = new Backbone.Marionette.Application();

App.addRegions({
    mainRegion: "#content",
    middleRegion: "#middle",
    rightRegion: "#right"
});

Dog = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot:'/api/makedog' ,
      initialize:function () {
        this.dogs = new Dogs();
        this.dogs.url = this.urlRoot + "/" + this.id ;
    }   
});

Dogs = Backbone.Collection.extend({
    model: Dog,
    url: '/api/makedog' 
});

Article = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot:'/api/makearticle' ,
      initialize:function () {
        this.merr = new Articles;
        this.merr.url = this.urlRoot + "/" + this.id ;
    } 
});

Articles = Backbone.Collection.extend({
    model: Article,
    url: '/api/makearticle' 
});


ArticleView  = Backbone.Marionette.ItemView.extend({
  template: '#article-template',
  events: {
  "click #delete" : "deleteArticle"
},
deleteArticle: function(){
     this.model.destroy();
        this.remove();
}
});

DogView = Backbone.Marionette.ItemView.extend({
    template: "#dog-template",
    tagName: 'li',
  events: {
    "mouseover div.dog" : "showArticles",
    "click #delete" : "deleteDog"
  },
  deleteDog: function(){
    console.log("Deleting " + this.model.get("_id"));
        this.model.destroy();
        this.remove();
  },
  showArticles: function(){
    console.log("you clicked dog " + this.model.get("_id"));
    var mydog = this.model.get("_id");
Backbone.history.navigate("dog/" + mydog , {trigger: true});

    var articlesview = new ArticlesView({model: this.model});
    App.middleRegion.show(articlesview);
  }
});

ArticlesView = Backbone.Marionette.CompositeView.extend({
  itemViewContainer: 'ul',
  template: '#articles-template',
  ui : {
    input : '#new-article',
    dogsid : '#parent-id'
  },
  events: {
    "click #add-article" : "addarticle",
    "click #delete" : "deleteArticle"
  },
  addarticle: function(evt){
   this.collection  = thearticles;
   var articleText = this.ui.input.val().trim();
   var dogref = this.ui.dogsid.val().trim();
    if (evt) {
   this.collection.create({
        articlename : articleText,
        parentref: dogref

      });
       evt.preventDefault();
      this.ui.input.val(' ');
  this.render();
    }
  }
});


DogsView = Backbone.Marionette.CompositeView.extend({
   template: "#dogs-template",
   itemView: DogView,
   ui : {
    input : '#new-todo'
  },
 events : {
    'click #add' : 'addDog'
  },
    addDog: function(evt){
     this.collection = doggies;
    var todoText = this.ui.input.val().trim();
    if (evt) { 
      this.collection.create({
        name : todoText
      });
       evt.preventDefault();
      this.ui.input.val(' ');
    }
  }
});

var thearticles = new Articles();
thearticles.fetch();

var doggies = new Dogs();
doggies.fetch();
var doggyview = new DogsView({collection: doggies});

Controller = {        
        index: function(){
console.log("kushbert index");
App.mainRegion.show(doggyview);
        },

        user: function(id){  
console.log("Router works for User " + id);
 var dogg = new Articles(id);
 console.log(dogg);

        dogg.fetch({
            success: function (data) {
                console.log(data);
            }
        });

           }
,
 };

MyRouter = Backbone.Marionette.AppRouter.extend({
  controller: Controller,
     initialize: function(options) {
          this.options = options;
      },
      appRoutes: {
      "": "index",
      "dog/:id": "user"
    },
    });


App.addInitializer(function(){
console.log("Router started");
new MyRouter();
});

App.on("initialize:after", function(options){
if (!Backbone.history.started){
      Backbone.history.start({pushState: true});
      console.log('backbone history started');
    }
  });

App.start();