function removeRequestContactReceived() {
  $(".user-reject-request-contact-received").unbind('click').on('click', function () {
    let targetId = $(this).data('uid');
    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {
          
          //Trong trường hợp mình, mình chưa muốn làm 
          // $('.noti_content').find(`div[data-uid = "${user.id}"]`).remove();//Removing at popup notif
          // $('ul.list-notifications').find(`li>div[data-uid= "${user.id}"]`).parent().remove();//Removing notif into extra-viewing-notifications-area

          decreaseNumberNotification('noti_contact_counter', 1);
          decreaseNumberRequest("count-request-contact-received");

          $('#request-contact-received').find(`li[data-uid= ${targetId}]`).remove();
          socket.emit("remove-request-contact-received", { contactId: targetId });
        }
      }
    });
  });
};

socket.on("response-remove-request-contact-received", function (user) {
  $("#find-user").find(`.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
  $("#find-user").find(`.user-add-new-contact[data-uid = ${user.id}]`).css('display', 'inline-block');

  decreaseNumberRequest('count-request-contact-sent');

  //Xóa ở modal tab đang chờ xác nhận
  $('#request-contact-sent').find(`li[data-uid=${user.id}]`).remove();

  decreaseNumberNotification('noti_contact_counter', 1);
  decreaseNumberNotification('noti_counter', 1);
});

$(document).ready(function() {
  removeRequestContactReceived();
});