$(document).ready(function () {

    getPublishState();

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


