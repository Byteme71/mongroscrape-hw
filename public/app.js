$(document).ready(function () {


  $(document).on("click", ".scraper", function () {

    $.getJSON("/articles", function (data) {
      for (var i = 0; i < data.length; i++) {

        $("#headline").append(`<img src='${data[i].image}'>`);
        $("#headline").append(`<p data-id='${data[i]._id}'>${data[i].headline}<br><a href='${data[i].url}' target='_blank'>Read here</a></p>`);
        // $("#headline").append("<img src='" + data[i].image +"'/>" + "<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + "<a href='" + data[i].url + "'" + "</p>");
      }
    });
  })


  $(document).on("click", ".scraper", function () {

    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function (data) {
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      }).then(function (data) {
        console.log("DATA**********", data);
        hideDiv.show();
        location.reload();
      });
    });
  });

  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function () {
    console.log('clicked');
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.headline + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
});