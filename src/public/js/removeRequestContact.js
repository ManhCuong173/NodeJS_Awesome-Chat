function removeRequestContact() {
  $(".user-remove-request-contact").bind('click', function(){
    let targetId = $(this).data('uid');
    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) {
          $("#find-user").find(`.user-remove-request-contact[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`.user-add-new-contact[data-uid = ${targetId}]`).css('display', 'inline-block');
          decreaseNumberRequest("count-request-contact-sent");
          socket.emit("remove-request-contact", {contactId: targetId});
        }
      }
    });
  });
};

socket.on("response-remove-request-contact", function(user) {
  $('.noti_content').find(`div[data-uid = "${user.id}"]`).remove();//Removing at popup notif
  $('ul.list-notifications').find(`li>div[data-uid= "${user.id}"]`).parent().remove();//Removing notif into extra-viewing-notifications-area

  decreaseNumberRequest('count-request-contact-received');

  decreaseNumberNotification('noti_contact_counter', 1);
  decreaseNumberNotification('noti_counter', 1);
});