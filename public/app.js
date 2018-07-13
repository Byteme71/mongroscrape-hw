$.getJSON("/articles", function (data) {
  for (let i = 0; i < data.length; i++) {
    $("#headline").append(`<img src='${data[i].image}'>`);
    $("#headline").append(`<p data-id='${data[i]._id}'>${data[i].headline}<br><a href='${data[i].url}' target='_blank'>Read here</a></p>`);
  }
});

$(document).on("click", "#scraper", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function () {
    location.reload();
  });
});

$(document).on("click", "p", function () {
  $("#notes").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    .then(function (data) {
      $("#notes").append("<h2>" + data.headline + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});