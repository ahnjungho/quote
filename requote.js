Quotes = new Mongo.Collection("quotes");

if (Meteor.isClient) {
  Template.body.helpers({
    quotes: function(){
      return Quotes.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-quote": function(event){
      var text = event.target.text.value;

      Quotes.insert({
        text: text,
        createdAt: new Date()
      });

      event.target.text.value = "";

      return false;
    }
  });
}
