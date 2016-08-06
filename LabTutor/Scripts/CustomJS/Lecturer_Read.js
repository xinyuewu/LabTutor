$('#add_lecturer').click(function () {
    $('#lecturerModal .modal-title').text("Add New Lecturer");
});

$('.edit_lecturer').click(function () {
    $('#lecturerModal .modal-title').text("Edit Lecturer");
});

//var urlPrefix = "/2015-msc/xinyuewu";
var urlPrefix = "";

function passLecturerId(id) {
    $('#deleteLecturer').click(function () {
        window.location = urlPrefix + "/Lecturer/Delete/?lecturerId=" + id;
    });
}