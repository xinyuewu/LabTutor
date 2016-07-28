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

var tutorNumber = "";
function clickEvent(Event) {
    $("#adjustAllocationModal .modal-title").text(Event.title);
    $("classId").val(Event.id);
    $("year").text(Event.year);
    $("degree").text(Event.degree);
    $("time").text(Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));

    $.ajax({
        url: '/Allocate/getStudentsForMultiselectList',
        type: 'Get',
        dataType: 'json',
        data: {
            classId: Event.id,
        },
        success: function (json) {
            $('#multiselect').multiselect('dataprovider', json);
        }
    });

    var tutorNumber = Event.tutorNumber;
    // alert("first: "+tutorNumber);

    $('#multiselect').multiselect({
        maxHeight: 200,
        enableFiltering: true,
        filterBehavior: 'value',
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'No student selected ...';
            }
            else if (options.length > tutorNumber) {
                return 'More than ' + tutorNumber + ' students selected!';
            }
            else {
                var labels = [];
                options.each(function () {
                    if ($(this).attr('label') !== undefined) {
                        labels.push($(this).attr('label'));
                    }
                    else {
                        labels.push($(this).html());
                    }
                });
                return labels.join(', ') + '';
            }
        },
        onChange: function (option, checked) {
            // Get selected options.
            var selectedOptions = $('#multiselect option:selected');
            // alert("second: " + tutorNumber);
            if (selectedOptions.length >= tutorNumber) {
                // Disable all other checkboxes.
                var nonSelectedOptions = $('#multiselect option').filter(function () {
                    return !$(this).is(':selected');
                });

                nonSelectedOptions.each(function () {
                    var input = $('input[value="' + $(this).val() + '"]');
                    input.prop('disabled', true);
                    input.parent('li').addClass('disabled');
                });
            }
            else {
                // Enable all checkboxes.
                $('#multiselect option').each(function () {
                    var input = $('input[value="' + $(this).val() + '"]');
                    input.prop('disabled', false);
                    input.parent('li').addClass('disabled');
                });
            }
        }
    });

    $('#adjustAllocationModal').modal('toggle');
}

$("#save_multiselectlist").click(function (e) {
    e.preventDefault();
    var options = $('#multiselect option:selected');

    if (options.length > 0) {
       
        var selected_students = new Array();
        options.each(function (i, selected) {
            selected_students.push($(selected).val());
        });

        $.ajax({
            url: '/Allocate/saveStudentsForMultiselectList',
            data: {
                'selected_students': selected_students,
                'classId': $("classId").val()
            },
            type: 'POST',
            traditional: true,
            success: function (data) {             
                window.location.href = "/Allocate/Edit";
            },
            error: function (data) {
                console.log('error!');
            }
        });
    }
})
