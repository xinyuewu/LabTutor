$(document).ready(function () {

    getPublishState();
    initValidator();
});

var urlPrefix = "/2015-msc/xinyuewu";
//var urlPrefix = "";

function getPublishState() {
    $.ajax({
        url: urlPrefix + '/Allocate/getPublishState',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            if (json) {
                $(".published").show();
                initCalendar();
            }
            else {
                $(".unpublished").show();
            }
        }
    });
}

function tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
        data: {
            semester: semester,
            studentId: -2
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
        eventClick: clickEvent,
        events: {
            url: urlPrefix + '/Allocate/getAllocation',
            data: {
                semester: 1,
                studentId: -2
            },
        },
        eventRender: function (event, element) {

            var tutors = "";
            $.each(event.tutorName, function () {
                tutors += this.name + ", ";
            });
            element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");
        }

    });
}

function clickEvent(Event) {
    $.ajax({
        url: urlPrefix + '/Lecturer/getClassInfo',
        type: 'Get',
        data: {
            classId: Event.id
        },
        dataType: 'json',
        traditional: true,
        success: function (json) {

            $(".modal-title").text(json.module);
            $("degree").text(json.degree);
            $("year").text(json.year);
            $("semester").text(json.semester);
            $("time").text(json.time);

            var tbl_body = "";
            $.each(json.tutors, function () {
                var tbl_row = "";
                $.each(this, function () {
                    tbl_row += "<td>" + this + "</td>";
                })

                tbl_body += "<tr>" + tbl_row + "</tr>";
            });
            $("#classDetailModal tbody").html(tbl_body);

        },
        error: function (json) { console.log("/Lecturer/getClassInfo error"); }
    });

    $('#classDetailModal').modal('toggle');

}

function initValidator() {

    $('#reset_password_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            old_password: {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'Please enter your current password'
                    },
                    stringLength: {
                        min: 6,
                        message: 'Please enter at least 6 characters'
                    },
                    // The validator will create an Ajax request
                    // sending { username: 'its value' } to the back-end
                    remote: {
                        message: 'Incorrect current password',
                        url: urlPrefix + '/Lecturer/checkOldPassword',
                        delay: 500
                    }
                }
            },
            new_password: {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'Please enter your new password'
                    },
                    stringLength: {
                        min: 6,
                        message: 'Please enter at least 6 characters'
                    },
                    different: {
                        field: 'old_password',
                        message: 'The same as the current password'
                    },
                    identical: {
                        field: 'confirm_password',
                        message: 'Password does not match the confirm password'
                    }
                }
            },
            confirm_password: {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'Please confirm your new password'
                    },
                    stringLength: {
                        min: 6,
                        message: 'Please enter at least 6 characters'
                    },
                    different: {
                        field: 'old_password',
                        message: 'The same as the current password'
                    },
                    identical: {
                        field: 'new_password',
                        message: 'Password does not match the confirm password'
                    }
                }
            }
        }
    });

}

$('#reset_password_form').submit(function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if ($('#reset_password_form').data("bootstrapValidator").isValid()) {
        $.ajax({
            url: urlPrefix + '/Lecturer/resetPassword',
            type: 'Post',
            //dataType: 'json',
            data: { new_password: $('#new_password').val() },
            success: function (json) {
                window.location.href = urlPrefix + "/Lecturer/Index";
                //$('.modal-backdrop').hide();
                //$('body').removeClass('modal-open');
                //$('#rest_password_modal').modal('hide');
            },
            error: function () {
                console.log("reset passowrd error!")
            }
        });
    }
    else {
        $('#reset_password_form').bootstrapValidator('disableSubmitButtons', true);
    }
});