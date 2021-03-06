﻿//var urlPrefix = "/2015-msc/xinyuewu";
var urlPrefix = "";

$(document).ready(function () {
    $('[title!=""]').qtip({
        position: {
            my: 'bottom center',
            at: 'top center'
        }
    });
});

$('.modal-dialog').draggable({
    handle: ".modal-header"
});


//Allocate_Index
function allocate_index_tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
        data: {
            studentId: -1,
            semester: semester
        }
    })
};

function getWeightModal() {
    $.ajax({
        url: urlPrefix + '/Allocate/getWeight',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            $("#prefWeight").val(json.prefWeight);
            $("#yearWeight").val(json.yearWeight);
            $("#stuWeight").val(json.stuWeight);
        },
        error: function (json) {
            console.log("get weight error");
        }
    });
}

//use ajax to get student info into modal according to studentId
function passStudentId(id) {
    $.ajax({
        url: urlPrefix + '/Allocate/getStudentInfo',
        type: 'POST',
        data: {
            studentId: id
        },
        dataType: 'json',
        success: function (json) {
            getStudentModal(json);
        }
    });
}
function getStudentModal(json) {

    $(".modal-title").text(json.name);
    $("degree").text(json.degree);
    $("matricnumber").text(json.matricNumber);
    $("year").text(json.year);
    $("ni").text(json.NI);
    $("maxhour").text(json.maxHour);
    $("email").text(json.email);

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
    $("#studentDetailModal tbody").html(tbl_body);
}


var edit_allocation_semester;
//Allocate_Edit
function allocate_edit_tabChange(semester) {
    edit_allocation_semester = semester;
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
        data: {
            studentId: -1,
            semester: semester
        }
    })
};
$("#save_multiselectlist").click(function (e) {
    e.preventDefault();
    var options = $('#multiselect option:selected');

    //if (options.length > 0) {

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
        //dataType: 'json',
        traditional: true,
        success: function (data) {
            $('#edit_tutors_modal').modal('toggle');
            $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
            $('#calendar').fullCalendar('addEventSource', {
                url: urlPrefix + '/Allocate/getAllocation',
                data: {
                    studentId: -1,
                    semester: edit_allocation_semester
                }
            })
            //window.location.href = urlPrefix + "/Allocate/Edit";
        },
        error: function (data) {
            console.log('/Allocate/saveStudentsForMultiselectList error!');
        }
    });
    //}
})

//Application_Index
function preferenceTabChange(semester) {
    $('#preferenceCalendar').fullCalendar('removeEventSource', urlPrefix + '/Application/getPreference')
    $('#preferenceCalendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Application/getPreference',
        data: {
            studentId: $("#studentId").val(),
            semester: semester
        }
    })
};
function allocationTabChange(semester) {
    $('#allocationCalendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#allocationCalendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
        data: {
            studentId: $("#studentId").val(),
            semester: semester
        }
    })
};

//Home_Index
function home_index_tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#calendar').fullCalendar('addEventSource',
        {
            url: urlPrefix + '/Allocate/getAllocation',
            data: {
                studentId: -2,
                semester: semester
            }
        });
};

//Timetable_Edit
function timetable_edit_tabChange(year, semester) {
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

//Lecturer_Index
function lecturer_index_tabChange(semester) {
    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
    $('#calendar').fullCalendar('addEventSource', {
        url: urlPrefix + '/Allocate/getAllocation',
        data: {
            semester: semester,
            studentId: -2
        }
    })
};

//Lecturer_Crud
function editLecturer(id) {
    $.ajax({
        url: urlPrefix + '/Lecturer/getLecturer',
        type: 'Get',
        dataType: 'json',
        data: {
            lecturerId: id,
        },
        success: function (json) {
            $("#lecturerId").val(id);
            $("#edit_email").val(json.email);
            $("#edit_fname").val(json.fname);
            $("#edit_lname").val(json.lname);
            $('#edit_multiselect_modules').multiselect('dataprovider', json.modules);
        }
    });
}

function deleteLecturer(id) {
    $('#deleteLecturer').click(function () {
        window.location = urlPrefix + "/Lecturer/Delete/?lecturerId=" + id;
    });
}