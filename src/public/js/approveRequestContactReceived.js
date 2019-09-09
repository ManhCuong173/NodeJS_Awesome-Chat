function approveRequestContactReceived() {
  $(".user-accept-contact-received").unbind('click').on('click', function () {
    let targetId = $(this).data('uid');
    $.ajax({
      url: "/contact/approve-request-contact-received",
      type: "put",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {
          //DOM for getting li element
          let userInfo = $('#request-contact-received').find(`ul li[data-uid = ${targetId}]`);
          $(userInfo).find('div.user-accept-contact-received').remove();
          $(userInfo).find('div.user-reject-request-contact-received').remove();
          $(userInfo).find('div.contactPanel')
            .append(
              `<div class='user-talk' data-uid= '${targetId}' >
                Trò chuyện
              </div>
              <div class= 'user-remove-contact action-danger' data-uid= '${targetId}'>
                Xóa liên hệ
              </div>
              `
            );
          let userInfoHTML = userInfo.get(0).outerHTML;
          $('#contacts').find('ul').prepend(userInfoHTML);
          $(userInfo).remove();
          removeContact();         
          decreaseNumberRequest('count-request-contact-received');
          increaseNumberRequest("count-contacts");
          decreaseNumberNotification('noti_contact_counter', 1);       

          socket.emit('approve-request-contact-received', {contactId: targetId})
        }
      }
    });
  });
};

socket.on("response-approve-request-contact-received", function (user) {
  let notif =   `<div class='notif_readed_false' data-uid="${ user.id }">
                <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
                <strong>${user.username}</strong> Đã chấp nhận lời mời kết bạn!
                </div>`;
  $('.noti_content').prepend(notif);//Adding at pop up notif
  $('ul.list-notifications').prepend(`<li>${notif}</li>`)//Adding notif into extra-viewing-notifications-area
  
  //Giảm thông báo thêm bạn và tăng thông báo thông thường
  decreaseNumberNotification('noti_contact_counter', 1);
  increaseNumberNotification('noti_counter', 1);

  //Giảm số lượng bạn đang chờ thêm và tăng số lượng bạn trong danh bạ
  decreaseNumberRequest('count-request-contact-sent');
  increaseNumberRequest('count-contacts');

  //Quăng template qua tab bạn bè
  $('#request-contact-sent').find(`ul li[data-uid = ${user.id}]`).remove();
  let userInfoHTML = `
                    <li class="_contactList" data-uid="${user.id}">
                    <div class="contactPanel">
                      <div class="user-avatar">
                          <img src="images/users/${user.avatar}" alt="">
                      </div>
                      <div class="user-name">
                          <p>
                          ${user.username}
                          </p>
                      </div>
                      <br>
                      <div class="user-address">
                          <span>${user.address}</span>
                      </div>
                      <div class="user-talk" data-uid="${user.id}">
                          Trò chuyện
                      </div>
                      <div class="user-remove-contact action-danger" data-uid="${user.id}">
                          Xóa liên hệ
                      </div>
                    </div>
                  </li>
  `;

  $('#contacts').find('ul').prepend(userInfoHTML);
  removeContact();
  $('#find-user').find(`ul li[data-uid = ${user.id}]`).remove();
});

$(document).ready(function() {
  approveRequestContactReceived();
});