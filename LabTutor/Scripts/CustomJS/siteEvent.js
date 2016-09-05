//var urlPrefix = "/2015-msc/xinyuewu";
var urlPrefix = "";


var scriptEvents = {

    init: function () {

    },

    Home_Index: function () {

        getPublishState();
        initValidator();
        $('#calendar').addClass("noCursorPointer");

        function getPublishState() {
            $.ajax({
                url: urlPrefix + '/Allocate/getPublishState',
                type: 'Get',
                dataType: 'json',
                success: function (json) {
                    if (json) {
                        // $("#registerLink").hide();
                        $(".published").show();
                        initCalendar();
                    }
                    else {
                        $(".unpublished").show();
                    }
                }
            });
        }

        //function tabChange(semester) {
        //    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
        //    $('#calendar').fullCalendar('addEventSource', {
        //        url: urlPrefix + '/Allocate/getAllocation',
        //        data: {
        //            studentId: -1,
        //            semester: semester
        //        }
        //    })
        //};

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
                eventRender: function (event, element) {

                    var tutors = "";
                    $.each(event.tutorName, function () {
                        tutors += this.name + ", ";
                    });
                    element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");

                    if (tutors === "") {
                        tutors = "None";
                    } else {
                        tutors = tutors.slice(0, -2);
                    }


                    element.qtip({
                        content: {
                            title: event.title,
                            text: "Tutors allocated: " + tutors
                        },
                        position: {
                            my: 'top left',
                            at: 'bottom center'
                        }
                    });
                }

            });
        }

        $(".js-register-link").click(function (e) {
            $("#js-register-tab").click();
            e.preventDefault();
        })

        $(".js-login-link").click(function (e) {
            $("#js-login-tab").click();
            e.preventDefault();
        })

        //$('#login-form').submit(function (event) {
        //$('#logginButton').click(function (e) {
        //    event.preventDefault();
        //    if ($('#login-form').data("bootstrapValidator").isValid()) {
        //        alert("haha");
        //        $.ajax({
        //            url: urlPrefix + '/Account/Login',
        //            type: 'Post',
        //            //dataType: 'json',
        //            data: $(this).serialize(),
        //            success: function (json) {
        //                if (json.success) {
        //                    window.location.href = urlPrefix + "/Account/LoggedIn";
        //                }
        //                else {
        //                    $('#login_error').slideDown({ opacity: "show" }, "slow");
        //                    $('#login-form').bootstrapValidator('disableSubmitButtons', false);
        //                }
        //            },
        //            error: function () {
        //                console.log("login error!")
        //            }
        //        });
        //    }
        //    else {
        //        $('#login-form').bootstrapValidator('disableSubmitButtons', true);
        //    }
        //});
        $('#logginButton').click(function (event) {
            event.preventDefault();
            $('#login-form').bootstrapValidator('validate');
            if ($('#login-form').data("bootstrapValidator").isValid()) {
                $.ajax({
                    url: urlPrefix + '/Account/Login',
                    type: 'Post',
                    //dataType: 'json',
                    data: $('#login-form').serialize(),
                    success: function (json) {
                        if (json.success) {
                            window.location.href = urlPrefix + "/Account/LoggedIn";
                        }
                        else {
                            $('#login_error').slideDown({ opacity: "show" }, "slow");
                            $('#login-form').bootstrapValidator('disableSubmitButtons', false);
                        }
                    },
                    error: function () {
                        console.log("Login called in error");
                        console.log("login error!")
                    }
                });
            }
            else {
                $('#login-form').bootstrapValidator('disableSubmitButtons', true);
            }
        });

        //$('#register-form').submit(function (event) {
        //$('#registerButton').click(function (event) {
        //    event.preventDefault();
        //    if ($('#register-form').data("bootstrapValidator").isValid()) {
        //        $.ajax({
        //            url: urlPrefix + '/Account/Register',
        //            type: 'Post',
        //            //dataType: 'json',
        //            data: $(this).serialize(),
        //            success: function (json) {
        //                if (json.success) {
        //                    window.location.href = urlPrefix + "/Account/LoggedIn";
        //                }
        //                else {
        //                    $('#register_error').slideDown({ opacity: "show" }, "slow");
        //                    $('#register-form').bootstrapValidator('disableSubmitButtons', false);
        //                }
        //            },
        //            error: function () {
        //                console.log("register error!")
        //            }
        //        });
        //    }
        //    else {
        //        $('#register-form').bootstrapValidator('disableSubmitButtons', true);
        //    }
        //});
        $('#registerButton').click(function (event) {
            event.preventDefault();
            $('#register-form').bootstrapValidator('validate');
            if ($('#register-form').data("bootstrapValidator").isValid()) {
                $.ajax({
                    url: urlPrefix + '/Account/Register',
                    type: 'Post',
                    //dataType: 'json',
                    data: $('#register-form').serialize(),
                    success: function (json) {
                        if (json.success) {
                            window.location.href = urlPrefix + "/Account/LoggedIn";
                        }
                        else {
                            $('#register_error').slideDown({ opacity: "show" }, "slow");
                            $('#register-form').bootstrapValidator('disableSubmitButtons', false);
                        }
                    },
                    error: function () {
                        console.log("register error!")
                    }
                });
            }
            else {
                $('#register-form').bootstrapValidator('disableSubmitButtons', true);
            }
        });

        function initValidator() {

            $('#login-form').bootstrapValidator({
                // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                submitButtons: 'button[type="submit"]',
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter your email address'
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
                                message: 'Please enter your password'
                            },
                            stringLength: {
                                min: 6,
                                message: 'Please enter at least 6 characters'
                            }
                        }
                    }
                }
            });

            $('#register-form').bootstrapValidator({
                // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
                feedbackIcons: {
                    validating: 'glyphicon glyphicon-refresh'
                },
                submitButtons: 'button[type="submit"]',
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter your email address'
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
                                message: 'Please enter your password'
                            },
                            stringLength: {
                                min: 6,
                                message: 'Please enter at least 6 characters'
                            }
                        }
                    },
                    first_name: {
                        validators: {
                            stringLength: {
                                min: 2,
                                message: 'Please enter at least 2 characters'
                            },
                            notEmpty: {
                                message: 'Please enter your first name'
                            }
                        }
                    },
                    last_name: {
                        validators: {
                            stringLength: {
                                min: 2,
                                message: 'Please enter at least 2 characters'
                            },
                            notEmpty: {
                                message: 'Please enter your last name'
                            }
                        }
                    },
                    matric_number: {
                        validators: {
                            notEmpty: {
                                message: 'Please select your level'
                            },
                            regexp: {
                                regexp: "^[0-9]{9}$",
                                message: 'Please enter a valid matriculation number'
                            }
                        }
                    },
                    degree: {
                        validators: {
                            notEmpty: {
                                message: 'Please select your degree'
                            }
                        }
                    },
                    level: {
                        validators: {
                            notEmpty: {
                                message: 'Please select your level'
                            }
                        }
                    }
                }
            });

        }

        $('#other_degree').click(function () {
            $('#level_dropdownlist').hide();
            $("#level_select").val(5);
        })
        $('.ACorCS').click(function () {
            $('#level_dropdownlist').show();
        })

    },

    Allocate_Index: function () {

        getPublishState();

        $('#myTable').DataTable({
            "iDisplayLength": -1,
            "lengthChange": true
        });

        initValidator();

        initCalendar();
        $('#calendar').addClass("noCursorPointer");

        //function tabChange(semester) {
        //    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
        //    $('#calendar').fullCalendar('addEventSource', {
        //        url: urlPrefix + '/Allocate/getAllocation',
        //        data: {
        //            studentId: -1,
        //            semester: semester
        //        }
        //    })
        //};

        // anchor navigate to the certain table row (to avoid being hidden by top navigation bar)
        window.addEventListener("hashchange", function () { scrollBy(0, -50) })

        ////use ajax to get student info into modal according to studentId
        //function passStudentId(id) {
        //    $.ajax({
        //        url: urlPrefix + '/Allocate/getStudentInfo',
        //        type: 'Get',
        //        data: {
        //            studentId: id
        //        },
        //        dataType: 'json',
        //        success: function (json) {
        //            getStudentModal(json);
        //        }
        //    });
        //}

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
                eventRender: function (event, element) {

                    var tutors = "";
                    $.each(event.tutorName, function () {
                        tutors += "<a href='#tutor_" + this.studentId + "'>" + this.name + "</a>, ";
                    });
                    element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");


                    var lecturers = "";
                    $.each(event.lecturers, function () {
                        lecturers += this.name + ", ";
                    });
                    var tutorsInQtip = "";
                    $.each(event.tutorName, function () {
                        tutorsInQtip += this.name + ", ";
                    });
                    if (tutorsInQtip === ""){
                        tutorsInQtip = "None";
                    }else{
                        tutorsInQtip = tutorsInQtip.slice(0, -2);
                    }
                    

                    element.qtip({
                        content: {
                            title: event.title,
                            text: "Time: " + event.start.format("dddd HH:mm") + " ~ " + event.end.format("HH:mm")
                                + "<br/>Year: " + event.year
                                + "<br/>Degree: " + event.degree
                                + "<br/>Lecturer(s): " + lecturers.slice(0, -2)
                                + "<br/>Number of tutors needed: " + event.tutorNumber
                                + "<br/>Tutors allocated: " + tutorsInQtip
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
                url: urlPrefix + '/Allocate/getPublishState',
                type: 'Get',
                dataType: 'json',
                success: function (json) {
                    if (json) {
                        $("#publish_button").html("Unpublish Allocation");
                        $(".unpublished").hide();
                    }
                }
            });
        }

        //function getStudentModal(json) {

        //    $(".modal-title").text(json.name);
        //    $("degree").text(json.degree);
        //    $("matricnumber").text(json.matricNumber);
        //    $("year").text(json.year);
        //    $("ni").text(json.NI);
        //    $("maxhour").text(json.maxHour);
        //    $("paymentrate").text(json.paymentRate);

        //    $.each(json.preferences, function () {

        //        if (this.liked === "") {
        //            $("#liked").hide();
        //        }
        //        else {
        //            $("liked").text(this.liked);
        //            $("#liked").show();
        //        }

        //        if (this.disliked === "") {
        //            $("#disliked").hide();
        //        }
        //        else {
        //            $("disliked").text(this.disliked);
        //            $("#disliked").show();
        //        }
        //    });

        //    var tbl_body = "";
        //    $.each(json.allocatedLabs, function () {
        //        var tbl_row = "";
        //        $.each(this, function () {
        //            tbl_row += "<td>" + this + "</td>";
        //        })

        //        tbl_body += "<tr>" + tbl_row + "</tr>";
        //    });
        //    $("#studentDetailModal tbody").html(tbl_body);
        //}

        //function getWeightModal() {
        //    $.ajax({
        //        url: urlPrefix + '/Allocate/getWeight',
        //        type: 'Get',
        //        dataType: 'json',
        //        success: function (json) {
        //            $("#prefWeight").val(json.prefWeight);
        //            $("#yearWeight").val(json.yearWeight);
        //            $("#stuWeight").val(json.stuWeight);
        //        },
        //        error: function (json) {
        //            console.log("get weight error");
        //        }
        //    });
        //}

        function initValidator() {

            $('#weight_form').bootstrapValidator({
                // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    preference: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter the weight for preferences'
                            },
                            integer: {
                                message: 'Please enter an integer'
                            },
                            greaterThan: {
                                value: 1,
                                message: 'Please enter an integer more than 1'
                            }
                        }
                    },
                    one_year_approach: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter the weight for "one year approach"'
                            },
                            integer: {
                                message: 'Please enter an integer'
                            },
                            greaterThan: {
                                value: 1,
                                message: 'Please enter an integer more than 1'
                            }
                        }
                    },
                    individual_student: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter the weight for "individual student"'
                            },
                            integer: {
                                message: 'Please enter an integer'
                            },
                            greaterThan: {
                                value: 1,
                                message: 'Please enter an integer more than 1'
                            }
                        }
                    }
                }
            });

        }

        $('#weight_form').submit(function (e) {
            e.preventDefault();

            if ($('#weight_form').data("bootstrapValidator").isValid()) {

                $.ajax({
                    url: urlPrefix + '/Allocate/saveWeight',
                    data: {
                        'prefWeight': $("#prefWeight").val(),
                        'yearWeight': $("#yearWeight").val(),
                        'stuWeight': $("#stuWeight").val()
                    },
                    type: 'POST',
                    traditional: true,
                    success: function (data) {
                        window.location.href = urlPrefix + "/Allocate/Index";
                    },
                    error: function (data) {
                        console.log('save weight error!');
                    }
                });
            }
        })

        $("#create_allocation").click(function () {

            $('body').waitMe({

                //none, rotateplane, stretch, orbit, roundBounce, win8, 
                //win8_linear, ios, facebook, rotation, timer, pulse, 
                //progressBar, bouncePulse or img
                effect: 'roundBounce',

                //place text under the effect (string).
                text: 'The algorithm is running ...',

                //background for container (string).
                bg: 'rgba(0,0,0,0.5)',

                //color for background animation and text (string).
                color: '#eee',

                //change width for elem animation (string).
                sizeW: '',

                //change height for elem animation (string).
                sizeH: '',

                // url to image
                source: '',

                // callback
                onClose: function () { }

            });

            window.location.href = urlPrefix + "/Allocate/Create";

        })

    },

    Allocate_Edit: function () {

        initCalendar();

        //function tabChange(semester) {
        //    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
        //    $('#calendar').fullCalendar('addEventSource', {
        //        url: urlPrefix + '/Allocate/getAllocation',
        //        data: {
        //            studentId: -1,
        //            semester: semester
        //        }
        //    })
        //};

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
                filterBehavior: 'text',
                enableCaseInsensitiveFiltering: true,
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
                    //dataType: 'json',
                    traditional: true,
                    success: function (data) {
                        window.location.href = urlPrefix + "/Allocate/Edit";
                    },
                    error: function (data) {
                        console.log('/Allocate/saveStudentsForMultiselectList error!');
                    }
                });
            }
        })

    },

    Timetable_Edit: function () {

        var startTime;
        var endTime;

        $('#defaultTab').tab('show')
        getModules(1, 1);
        initCalendar();
        initValidator();

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

        //function tabChange(year, semester) {
        //    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Timetable/getClasses')
        //    $('#calendar').fullCalendar('addEventSource', {
        //        url: urlPrefix + '/Timetable/getClasses',
        //        data: {
        //            year: year,
        //            semester: semester
        //        }
        //    })
        //    $('#add_moduleList').empty();
        //    $('#edit_moduleList').empty();
        //    getModules(year, semester);
        //};

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

    },

    Lecturer_Crud: function () {

        $('#myTable').DataTable({
            "iDisplayLength": -1,
            "lengthChange": true
        });

        initValidator();

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

        //function editLecturer(id) {
        //    $.ajax({
        //        url: urlPrefix + '/Lecturer/getLecturer',
        //        type: 'Get',
        //        dataType: 'json',
        //        data: {
        //            lecturerId: id,
        //        },
        //        success: function (json) {
        //            $("#lecturerId").val(id);
        //            $("#edit_email").val(json.email);
        //            $("#edit_fname").val(json.fname);
        //            $("#edit_lname").val(json.lname);
        //            $('#edit_multiselect_modules').multiselect('dataprovider', json.modules);
        //        }
        //    });
        //}

        //function deleteLecturer(id) {
        //    $('#deleteLecturer').click(function () {
        //        window.location = urlPrefix + "/Lecturer/Delete/?lecturerId=" + id;
        //    });
        //}

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
            filterBehavior: 'text',
            enableCaseInsensitiveFiltering: true,
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
            filterBehavior: 'text',
            enableCaseInsensitiveFiltering: true,
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

    },

    Application_Index: function () {

        getPublishState();

        function getPublishState() {
            $.ajax({
                url: urlPrefix + '/Allocate/getPublishState',
                type: 'Get',
                dataType: 'json',
                success: function (json) {
                    if (json) {
                        initAllocationCalendar();
                        $(".unpublished").hide();
                    }
                    else {
                        initPreferenceCalendar();
                        $(".published").hide();
                    }
                }
            });
        }

        //preference calendar
        function initPreferenceCalendar() {

            $('#preferenceCalendar').fullCalendar({
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
                    url: urlPrefix + '/Application/getPreference',
                    data: {
                        studentId: $("#studentId").val(),
                        semester: 1
                    }
                },
                eventClick: clickPreferenceEvent
            });
        }

        //function preferenceTabChange(semester) {
        //    $('#preferenceCalendar').fullCalendar('removeEventSource', urlPrefix + '/Application/getPreference')
        //    $('#preferenceCalendar').fullCalendar('addEventSource', {
        //        url: urlPrefix + '/Application/getPreference',
        //        data: {
        //            studentId: $("#studentId").val(),
        //            semester: semester
        //        }
        //    })
        //};

        function clickPreferenceEvent(Event) {

            $("#classDetailModal .modal-title").text(Event.title);
            $("time").text(Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));
            $("year").text(Event.year);
            $("degree").text(Event.degree);
            $("tutors").text(Event.tutorNumber);
            $("tutors").prev().text("Tutor Number:");

            var lecturers = "";
            $.each(Event.lecturers, function () {
                lecturers += this.name + " ( " + this.email + " )\n";
            });
            $("lecturers").text(lecturers.slice(0, -1));

            $('#classDetailModal').modal('toggle');
        }

        //allocation calendar
        function initAllocationCalendar() {

            $('#allocationCalendar').fullCalendar({
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
                        studentId: $("#studentId").val(),
                        semester: 1
                    }
                },
                eventClick: clickAllocationEvent

            });
        }

        //function allocationTabChange(semester) {
        //    $('#allocationCalendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
        //    $('#allocationCalendar').fullCalendar('addEventSource', {
        //        url: urlPrefix + '/Allocate/getAllocation',
        //        data: {
        //            studentId: $("#studentId").val(),
        //            semester: semester
        //        }
        //    })
        //};

        function clickAllocationEvent(Event) {

            $("time").prev().removeClass("col-sm-5");
            $("time").prev().addClass("col-sm-3");
            $("tutors").prev().removeClass("col-sm-5");
            $("tutors").prev().addClass("col-sm-3");

            $(".modal-title").text(Event.title);
            $("time").text(Event.start.format("dddd HH:mm") + " ~ " + Event.end.format("HH:mm"));
            $("year").text(Event.year);
            $("degree").text(Event.degree);

            var lecturers = "";
            $.each(Event.lecturers, function () {
                lecturers += this.name + " ( " + this.email + " )\n";
            });
            $("lecturers").text(lecturers.slice(0, -1));

            var tutorName = "";
            $.each(Event.tutorName, function () {
                tutorName += this.name + ", ";
            });

            if (tutorName == "") {
                $("tutors").text("None");
            }
            else {
                $("tutors").text(tutorName.slice(0, -2));
            }

            $('#classDetailModal').modal('toggle');
        }

    },

    Application_Edit: function () {

        getNImaxHour();
        initCalendar();
        initFormValidator();

        $('#optional').qtip({
            content: {
                text: 'Please enter your National Insurance (NI) Number . If you don\'t have an NI Number, you can apply for one. You can still apply to be a lab tutor just now while your NI application is being processed'
            },
            position: {
                my: 'bottom center',
                at: 'top center'
            }
        })

        function getNImaxHour() {
            $.ajax({
                url: urlPrefix + '/Application/getNImaxHour',
                dataType: 'json',
                type: "POST",
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
                                regexp: "^[a-zA-Z]{2}[0-9]{6}[a-zA-Z]{1}$",
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
                    url: urlPrefix + '/Application/getPreference/',
                    data: {
                        studentId: $("#studentId").val(),
                        semester: 1
                    },
                },
                eventClick: eventClick
            });
        }


        $("#edit_preference_sememster1").click(function () {
            $.ajax({
                url: urlPrefix + "/Application/Update",
                type: "POST",
                traditional: true,
                data: {
                    'likedList': likedList.splice(0, likedList.length),
                    'dislikedList': dislikedList.splice(0, dislikedList.length),
                    'neutralList': neutralList.splice(0, neutralList.length),
                    'studentId': $("#studentId").val(),
                    'ni': $("#ni").val(),
                    'maxHour': $("#maxHour").val()
                },
                success: function () {
                        $('#semester_two').slideDown('slow').delay(1500).slideUp('slow');
                },
                error: function () {
                    console.log("/Application/Update error")
                }
            })
            $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Application/getPreference/')
            $('#calendar').fullCalendar('addEventSource', {
                url: urlPrefix + '/Application/getPreference/',
                data: {
                    studentId: $("#studentId").val(),
                    semester: 1
                }
            })
        });
         
        $("#edit_preference_sememster2").click(function () {
            $.ajax({
                url: urlPrefix + "/Application/Update",
                type: "POST",
                traditional: true,
                data: {
                    'likedList': likedList.splice(0, likedList.length),
                    'dislikedList': dislikedList.splice(0, dislikedList.length),
                    'neutralList': neutralList.splice(0, neutralList.length),
                    'studentId': $("#studentId").val(),
                    'ni': $("#ni").val(),
                    'maxHour': $("#maxHour").val()
                },
                success: function () {
                    $('#semester_one').slideDown('slow').delay(1500).slideUp('slow');
                },
                error: function () {
                    console.log("/Application/Update error")
                }
            })
            $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Application/getPreference/')
            $('#calendar').fullCalendar('addEventSource', {
                url: urlPrefix + '/Application/getPreference/',
                data: {
                    studentId: $("#studentId").val(),
                    semester: 2
                }
            })
        });

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

        $("#save_button").click(function (e) {
            e.preventDefault();
            $.ajax({
                url: urlPrefix + "/Application/Update",
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
                    window.location.href = urlPrefix + "/Application/Index";
                },
                error: function () {
                    //window.location.href = urlPrefix + "/Application/Index";
                    console.log("/Application/Update error")
                },
                complete: function (xhr) {
                    console.log(xhr.status)
                }
            })
        });

    },

    Lecturer_Index: function () {

        getPublishState();
        initValidator();

        function getPublishState() {
            $.ajax({
                url: urlPrefix + '/Allocate/getPublishState',
                type: 'Get',
                dataType: 'json',
                success: function (json) {
                    if (json) {
                        $(".published").show();
                        initCalendar();
                    }
                    else {
                        $(".unpublished").show();
                    }
                }
            });
        }

        //function tabChange(semester) {
        //    $('#calendar').fullCalendar('removeEventSource', urlPrefix + '/Allocate/getAllocation')
        //    $('#calendar').fullCalendar('addEventSource', {
        //        url: urlPrefix + '/Allocate/getAllocation',
        //        data: {
        //            semester: semester,
        //            studentId: -2
        //        }
        //    })
        //};

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
                eventClick: clickEvent,
                events: {
                    url: urlPrefix + '/Allocate/getAllocation',
                    data: {
                        semester: 1,
                        studentId: -2
                    },
                },
                eventRender: function (event, element) {

                    var tutors = "";
                    $.each(event.tutorName, function () {
                        tutors += this.name + ", ";
                    });
                    element.find('.fc-content').append("<tutorName>" + tutors.slice(0, -2) + "</tutorName>");
                }

            });
        }

        function clickEvent(Event) {
            $.ajax({
                url: urlPrefix + '/Lecturer/getClassInfo',
                type: 'Get',
                data: {
                    classId: Event.id
                },
                dataType: 'json',
                traditional: true,
                success: function (json) {

                    $(".modal-title").text(json.module);
                    $("degree").text(json.degree);
                    $("year").text(json.year);
                    $("semester").text(json.semester);
                    $("time").text(json.time);

                    var tbl_body = "";
                    $.each(json.tutors, function () {
                        var tbl_row = "";
                        $.each(this, function () {
                            tbl_row += "<td>" + this + "</td>";
                        })

                        tbl_body += "<tr>" + tbl_row + "</tr>";
                    });
                    $("#classDetailModal tbody").html(tbl_body);

                },
                error: function (json) { console.log("/Lecturer/getClassInfo error"); }
            });

            $('#classDetailModal').modal('toggle');

        }

        function initValidator() {

            $('#reset_password_form').bootstrapValidator({
                // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    old_password: {
                        verbose: false,
                        validators: {
                            notEmpty: {
                                message: 'Please enter your current password'
                            },
                            stringLength: {
                                min: 6,
                                message: 'Please enter at least 6 characters'
                            },
                            // The validator will create an Ajax request
                            // sending { username: 'its value' } to the back-end
                            remote: {
                                message: 'Incorrect current password',
                                url: urlPrefix + '/Lecturer/checkOldPassword',
                                delay: 500
                            }
                        }
                    },
                    new_password: {
                        verbose: false,
                        validators: {
                            notEmpty: {
                                message: 'Please enter your new password'
                            },
                            stringLength: {
                                min: 6,
                                message: 'Please enter at least 6 characters'
                            },
                            different: {
                                field: 'old_password',
                                message: 'Please enter a new password'
                            },
                            identical: {
                                field: 'confirm_password',
                                message: 'Password does not match the confirm password'
                            }
                        }
                    },
                    confirm_password: {
                        verbose: false,
                        validators: {
                            notEmpty: {
                                message: 'Please confirm your new password'
                            },
                            stringLength: {
                                min: 6,
                                message: 'Please enter at least 6 characters'
                            },
                            different: {
                                field: 'old_password',
                                message: 'The same as the current password'
                            },
                            identical: {
                                field: 'new_password',
                                message: 'Password does not match the confirm password'
                            }
                        }
                    }
                }
            });

        }

        $('#reset_password_form').submit(function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if ($('#reset_password_form').data("bootstrapValidator").isValid()) {
                $.ajax({
                    url: urlPrefix + '/Lecturer/resetPassword',
                    type: 'Post',
                    //dataType: 'json',
                    data: { new_password: $('#new_password').val() },
                    success: function (json) {
                        window.location.href = urlPrefix + "/Lecturer/Index";
                        //$('.modal-backdrop').hide();
                        //$('body').removeClass('modal-open');
                        //$('#rest_password_modal').modal('hide');
                    },
                    error: function () {
                        console.log("reset passowrd error!")
                    }
                });
            }
            else {
                $('#reset_password_form').bootstrapValidator('disableSubmitButtons', true);
            }
        });

    }

}