//$(document).ready(function () {

//    getPublishState();
//    initValidator();
//    $('#calendar').addClass("noCursorPointer");
//});

////var urlPrefix = "/2015-msc/xinyuewu";
//var urlPrefix = "";

//function getPublishState() {
//    $.ajax({
//        url: urlPrefix + '/Allocate/getPublishState',
//        type: 'Get',
//        dataType: 'json',
//        success: function (json) {
//            if (json) {
//                // $("#registerLink").hide();
//                $(".published").show();
//                initCalendar();
//            }
//            else {
//                $(".unpublished").show();
//            }
//        }
//    });
//}

//function tabChange(semester) {
//    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
//    $('#calendar').fullCalendar('addEventSource', {
//        url: urlPrefix + '/Allocate/getAllocation',
//        data: {
//            studentId: -1,
//            semester: semester
//        }
//    })
//};

//function initCalendar() {

//    $('#calendar').fullCalendar({

//        weekends: false,
//        weekNumbers: false,
//        minTime: "09:00:00",
//        maxTime: "18:00:00",
//        firstDay: 1,
//        contentHeight: 420,
//        defaultView: 'agendaWeek',
//        defaultDate: "2016-06-06",
//        theme: true,
//        allDaySlot: false,
//        events: {
//            url: urlPrefix + '/Allocate/getAllocation',
//            data: {
//                studentId: -1,
//                semester: 1
//            },
//        },
//        eventRender: function (event, element) {

//            var tutors = "";
//            $.each(event.tutorName, function () {
//                tutors += this.name + ", ";
//            });
//            element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");

//        }

//    });
//}

//$(".js-register-link").click(function(e) {
//    $("#js-register-tab").click();
//    e.preventDefault();
//});

//$(".js-login-link").click(function(e) {
//    $("#js-login-tab").click();
//    e.preventDefault();
//});

//$('#login-form').submit(function (event) {
//    event.preventDefault();
//    if ($('#login-form').data("bootstrapValidator").isValid()) {
//        $.ajax({
//            url: urlPrefix + '/Account/Login',
//            type: 'Post',
//            //dataType: 'json',
//            data: $(this).serialize(),
//            success: function (json) {
//                if (json.success) {
//                    window.location.href = urlPrefix + "/Account/LoggedIn";
//                }
//                else {
//                    $('#login_error').slideDown({ opacity: "show" }, "slow");
//                    $('#login-form').bootstrapValidator('disableSubmitButtons', false);
//                }
//            },
//            error: function () {
//                console.log("login error!");
//            }
//        });
//    }
//    else {
//        $('#login-form').bootstrapValidator('disableSubmitButtons', true);
//    }
//});

//$('#register-form').submit(function (event) {
//    event.preventDefault();
//    if ($('#register-form').data("bootstrapValidator").isValid()) {
//        $.ajax({
//            url: urlPrefix + '/Account/Register',
//            type: 'Post',
//            //dataType: 'json',
//            data: $(this).serialize(),
//            success: function (json) {
//                if (json.success) {
//                    window.location.href = urlPrefix + "/Account/LoggedIn";
//                }
//                else {
//                    $('#register_error').slideDown({ opacity: "show" }, "slow");
//                    $('#register-form').bootstrapValidator('disableSubmitButtons', false);
//                }
//            },
//            error: function () {
//                console.log("register error!");
//            }
//        });
//    }
//    else {
//        $('#register-form').bootstrapValidator('disableSubmitButtons', true);
//    }
//});

//function initValidator() {

//    $('#login-form').bootstrapValidator({
//        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
//        feedbackIcons: {
//            valid: 'glyphicon glyphicon-ok',
//            invalid: 'glyphicon glyphicon-remove',
//            validating: 'glyphicon glyphicon-refresh'
//        },
//        fields: {
//            email: {
//                validators: {
//                    notEmpty: {
//                        message: 'Please enter your email address'
//                    },
//                    regexp: {
//                        regexp: "[\w\.-]*[a-zA-Z0-9_]@dundee\.ac\.uk",
//                        message: 'Please enter a valid Dundee University email address'
//                    }
//                }
//            },
//            password: {
//                validators: {
//                    notEmpty: {
//                        message: 'Please enter your password'
//                    },
//                    stringLength: {
//                        min: 6,
//                        message: 'Please enter at least 6 characters'
//                    }
//                }
//            }
//        }
//    });

//    $('#register-form').bootstrapValidator({
//        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
//        feedbackIcons: {
//            validating: 'glyphicon glyphicon-refresh'
//        },
//        fields: {
//            email: {
//                validators: {
//                    notEmpty: {
//                        message: 'Please enter your email address'
//                    },
//                    regexp: {
//                        regexp: "[\w\.-]*[a-zA-Z0-9_]@dundee\.ac\.uk",
//                        message: 'Please enter a valid Dundee University email address'
//                    }
//                }
//            },
//            password: {
//                validators: {
//                    notEmpty: {
//                        message: 'Please enter your password'
//                    },
//                    stringLength: {
//                        min: 6,
//                        message: 'Please enter at least 6 characters'
//                    }
//                }
//            },
//            first_name: {
//                validators: {
//                    stringLength: {
//                        min: 2,
//                        message: 'Please enter at least 2 characters'
//                    },
//                    notEmpty: {
//                        message: 'Please enter your first name'
//                    }
//                }
//            },
//            last_name: {
//                validators: {
//                    stringLength: {
//                        min: 2,
//                        message: 'Please enter at least 2 characters'
//                    },
//                    notEmpty: {
//                        message: 'Please enter your last name'
//                    }
//                }
//            },
//            matric_number: {
//                validators: {
//                    notEmpty: {
//                        message: 'Please select your level'
//                    },
//                    regexp: {
//                        regexp: "^[0-9]{9}$",
//                        message: 'Please enter a valid matriculation number'
//                    }
//                }
//            },
//            degree: {
//                validators: {
//                    notEmpty: {
//                        message: 'Please select your degree'
//                    }
//                }
//            },
//            level: {
//                validators: {
//                    notEmpty: {
//                        message: 'Please select your level'
//                    }
//                }
//            }
//        }
//    });

//}


//$('#other_degree').click(function() {
//    $('#level_dropdownlist').hide();
//    $("#level_select").val(5);
//});
//$('.ACorCS').click(function() {
//    $('#level_dropdownlist').show();
//});
