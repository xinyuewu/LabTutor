$(document).ready(function () {
    $('[title!=""]').qtip({
        position: {
            my: 'bottom center',
            at: 'top center'
        }
    });
});

$('.modal-dialog').draggable({
      //handle: ".modal-header"
});

