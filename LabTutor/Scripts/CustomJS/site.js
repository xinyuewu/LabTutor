$(document).ready(function () {

    initValidator();

});

$('.modal-dialog').draggable({
    //  handle: ".modal-header"
});



$(".js-register-link").click(function () {
    $("#js-register-tab").click();
    e.preventDefault();
})

$(".js-login-link").click(function () {
    $("#js-login-tab").click();
    e.preventDefault();
})

function initValidator() {

    $('#login-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitHandler: function (validator, form, submitButton) {
            $.post('/Account/Login',
                form.serialize(),
                function (result) {
                    if (result.success) {
                        window.location.href = "/Account/LoggedIn";
                    }
                    else {
                        $('#login_error').slideDown({ opacity: "show" }, "slow");
                      //  $('#login-form').bootstrapValidator('disableSubmitButtons', false);
                    }
                }, 'json');
        },       
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your email address'
                    },
                    regexp: {
                        regexp: "[\w\.-]*[a-zA-Z0-9_]@dundee\.ac\.uk",
                        message: 'Please enter a valid Dundee University email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your password'
                    },
                    stringLength: {
                        min: 6,
                        message: 'Please enter at least 6 characters'
                    }
                }
            }
        }
    });

    $('#register-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },

        submitHandler: function (validator, form, submitButton) {
            $.post('Account/Register',
                form.serialize(),
                function (result) {
                    if (result.success) {
                        window.location.href = "Account/LoggedIn";
                    }
                    else {
                        $('#register_error').slideDown({ opacity: "show" }, "slow");
                        $('#register-form').bootstrapValidator('disableSubmitButtons', false);
                    }
                }, 'json');
        },

        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your email address'
                    },
                    regexp: {
                        regexp: "[\w\.-]*[a-zA-Z0-9_]@dundee\.ac\.uk",
                        message: 'Please enter a valid Dundee University email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your password'
                    },
                    stringLength: {
                        min: 6,
                        message: 'Please enter at least 6 characters'
                    }
                }
            },
            first_name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter your first name'
                    }
                }
            },
            last_name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter your last name'
                    }
                }
            },
            matric_number: {
                validators: {
                    notEmpty: {
                        message: 'Please select your level'
                    },
                    regexp: {
                        regexp: "^[0-9]{9}$",
                        message: 'Please enter a valid matriculation number'
                    }
                }
            },
            degree: {
                validators: {
                    notEmpty: {
                        message: 'Please select your degree'
                    }
                }
            },
            level: {
                validators: {
                    notEmpty: {
                        message: 'Please select your level'
                    }
                }
            }
        }
    })

}