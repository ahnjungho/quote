Quotes = new Mongo.Collection("quotes");

if (Meteor.isClient) {
  Meteor.subscribe("quotes");

  Template.home.helpers({
    quotes: function(){
      return Quotes.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.home.events({
    "submit .new-quote": function(event){
      var text = event.target.text.value;
      var attribution = event.target.attribution.value;
      var source = event.target.source.value;
      var tags = event.target.tags.value;

      Meteor.call("addQuote", text, attribution, source, tags);

      event.target.text.value = "";
      event.target.attribution.value = "";
      event.target.source.value = "";
      event.target.tags.value = "";

      return false;
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addQuote: function(text, attribution, source, tags){
    if(! Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }

    Quotes.insert({
      text: text,
      attribution: attribution,
      source: source,
      tags: tags,
      createdAt: new Date(),
      owner: Meteor.userId()
    });
  }
})

if (Meteor.isServer) {
  Meteor.publish("quotes", function(){
    return Quotes.find();
  });
}

Router.route('/', function(){
  this.layout('base');

  this.render('home');
})

Router.route('/quote/:_id', function(){
  this.layout('base', {
    waitOn: function() {
      return Meteor.subscribe('quotes', this.params._id)
    },
    data: function() { 
      return Quotes.findOne({_id: this.params._id})
    },
    action: function() {
      if (this.ready()) this.render();
    }
  });
  this.render('singleQuote');
})
