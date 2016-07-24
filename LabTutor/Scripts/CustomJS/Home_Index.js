$(document).ready(function () {

    getPublishState();
    initValidator();

});

function getPublishState() {
    $.ajax({
        url: 'Allocate/getPublishState',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            if (json) {
                $(".published").show();
                initCalendar();
                $("#registerLink").hide();
            }
            else {
                $(".unpublished").show();
            }
        }
    });
}

function tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', '/Allocate/getAllocation/')
    $('#calendar').fullCalendar('addEventSource', {
        url: 'Allocate/getAllocation/',
        data: {
            studentId: -1,
            semester: semester
        }
    })
};

function initCalendar() {

    $('#calendar').fullCalendar({

        weekends: false,
        weekNumbers: false,
        minTime: "09:00:00",
        maxTime: "18:00:00",
        firstDay: 1,
        contentHeight: 420,
        defaultView: 'agendaWeek',
        defaultDate: "2016-06-06",
        theme: true,
        allDaySlot: false,
        events: {
            url: 'Allocate/getAllocation/',
            data: {
                studentId: -1,
                semester: 1
            },
        },
        eventRender: function (event, element) {

            var tutors = "";
            $.each(event.tutorName, function () {
                var i = 0;
                $.each(this, function () {
                    if (i % 2 != 0) {
                        tutors += this + ", " ;
                    }                 
                    i++;
                })
            });
            element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");  

        }

    });
}

$(".js-register-link").click(function (e) {
    $("#js-register-tab").click();
    e.preventDefault();
})

$(".js-login-link").click(function (e) {
    $("#js-login-tab").click();
    e.preventDefault();
})

$('#login-form').submit(function (event) {
    event.preventDefault();

    $.ajax({
        url: 'Account/Login',
        type: 'Post',
        dataType: 'json',
        data: $(this).serialize(),
        success: function (json) {
            if (json.success) {
                window.location.href = "Account/LoggedIn";
            }
            else {
                $('#login_error').slideDown({ opacity: "show" }, "slow");
                $('#login-form').bootstrapValidator('disableSubmitButtons', false);
            }
        },
        error: function () {
            console.log("login error!")
        }
    });
});

$('#register-form').submit(function (event) {
    event.preventDefault();

    $.ajax({
        url: 'Account/Register',
        type: 'Post',
        dataType: 'json',
        data: $(this).serialize(),
        success: function (json) {
            if (json.success) {
                window.location.href = "Account/LoggedIn";
            }
            else {
                $('#register_error').slideDown({ opacity: "show" }, "slow");
                $('#register-form').bootstrapValidator('disableSubmitButtons', false);
            }
        },
        error: function () {
            console.log("register error!")
        }
    });
});

function initValidator() {

    $('#login-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
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
    });

}
