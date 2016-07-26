$(document).ready(function () {

    initCalendar();
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
        eventClick: clickEvent,
        eventRender: function (event, element) {
            var tutors = "";
            $.each(event.tutorName, function () {
                tutors += "<span id='#tutor_" + this.studentId + "'>" + this.name + "</span>, ";


                //$('#tutor_394').click(function () {
                //    alert(this.studentId);
                //});

                //$('#tutor_'+this.studentId).qtip({
                //    content: {
                //        title: this.name,
                //        text: "Degree: " + this.degree
                //            + "<br/>Year: " + this.year
                //            + "<br/>Max Hours: " + this.maxHour
                //            + "<br/>Working Hours(S1): " + this.workingHour1
                //            + "<br/>Working Hours(S2): " + this.workingHour2
                //    },
                //    position: {
                //        my: 'top left',
                //        at: 'bottom center'
                //    }
                //});


            });
            element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");
        }

    });
}

//$(document).on('click', '#tutor_394', function () {
//    alert("studentId");
//});


function clickEvent(Event) {
    $("#adjustAllocationModal .modal-title").text(Event.title);
    $("year").text(Event.year);
    $("degree").text(Event.degree);
    $("time").text(Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));

    $.each(Event.tutorName, function () {
        $('#multiselect')
         .append($("<option></option>")
                    .attr("value", this.studentId)
                    .text(this.name));
    });

    $('#multiselect').multiselect();
    $('#adjustAllocationModal').modal('toggle');
}