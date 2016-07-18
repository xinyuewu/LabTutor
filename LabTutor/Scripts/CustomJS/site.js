$(document).ready(function () {
    getPublishState();
    $('#login-form').validator();
});

$('.modal-dialog').draggable({
    //  handle: ".modal-header"
});

$('#login-form').submit(function (event) {
    event.preventDefault();

    var $form = $(this),
      email = $form.find("input[name='email']").val(),
      password = $form.find("input[name='password']").val(),
      url = $form.attr("action");

    $.ajax({
        url: 'Account/Login',
        type: 'Post',
        dataType: 'json',
        data: { email: email, password: password },
        success: function (json) {
            if (json.success) {
                window.location.href = "Account/LoggedIn";
            }
            else {
                $(".error-message").show();
            }
        },
        error: function () {
            alert("error")
        }
    });



});