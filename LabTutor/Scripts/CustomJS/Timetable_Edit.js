var startTime;
var endTime;
//var urlPrefix = "/2015-msc/xinyuewu";
var urlPrefix = "";

$(document).ready(function () {

    $('#defaultTab').tab('show')
    getModules(1, 1);

    //initialize the calendar
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
            url: urlPrefix + '/Timetable/getClasses/',
            data: {
                year: 1,
                semester: 1
            }
        },
        selectable: true,
        selectHelper: true,
        select: selectDate,
        editable: true,
        droppable: true,
        eventDrop: updateEventTime,
        eventResize: updateEventTime,
        eventClick: editEvent

    });

});

function tabChange(year, semester) {
    $('#calendar').fullCalendar('removeEventSource', '/Timetable/getClasses/')
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Timetable/getClasses/',
        data: {
            year: year,
            semester: semester
        }
    })

    $('#moduleList').empty();
    $('#editModuleList').empty();
    getModules(year, semester);
};

function selectDate(start, end) {

    $('#addDialog').dialog('open');
    $("#eventTime").text("" + start.format("dddd HH:mm") + " ~ " + end.format("HH:mm"));
    startTime = start;
    endTime = end;
}

function getModules(year, semester) {
    $.ajax({
        url: urlPrefix + '/Timetable/getModules',
        type: 'Get',
        data: {
            year: year,
            semester: semester
        },
        dataType: 'json',
        success: function (json) {
            $('#moduleList').attr('enabled', 'true');
            $.each(json, function () {
                $('#moduleList').append(
                     $("<option></option>").text(this.title).val(this.moduleId)
                );
                $('#editModuleList').append(
                     $("<option></option>").text(this.title).val(this.moduleId)
                );
            });
        },
    });
}

function updateEventTime(Event) {
    $.ajax({
        type: 'POST',
        url: urlPrefix + "/Timetable/updateEventTime",
        traditional: true,
        data: {
            'classId': Event.id,
            'newStart': Event.start,
            'newEnd': Event.end
        }
    });
};

function editEvent(Event) {

    $('#editEventId').val(Event.id);
    $("#editEventTime").text("" + Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));
    $("#editModuleList").val(Event.moduleId);

    $('input[value=' + Event.type + ']').prop("checked", true);
    $('input[value=lab]').click(function () {
        $('input[value=lab]').prop("checked", true);
    });
    $('input[value=lecture]').click(function () {
        $('input[value=lecture]').prop("checked", true);
    });

    $("#editTutorNumber").val(Event.tutorNumber);
    $('#editDialog').dialog('open');
}

//add dialog
$('#addDialog').dialog({
    autoOpen: false,
    width: 470,
    buttons: {
        "Add": function () {

            $.ajax({
                url: urlPrefix + "/Timetable/Add",
                type: "POST",
                traditional: true,
                data: {
                    'startTime': startTime,
                    'endTime': endTime,
                    'moduleId': $('#moduleList').val(),
                    'type': $('input[name=type]:checked').val(),
                    'tutorNumber': $('#tutorNumber').val()
                },
                success: function () {
                    $('#addDialog').dialog("close");
                    $('#calendar').fullCalendar('refetchEvents');
                }
            })

        },

        "Cancel": function () {
            $('#addDialog').dialog('close');
        }
    }
});

$('#editDialog').dialog({
    autoOpen: false,
    width: 470,
    buttons: {
        "update": function () {

            $.ajax({
                url: urlPrefix + "/Timetable/Update",
                type: "POST",
                traditional: true,
                data: {
                    'eventId': $("#editEventId").val(),
                    'moduleId': $("#editModuleList").val(),
                    'type': $('input[name=type]:checked').val(),
                    'tutorNumber': $("#editTutorNumber").val()
                },
                success: function () {
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#editDialog').dialog("close");
                }
            })

        },

        "delete": function () {
            if (confirm("do you really want to delete this event?")) {

                $.ajax({
                    url: urlPrefix + "/Timetable/Delete",
                    type: "POST",
                    traditional: true,
                    data: {
                        'eventId': $("#editEventId").val()
                    },
                    success: function () {
                        $('#editDialog').dialog("close");
                        $('#calendar').fullCalendar('removeEvents', $("#editEventId").val());
                    }
                })

            }
        }

    }
});