function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: '/notification/mark-all-as-read',
    type: 'put',
    data: {
      targetUsers: targetUsers 
    },
    success: function(result) {
      if(result) {
        targetUsers.forEach(uid => {
          $(`.notif_readed_false[data-uid= ${uid}]`).removeClass('notif_readed_false');
        });
        decreaseNumberNotification('noti_counter', targetUsers.length);
      }
    }
  });
}

$(document).ready(function() {
  //Popup get notifications
  $('#popup-mark-notif-as-read').bind('click', function () {
    let targetUser = [];
    $(".noti_content").find('.notif_readed_false').each(function(index, notification) {
      targetUser.push($(notification).data('uid'));
    });
    if(!targetUser.length) {
      alertify.notify("Bạn không còn thông báo nào để đọc", 'error', 7);
    }
    //Exec mark notification as read
    markNotificationsAsRead(targetUser);
  });

  //Modal get notifications
  $('#modal-mark-notif-as-read').bind('click', function () {
    let targetUser = [];
    $("ul.list-notifications").find('li>div.notif_readed_false').each(function(index, notification) {
      targetUser.push($(notification).data('uid'));
    });    
    if(!targetUser.length) {
      alertify.notify("Bạn không còn thông báo nào để đọc", 'error', 7);
    }
    //Exec mark notification as read
    markNotificationsAsRead(targetUser);
  });
});