$(document).ready(function () {

    $('#myTable').DataTable({
        "iDisplayLength": -1,
        "lengthChange": true
    });

    $('.modal-dialog').draggable({
        //  handle: ".modal-header"
    });

    initCalendar();
    $('#calendar').addClass("noCursorPointer");

    getPublishState();
});

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

// anchor navigate to the certain table row (to avoid being hidden by top navigation bar)
window.addEventListener("hashchange", function () { scrollBy(0, -50) })

//use ajax to get student info into modal according to studentId
function passStudentId(id) {
    $.ajax({
        url: '/Allocate/getStudentInfo',
        type: 'Get',
        data: {
            studentId: id
        },
        dataType: 'json',
        success: function (json) {
            getModal(json);
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
            url: '/Allocate/getAllocation/',
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

            element.qtip({
                content: {
                    title: event.title,
                    text: "Time: " + event.start.format("dddd HH:mm") + " ~ " + event.end.format("HH:mm")
                        + "<br/>Year: " + event.year
                        + "<br/>Degree: " + event.degree
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
        url: '/Allocate/getPublishState',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            if (json) {
                $("#publishButton").html("Unpublish Allocation");
            }
        }
    });
}

function getModal(json) {

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
    $("#modalTable tbody").html(tbl_body);
}