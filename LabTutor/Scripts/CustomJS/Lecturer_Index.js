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