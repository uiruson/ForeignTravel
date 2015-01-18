Users = new Mongo.Collection("users");

if (Meteor.isClient) {
  Template.body.helpers({

  });

  Template.body.events({
    "submit .new-flight": function (event) {
      // This function is called when the new task form is submitted
      var destination = event.target.destination.value;
      var budget = event.target.budget.value;
      console.log("destination = " + destination);
      console.log("budget = " + budget);
      Users.insert({
        destination: destination,
        budget: budget,
        createdAt: new Date()
      });

      Meteor.call("getResult",budget, destination);

      // Clear form
      //event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  // Template.landingForm.events({
  //   'click button': function () {
  //     // increment the counter when button is clicked
  //     Session.set("counter", Session.get("counter") + 1);
  //   }
  // });

  Meteor.methods({
  getResult: function(budget, destination){
   
    var jsonData = {
      "kind": "demo",
      "request": {
        "slice": [
          {
            "origin": "YVR",
            "destination": '' + destination,
            "date": "2015-02-26"
          }
        ],
        "passengers": {
          "adultCount": 1,
          "infantInLapCount": 0,
          "infantInSeatCount": 0,
          "childCount": 0,
          "seniorCount": 0
        },
        "MaxPrice": ''+budget,
        "solutions": 10,
        "refundable": false
      }
    }

    $.ajax({
        'url': "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyD-UIZNDcqx0ZRIYnhpisJ_4K90sODJPXY",
        'data': JSON.stringify(jsonData), //{action:'x',params:['a','b','c']}
        'type': 'POST',
        'async': false,
        'contentType': 'application/json', //typically 'application/x-www-form-urlencoded', but the service you are calling may expect 'text/json'... check with the service to see what they expect as content-type in the HTTP header.
        success: function(data){        
             console.log("data = " + data);  
             $('#destination').html("DESTINATION : " + data.trips.data.city[0].name.toUpperCase());
             Meteor.call("displayResult", data.trips.tripOption);
           },
        error: function(e) {
           console.log("ERROR!! = " + e.statusText);
        }
    })
  },

    displayResult: function(data){
      console.log("data.length = " + data.length);
      console.log("data = " + data);
      $('#landingFormContainer').hide();
      $('#resultTableContainer').show();
      var table = $('#resultTable').find('tbody').empty();
      $.each(data, function(index, result){
        var tr = $("<tr>").appendTo(table);
        $("<td>").text(result.saleTotal).appendTo(tr);
        //$("<td>").appendTo(tr);
        $("<td>").text(result.slice[0].segment[0].flight.carrier + " " + result.slice[0].segment[0].flight.number).appendTo(tr);
      });
    }
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
