$(document).ready(function() {
  $('#link-read-more-contacts').bind('click', function(){
    //Number of items want to skip
    let skipNumber = $('#contacts').find('li').length;
    $('#link-read-more-contacts').css('display', 'none');
    $('.read-more-contacts-loader div').css('display','block');

    function getContactsUser() {
      $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function(newContactsUser) {
        if(!newContactsUser.length) {
          alertify.notify("Bạn không còn bạn bè nào để xem thêm", "error", 7);
          $('#link-read-more-contacts').css('display', 'block');
          $('.read-more-contacts-loader div').css('display', 'none');
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
                        <div class="user-talk" data-uid="${user._id}">
                          Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger display_important" data-uid="${user._id}">
                          Xóa liên hệ
                        </div>
                    </div>
                  </li>`
        }
        newContactsUser.forEach(user => {
          $('#contacts').find('ul').append(templateUser(user));
        });
        removeContact();
        $('#link-read-more-contacts').css('display', 'block');
        $('.read-more-contacts-loader div').css('display', 'none');
      }); 
    }

    setTimeout(getContactsUser, 1000);
  });
});