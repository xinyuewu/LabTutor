$(document).ready(function () {

    getNImaxHour();
    initCalendar();
    initFormValidator();
    
});

$('#optional').qtip({
    content: {
        text: 'My common piece of text here'
    }
})

function getNImaxHour() {
    $.ajax({
        url: '/Application/getNImaxHour',
        dataType: 'json',
        type: "GET",
        traditional: true,
        data: { studentId: $("#studentId").val() },
        success: function (json) {
            if (json) {
                $("#ni").val(json.ni);
                $("#maxHour").val(json.maxHour);
            }           
        },
        error: function (json) {
            console.log("getNImaxHour error");
        },
        complete: function (data) {
        
            $('#application-form').bootstrapValidator('validate');
        }


    });
}

function initFormValidator() {

    $('#application-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },       
        fields: {
            NI: {
                validators: {
                    regexp: {
                        regexp: "^\s*[a-zA-Z]{2}(?:\s*\d\s*){6}[a-zA-Z]?\s*$",
                        message: 'Please enter a valid National Insurrance Number'
                    }
                }
            },
            maxHour: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your maximum working hours per week'
                    },
                    between: {
                        min: 1,
                        max: 20,
                        message: 'Please enter a number between 1 and 20'
                    }
                }
            }
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
            url: '/Application/getPreference/',
            data: {
                studentId: $("#studentId").val(),
                semester: 1
            },
        },
        eventClick: eventClick
    });
}

function tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', '/Application/getPreference/')
    $('#calendar').fullCalendar('addEventSource', {
        url: '/Application/getPreference/',
        data: {
            studentId: $("#studentId").val(),
            semester: semester
        }
    })
};


var likedList = new Array();
var dislikedList = new Array();
var neutralList = new Array();

function eventClick(Event) {

    if (Event.preference === 'neutral') {
        $(this).css('background-color', '#86b300');//green
        $(this).css('border-color', '#86b300');
        Event.preference = 'liked';
        likedList.push(Event.id);
     //   alert("liked:" + likedList + " disliked:" + dislikedList + " neutral:" + neutralList);
        if (neutralList.indexOf(Event.id) != -1) {
            delete neutralList.splice([neutralList.indexOf(Event.id)], 1);
        }
    }
    else if (Event.preference === 'liked') {
        $(this).css('background-color', '#ff9933');//orange
        $(this).css('border-color', '#ff9933');
        Event.preference = 'disliked';
        dislikedList.push(Event.id);
     //   alert("liked:" + likedList + " disliked:" + dislikedList + " neutral:" + neutralList);
        if (likedList.indexOf(Event.id) != -1) {
            delete likedList.splice([likedList.indexOf(Event.id)], 1);
        }
    }
    else if (Event.preference === 'disliked') {
        $(this).css('background-color', '#3a87ad');//blue
        $(this).css('border-color', '#3a87ad');
        Event.preference = 'neutral';
        neutralList.push(Event.id);
      //  alert("liked:" + likedList + " disliked:" + dislikedList + " neutral:" + neutralList);
        if (dislikedList.indexOf(Event.id) != -1) {
            delete dislikedList.splice([dislikedList.indexOf(Event.id)], 1);
        }
    }

}

$("#save_button").click(function () {
    $.ajax({
        url: "/Application/Update",
        type: "POST",
        traditional: true,
        data: {
            'likedList': likedList,
            'dislikedList': dislikedList,
            'neutralList': neutralList,
            'studentId': $("#studentId").val(),
            'ni': $("#ni").val(),
            'maxHour': $("#maxHour").val()
        },
        success: function () {
            window.location.href = "/Application";
        }
    })
});

