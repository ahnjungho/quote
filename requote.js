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
      var attribution = event.target.attribution.value;
      var source = event.target.source.value;
      var tags = event.target.tags.value;

      Quotes.insert({
        text: text,
        attribution: attribution,
        source: source,
        tags: tags,
        createdAt: new Date(),
        owner: Meteor.userId()
      });

      event.target.text.value = "";

      return false;
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
