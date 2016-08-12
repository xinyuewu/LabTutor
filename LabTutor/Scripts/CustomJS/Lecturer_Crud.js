var urlPrefix = "/2015-msc/xinyuewu";
//var urlPrefix = "";

$(document).ready(function () {

    $('#myTable').DataTable({
        "iDisplayLength": -1,
        "lengthChange": true
    });

    initValidator();
});

$('#add_lecturer').click(function () {
    $.ajax({
        url: urlPrefix + '/Lecturer/getModules',
        type: 'Get',
        dataType: 'json',
        success: function (json) {
            $('#multiselect_modules').multiselect('dataprovider', json);
        }
    });
});

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


$('#add_lecturer_form').submit(function (e) {
    e.preventDefault();

    if ($('#add_lecturer_form').data("bootstrapValidator").isValid()) {

        var options = $('#multiselect_modules option:selected');

        var selected_modules = new Array();
        options.each(function (i, selected) {
            selected_modules.push($(selected).val());
        });

        $.ajax({
            url: urlPrefix + '/Lecturer/Add',
            data: {
                'selected_modules': selected_modules,
                'fname': $("#fname").val(),
                'lname': $("#lname").val(),
                'email': $("#email").val(),
                'password': $("#password").val()
            },
            type: 'POST',
            //dataType: 'json',
            traditional: true,
            success: function (data) {
                window.location.href = urlPrefix + "/Lecturer/Crud";
            },
            error: function (data) {
                console.log('/Lecturer/Add error!');
            }
        });
    }
})

$('#edit_lecturer_form').submit(function (e) {
    e.preventDefault();

    if ($('#edit_lecturer_form').data("bootstrapValidator").isValid()) {

        var options = $('#edit_multiselect_modules option:selected');

        var selected_modules = new Array();
        options.each(function (i, selected) {
            selected_modules.push($(selected).val());
        });

        $.ajax({
            url: urlPrefix + '/Lecturer/Edit',
            data: {
                'lecturerId': $("#lecturerId").val(),
                'selected_modules': selected_modules,
                'fname': $("#edit_fname").val(),
                'lname': $("#edit_lname").val(),
                'email': $("#edit_email").val()
            },
            type: 'POST',
            traditional: true,
            success: function (data) {
                window.location.href = urlPrefix + "/Lecturer/Crud";
            },
            error: function (data) {
                console.log('/Lecturer/Edit error!');
            }
        });
    }
})

$('#multiselect_modules').multiselect({
    maxHeight: 200,
    enableFiltering: true,
    filterBehavior: 'value',
    buttonWidth: '320px',
    buttonText: function (options, select) {
        if (options.length === 0) {
            return 'No module selected ...';
        }
        else if (options.length > 1) {
            return 'More than 1 modules selected!';
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
    }
});


$('#edit_multiselect_modules').multiselect({
    maxHeight: 200,
    enableFiltering: true,
    filterBehavior: 'value',
    buttonWidth: '320px',
    buttonText: function (options, select) {
        if (options.length === 0) {
            return 'No module selected ...';
        }
        else if (options.length > 1) {
            return 'More than 1 modules selected!';
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
    }
});

function initValidator() {

    $('#add_lecturer_form').bootstrapValidator({
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter an email address'
                    },
                    regexp: {
                        regexp: "[\w\.-]*[a-zA-Z0-9_]@dundee\.ac\.uk",
                        message: 'Please enter a valid Dundee University email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Please enter a password'
                    },
                    stringLength: {
                        min: 6,
                        message: 'Please enter at least 6 characters'
                    }
                }
            },
            fname: {
                validators: {
                    stringLength: {
                        min: 2,
                        message: 'Please enter at least 2 characters'
                    },
                    notEmpty: {
                        message: 'Please enter the lecturer\'s first name'
                    }
                }
            },
            lname: {
                validators: {
                    stringLength: {
                        min: 2,
                        message: 'Please enter at least 2 characters'
                    },
                    notEmpty: {
                        message: 'Please enter the lecturer\'s last name'
                    }
                }
            },
            modules: {
                validators: {
                    callback: {
                        message: 'Please choose at least 1 module',
                        callback: function (value, validator) {
                            // Get the selected options
                            var options = validator.getFieldElements('modules').val();
                            return (options != null);
                        }
                    }
                }
            }
        }
    });

    $('#edit_lecturer_form').bootstrapValidator({
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter an email address'
                    },
                    regexp: {
                        regexp: "[\w\.-]*[a-zA-Z0-9_]@dundee\.ac\.uk",
                        message: 'Please enter a valid Dundee University email address'
                    }
                }
            },
            fname: {
                validators: {
                    stringLength: {
                        min: 2,
                        message: 'Please enter at least 2 characters'
                    },
                    notEmpty: {
                        message: 'Please enter the lecturer\'s first name'
                    }
                }
            },
            lname: {
                validators: {
                    stringLength: {
                        min: 2,
                        message: 'Please enter at least 2 characters'
                    },
                    notEmpty: {
                        message: 'Please enter the lecturer\'s last name'
                    }
                }
            },
            modules: {
                validators: {
                    callback: {
                        message: 'Please choose at least 1 module',
                        callback: function (value, validator) {
                            var options = validator.getFieldElements('modules').val();
                            return (options != null);
                        }
                    }
                }
            }
        }
    });

}