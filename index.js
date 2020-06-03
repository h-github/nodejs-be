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
});

addMessage = message => {
  $("#message-stack").append(`<div class="card">
    <div class="card-header">${message.name}</div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>${message.body}</p>
      </blockquote>
     </div>
    </div>
    <br/>`);
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
  $.post("http://localhost:3000/messages", message);
};

socket.on("message", addMessage);
