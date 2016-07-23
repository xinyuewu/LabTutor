﻿$(document).ready(function () {
   
    getPublishState();

});

var urlPrefix = "";//"${pageContext.request.contextPath}";

 function getPublishState() {
    $.ajax({
        url: urlPrefix + 'Allocate/getPublishState',
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

//#region preference calendar
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
            url: urlPrefix + 'Application/getPreference/',
            data: {
                studentId: $("#studentId").val(),
                semester: 1
            }
        },
        eventClick: clickPreferenceEvent
    });
}

function preferenceTabChange(semester) {
    $('#preferenceCalendar').fullCalendar('removeEventSource', 'Application/getPreference/')
    $('#preferenceCalendar').fullCalendar('addEventSource', {
        url: urlPrefix + 'Application/getPreference/',
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
    $("tutors").prev().text("Number of tutors:");

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
            url: urlPrefix + 'Allocate/getAllocation/',
            data: {
                studentId: $("#studentId").val(),
                semester: 1
            }
        },
        eventClick: clickAllocationEvent

    });
}

function allocationTabChange(semester) {
    $('#allocationCalendar').fullCalendar('removeEventSource', '/Allocate/getAllocation/')
    $('#allocationCalendar').fullCalendar('addEventSource', {
        url: urlPrefix + 'Allocate/getAllocation/',
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

    var tutorName = "";
    $.each(Event.tutorName, function () {
        var i = 0;
        $.each(this, function () {
            if (i % 2 != 0) {
                tutorName += this + ", ";
            }
            i++;
        })
    });

    if (tutorName == "") {
        $("tutors").text("None");
    }
    else {
        $("tutors").text(tutorName.slice(0, -2));
    }

    $('#classDetailModal').modal('toggle');
}