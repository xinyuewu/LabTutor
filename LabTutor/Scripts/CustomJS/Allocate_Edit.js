$(document).ready(function () {

    initCalendar();
});

//var urlPrefix = "/2015-msc/xinyuewu";
var urlPrefix = "";

function tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
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
            url: urlPrefix + '/Allocate/getAllocation',
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

function clickEvent(Event) {
    $("#adjustAllocationModal .modal-title").text(Event.title);
    $("classId").val(Event.id);
    $("year").text(Event.year);
    $("degree").text(Event.degree);
    $("time").text(Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));
    $("tutornumber").text(Event.tutorNumber);

    $.ajax({
        url: urlPrefix + '/Allocate/getStudentsForMultiselectList',
        type: 'Get',
        dataType: 'json',
        data: {
            classId: Event.id,
        },
        success: function (json) {
            $('#multiselect').multiselect('dataprovider', json);

            var hoursExceededList = new Array();
            $.each(json, function () {
                $.each(this.children, function () {
                    if (this.hoursExceeded) {
                        hoursExceededList.push(this);
                    }
                });
            });
            localStorage.setItem('hoursExceededList', JSON.stringify(hoursExceededList));
        }
    });

    var tutorNumber = Event.tutorNumber;
    localStorage.setItem('tutorNumber', JSON.stringify(tutorNumber));


    $('#multiselect').multiselect({
        maxHeight: 200,
        enableFiltering: true,
        filterBehavior: 'value',
        buttonText: function (options, select) {
            var retrievedObject = localStorage.getItem('tutorNumber');
            if (options.length === 0) {
                return 'No student selected ...';
            }
            else if (options.length > retrievedObject) {
                return 'More than ' + retrievedObject + ' students selected!';
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

            // Retrieve the object from storage
            var retrievedObject = localStorage.getItem('tutorNumber');
            if (selectedOptions.length >= retrievedObject) {
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
                var retrievedObject = JSON.parse(localStorage.getItem('hoursExceededList'));

                // Enable all checkboxes.
                $('#multiselect option').each(function () {
                    var input = $('input[value="' + $(this).val() + '"]');
                    input.prop('disabled', false);
                    $.each(retrievedObject, function () {
                        if (this.value == input.attr('value')) {
                            input.prop('disabled', true);
                            input.parent('li').addClass('disabled');
                        }
                    });
                    
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
            url: urlPrefix + '/Allocate/saveStudentsForMultiselectList',
            data: {
                'selected_students': selected_students,
                'classId': $("classId").val()
            },
            type: 'POST',
            traditional: true,
            success: function (data) {
                window.location.href = urlPrefix + "/Allocate/Edit";
            },
            error: function (data) {
                console.log('error!');
            }
        });
    }
})