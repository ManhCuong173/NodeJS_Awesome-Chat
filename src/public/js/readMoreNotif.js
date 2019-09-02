$(document).ready(function() {
  $('#link-read-more-notif').bind('click', function(){
    //Number of items want to skip
    let skipNumber = $('ul.list-notifications').find('li').length;
    $('#link-read-more-notif').css('display', 'none');
    $('.read-more-notif-loader div').css('display','block');

    function getNotif() {
      $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications) {
        if(!notifications.length) {
          alertify.notify("Bạn không còn thông báo nào để xem thêm", "error", 7);
          $('#link-read-more-notif').css('display', 'block');
          $('.read-more-notif-loader div').css('display', 'none');
          return false;
        }
        notifications.forEach(notification => {
          $('ul.list-notifications').append(`<li>${notification}</li>`);
        });
        $('#link-read-more-notif').css('display', 'block');
        $('.read-more-notif-loader div').css('display', 'none');
      }); 
    }

    setTimeout(getNotif, 1000);
  });
});