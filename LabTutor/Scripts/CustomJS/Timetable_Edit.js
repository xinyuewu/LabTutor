var startTime;
var endTime;
var urlPrefix = "/2015-msc/xinyuewu";
//var urlPrefix = "";

$(document).ready(function () {

    $('#defaultTab').tab('show')
    getModules(1, 1);
    initCalendar();
    initValidator();
});


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
            url: urlPrefix + '/Timetable/getClasses',
            data: {
                year: 1,
                semester: 1
            }
        },
        selectable: true,
        selectHelper: true,
        select: addClass,
        editable: true,
        droppable: true,
        eventDrop: updateClass,
        eventResize: updateClass,
        eventClick: editClass

    });
}


function tabChange(year, semester) {
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Timetable/getClasses')
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Timetable/getClasses',
        data: {
            year: year,
            semester: semester
        }
    })
    $('#add_moduleList').empty();
    $('#edit_moduleList').empty();
    getModules(year, semester);
};


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
            $('#add_moduleList').attr('enabled', 'true');
            $.each(json, function () {
                $('#add_moduleList').append(
                     $("<option></option>").text(this.title).val(this.moduleId)
                );
                $('#edit_moduleList').append(
                     $("<option></option>").text(this.title).val(this.moduleId)
                );
            });
        },
    });
}

function updateClass(Event) {
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

function addClass(start, end) {

    $("#add_time").text("" + start.format("dddd HH:mm") + " ~ " + end.format("HH:mm"));
    startTime = start;
    endTime = end;
    $('#add_class_modal').modal('toggle');
}

$("#add_class_button").click(function (e) {
    e.preventDefault();
    $.ajax({
        url: urlPrefix + "/Timetable/Add",
        type: "POST",
        traditional: true,
        data: {
            'startTime': startTime,
            'endTime': endTime,
            'moduleId': $('#add_moduleList').val(),
            'type': $('input[name=type]:checked').val(),
            'tutorNumber': $('#add_tutorNumber').val()
        },
        success: function () {
            $('#add_class_modal').modal('toggle');
            $('#calendar').fullCalendar('refetchEvents');
        },
        error: function () {
            console.log("add class error");
        }
    })
})

function editClass(Event) {

    $('#edit_classId').val(Event.id);
    $("#edit_time").text("" + Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));
    $("#edit_moduleList").val(Event.moduleId);

    $('input[value=' + Event.type + ']').prop("checked", true);
    $('input[value=lab]').click(function () {
        $('input[value=lab]').prop("checked", true);
    });
    $('input[value=lecture]').click(function () {
        $('input[value=lecture]').prop("checked", true);
    });
    $("#edit_tutorNumber").val(Event.tutorNumber);

    $('#edit_class_modal').modal('toggle');
}

$("#edit_class_button").click(function (e) {
    e.preventDefault();
    $.ajax({
        url: urlPrefix + "/Timetable/Update",
        type: "POST",
        traditional: true,
        data: {
            'eventId': $("#edit_classId").val(),
            'moduleId': $("#edit_moduleList").val(),
            'type': $('input[name=type]:checked').val(),
            'tutorNumber': $("#edit_tutorNumber").val()
        },
        success: function () {
            $('#calendar').fullCalendar('refetchEvents');
            $('#edit_class_modal').modal('toggle');
        }
    })
})

$("#delete_class_button").click(function (e) {
    if (confirm("do you really want to delete this event?")) {

        $.ajax({
            url: urlPrefix + "/Timetable/Delete",
            type: "POST",
            traditional: true,
            data: {
                'eventId': $("#edit_classId").val()
            },
            success: function () {
                $('#calendar').fullCalendar('removeEvents', $("#edit_classId").val());
                $('#edit_class_modal').modal('toggle');
            }
        })

    }
})

function initValidator() {

    $('#add_class_form').bootstrapValidator({
        fields: {
            tutorNumber: {
                validators: {
                    notEmpty: {
                        message: 'Please indicate how many tutors are needed for this class'
                    },
                    integer: {
                        message: 'Please enter an integer'
                    },
                    greaterThan: {
                        value: 0,
                        message: 'Please enter an integer more than 0'
                    }
                }
            }
        }
    });
    $('#edit_class_form').bootstrapValidator({
        fields: {
            tutorNumber: {
                validators: {
                    notEmpty: {
                        message: 'Please indicate how many tutors are needed for this class'
                    },
                    integer: {
                        message: 'Please enter an integer'
                    },
                    greaterThan: {
                        value: 0,
                        message: 'Please enter an integer more than 0'
                    }
                }
            }
        }
    });

}