$(document).ready(function () {
   
    getPublishState();

});

//var urlPrefix = "/2015-msc/xinyuewu";
var urlPrefix = "";

 function getPublishState() {
    $.ajax({
        url: urlPrefix + '/Allocate/getPublishState',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            if (json) {
                initAllocationCalendar();
                $(".unpublished").hide();
            }
            else {
                initPreferenceCalendar();
                $(".published").hide();
            }
        }
    });
}

//preference calendar
function initPreferenceCalendar() {

    $('#preferenceCalendar').fullCalendar({
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
            url: urlPrefix + '/Application/getPreference',
            data: {
                studentId: $("#studentId").val(),
                semester: 1
            }
        },
        eventClick: clickPreferenceEvent
    });
}

function preferenceTabChange(semester) {
    $('#preferenceCalendar').fullCalendar('removeEventSource', urlPrefix + '/Application/getPreference')
    $('#preferenceCalendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Application/getPreference',
        data: {
            studentId: $("#studentId").val(),
            semester: semester
        }
    })
};

function clickPreferenceEvent(Event) {

    $("#classDetailModal .modal-title").text(Event.title);
    $("time").text(Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));
    $("year").text(Event.year);
    $("degree").text(Event.degree);
    $("tutors").text(Event.tutorNumber);
    $("tutors").prev().text("Tutor Number:");

    var lecturers = "";
    $.each(Event.lecturers, function () {
        lecturers += this.name + " ( " + this.email + " )\n";
    });
    $("lecturers").text(lecturers.slice(0, -1));

    $('#classDetailModal').modal('toggle');
}

//allocation calendar
function initAllocationCalendar() {

    $('#allocationCalendar').fullCalendar({
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
                studentId: $("#studentId").val(),
                semester: 1
            }
        },
        eventClick: clickAllocationEvent

    });
}

function allocationTabChange(semester) {
    $('#allocationCalendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#allocationCalendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
        data: {
            studentId: $("#studentId").val(),
            semester: semester
        }
    })
};

function clickAllocationEvent(Event) {

    $("time").prev().removeClass("col-sm-5");
    $("time").prev().addClass("col-sm-3");
    $("tutors").prev().removeClass("col-sm-5");
    $("tutors").prev().addClass("col-sm-3");

    $(".modal-title").text(Event.title);
    $("time").text(Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));
    $("year").text(Event.year);
    $("degree").text(Event.degree);

    var lecturers = "";
    $.each(Event.lecturers, function () {
        lecturers += this.name + " ( " + this.email + " )\n";
    });
    $("lecturers").text(lecturers.slice(0, -1));

    var tutorName = "";
    $.each(Event.tutorName, function () {
        tutorName += this.name + ", ";
    });

    if (tutorName == "") {
        $("tutors").text("None");
    }
    else {
        $("tutors").text(tutorName.slice(0, -2));
    }

    $('#classDetailModal').modal('toggle');
}