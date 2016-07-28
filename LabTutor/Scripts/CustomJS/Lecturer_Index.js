$(document).ready(function () {

    getPublishState();

});

function getPublishState() {
    $.ajax({
        url: '/Allocate/getPublishState',
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
    $('#calendar').fullCalendar('removeEventSource', '/Allocate/getAllocation/')
    $('#calendar').fullCalendar('addEventSource', {
        url: '/Allocate/getAllocation/',
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
        eventClick: clickEvent,
        events: {
            url: '/Allocate/getAllocation/',
            data: {
                studentId: 0,
                semester: 1
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
        url: '/Lecturer/getClassInfo',
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
        error: function (json) { alert("error");}
    });

    $('#classDetailModal').modal('toggle');

}