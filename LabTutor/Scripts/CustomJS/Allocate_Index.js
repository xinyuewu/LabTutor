$(document).ready(function () {

    getPublishState();

    $('#myTable').DataTable({
        "iDisplayLength": -1,
        "lengthChange": true
    });

    initValidator();

    initCalendar();
    $('#calendar').addClass("noCursorPointer"); 

});

//var urlPrefix = "/2015-msc/xinyuewu";
var urlPrefix = "";

function tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation');
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
        data: {
            studentId: -1,
            semester: semester
        }
    })
};

// anchor navigate to the certain table row (to avoid being hidden by top navigation bar)
window.addEventListener("hashchange", function () { scrollBy(0, -50) })

//use ajax to get student info into modal according to studentId
function passStudentId(id) {
    $.ajax({
        url: urlPrefix + '/Allocate/getStudentInfo',
        type: 'Get',
        data: {
            studentId: id
        },
        dataType: 'json',
        success: function (json) {
            getStudentModal(json);
        }
    });
}

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
            url: urlPrefix + '/Allocate/getAllocation',
            data: {
                studentId: -1,
                semester: 1
            },
        },
        eventRender: function (event, element) {

            var tutors = "";
            $.each(event.tutorName, function () {
                tutors += "<a href='#tutor_" + this.studentId + "'>" + this.name + "</a>, ";
            });
            element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");


            var lecturers = "";
            $.each(event.lecturers, function () {
                lecturers += this.name + ", ";
            });
            element.qtip({
                content: {
                    title: event.title,
                    text: "Time: " + event.start.format("dddd HH:mm") + " ~ " + event.end.format("HH:mm")
                        + "<br/>Year: " + event.year
                        + "<br/>Degree: " + event.degree
                        + "<br/>Lecturer(s): " + lecturers.slice(0, -2)
                        + "<br/>Number of tutors needed: " + event.tutorNumber
                },
                position: {
                    my: 'top left',
                    at: 'bottom center'
                }
            });

        }

    });
}

function getPublishState() {
    $.ajax({
        url: urlPrefix + '/Allocate/getPublishState',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            if (json) {
                $("#publish_button").html("Unpublish Allocation");
                $(".unpublished").hide();
            }           
        }
    });
}

function getStudentModal(json) {

    $(".modal-title").text(json.name);
    $("degree").text(json.degree);
    $("matricnumber").text(json.matricNumber);
    $("year").text(json.year);
    $("ni").text(json.NI);
    $("maxhour").text(json.maxHour);
    $("paymentrate").text(json.paymentRate);

    $.each(json.preferences, function () {

        if (this.liked === "") {
            $("#liked").hide();
        }
        else {
            $("liked").text(this.liked);
            $("#liked").show();
        }

        if (this.disliked === "") {
            $("#disliked").hide();
        }
        else {
            $("disliked").text(this.disliked);
            $("#disliked").show();
        }
    });

    var tbl_body = "";
    $.each(json.allocatedLabs, function () {
        var tbl_row = "";
        $.each(this, function () {
            tbl_row += "<td>" + this + "</td>";
        })

        tbl_body += "<tr>" + tbl_row + "</tr>";
    });
    $("#studentDetailModal tbody").html(tbl_body);
}

function getWeightModal() {
    $.ajax({
        url: urlPrefix + '/Allocate/getWeight',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            $("#prefWeight").val(json.prefWeight);
            $("#yearWeight").val(json.yearWeight);
            $("#stuWeight").val(json.stuWeight);
        },
        error: function (json) {
            console.log("get weight error");
        }
    });
}

function initValidator() {

    $('#weight_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            preference: {
                validators: {
                    notEmpty: {
                        message: 'Please enter the weight for preferences'
                    },
                    integer: {                     
                        message: 'Please enter an integer'
                    },
                    greaterThan: {
                        value: 1,
                        message: 'Please enter an integer more than 1'
                    }
                }
            },
            one_year_approach: {
                validators: {
                    notEmpty: {
                        message: 'Please enter the weight for "one year approach"'
                    },
                    integer: {
                        message: 'Please enter an integer'
                    },
                    greaterThan: {
                        value: 1,
                        message: 'Please enter an integer more than 1'
                    }
                }
            },
            individual_student: {
                validators: {
                    notEmpty: {
                        message: 'Please enter the weight for "individual student"'
                    },
                    integer: {
                        message: 'Please enter an integer'
                    },
                    greaterThan: {
                        value: 1,
                        message: 'Please enter an integer more than 1'
                    }
                }
            }
        }
    });

}

$('#weight_form').submit(function (e) {
    e.preventDefault();

    if ($('#weight_form').data("bootstrapValidator").isValid()) {

        $.ajax({
            url: urlPrefix + '/Allocate/saveWeight',
            data: {
                'prefWeight': $("#prefWeight").val(),
                'yearWeight': $("#yearWeight").val(),
                'stuWeight': $("#stuWeight").val()
            },
            type: 'POST',
            traditional: true,
            success: function (data) {
                window.location.href = urlPrefix + "/Allocate/Index";
            },
            error: function (data) {
                console.log('save weight error!');
            }
        });
    }
})

$("#create_allocation").click(function () {

    $('body').waitMe({

        //none, rotateplane, stretch, orbit, roundBounce, win8, 
        //win8_linear, ios, facebook, rotation, timer, pulse, 
        //progressBar, bouncePulse or img
        effect: 'roundBounce',

        //place text under the effect (string).
        text: 'The algorithm is running ...',

        //background for container (string).
        bg: 'rgba(0,0,0,0.5)',

        //color for background animation and text (string).
        color: '#eee',

        //change width for elem animation (string).
        sizeW: '',

        //change height for elem animation (string).
        sizeH: '',

        // url to image
        source: '',

        // callback
        onClose: function () { }

    });

    window.location.href = urlPrefix + "/Allocate/Create";

})


