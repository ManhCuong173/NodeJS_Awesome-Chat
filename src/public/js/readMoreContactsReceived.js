$(document).ready(function () {
  $('#link-read-more-contacts-received').bind('click', function () {
    //Number of items want to skip
    let skipNumber = $('#request-contact-received').find('li').length;
    $('#link-read-more-contacts-received').css('display', 'none');
    $('.read-more-contacts-received-loader div').css('display', 'block');

    function getContactsUser() {
      $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`, function (newContactsUser) {
        if (!newContactsUser.length) {
          alertify.notify("Bạn không còn bạn bè nào để xem thêm", "error", 7);
          $('#link-read-more-contacts-received').css('display', 'block');
          $('.read-more-contacts-received-loader div').css('display', 'none');
          return false;
        }
        function templateUser(user) {
          return `<li class="_contactList" data-uid="${user._id}">
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
                        <div class="user-acccept-contact-received" data-uid="${user._id}">
                            Chấp nhận
                        </div>
                        <div class="user-reject-request-contact-received action-danger"
                          data-uid="${user._id}">
                          Xóa yêu cầu
                        </div>
                    </div>
                  </li>`
        }
        newContactsUser.forEach(user => {
          $('#request-contact-received').find('ul').append(templateUser(user));
        });
        $('#link-read-more-contacts-received').css('display', 'block');
        $('.read-more-contacts-received-loader div').css('display', 'none');
      });
    }

    setTimeout(getContactsUser, 1000);
  });
});