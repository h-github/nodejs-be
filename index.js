var socket = io();

$(() => {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = $(".needs-validation");
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function (form) {
    $(form).submit(event => {
      event.preventDefault();
      event.stopPropagation();
      $(form).addClass("was-validated");

      if (form.checkValidity() === true) {
        event.target.classList.add("was-validated");
        var msg = { name: $("#name").val(), body: $("#message").val() };
        postMessage(msg);
        resetForm();
        $(form).removeClass("was-validated");
      }
    });
  });

  getMessages();

  // $(".delete-message-btn").click(event => {
  //   console.log($(event.target).data());
  // });
});

addMessage = message => {
  $("#message-stack").append(`<div id="${message._id}" class="card">
    <div class="card-header">${message.name}
    <button class="btn delete-message-btn" data-message-id="${message._id}" onclick="deleteMessage(this)"><i class="fa fa-trash"></i></button>
    </div>
    <div class="card-body" style="padding: 1rem">
      <blockquote class="blockquote mb-0">
        <p style="margin-bottom: 0">${message.body}</p>
      </blockquote></div></div>`);
};

resetForm = () => {
  $("#name").val("");
  $("#message").val("");
};

getMessages = () => {
  $.get("http://localhost:3000/messages", data => {
    data.map(msg => {
      addMessage(msg);
    });
  });
};

postMessage = message => {
  $.post("http://localhost:3000/message", message);
};

deleteMessage = btn => {
  var id = $(btn).data("messageId");
  console.log(id);

  $.ajax({
    url: `http://localhost:3000/message/${id}`,
    method: "DELETE",
  })
    .then(function (data) {
      console.log("deleted", data);
    })
    .catch(function (err) {
      console.error(err);
    });
};

removeMessage = message => {
  $(`#${message._id}`).remove();
};

socket.on("message", addMessage);
socket.on("message-removed", removeMessage);
