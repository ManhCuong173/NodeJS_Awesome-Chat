function removeContact() {
  $(".user-remove-contact").unbind('click').on('click', function () {
    let targetId = $(this).data('uid');
    let targetName = $(this).parent().find('div.user-name p').text();
    Swal.fire({
      title: `Bạn chắc chắn muốn xóa ${targetName} khỏi danh sách bạn bè`,
      text: "Bạn không thể hoàn tác lại quá trình này",
      type: "warning",
      showCancelButton:true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy bỏ"
    }).then(result => {
      if(!result.value){
        return false;
      }
      else{
        $.ajax({
          url: "/contact/remove-contact",
          type: "delete",
          data: { uid: targetId },
          success: function (data) {
            if (data.success) {
              $('#contacts').find(`ul li[data-uid = ${targetId}]`).remove();
              decreaseNumberRequest('count-contacts');      
    
              socket.emit('remove-contact', {contactId: targetId})
            }
          }
        });
      }
    });
});
}
socket.on('response-remove-contact', function (user) {
  $('#contacts').find(`ul li[data-uid = ${user.id}]`).remove();
  decreaseNumberRequest('count-contacts');
})
$(document).ready(function() {
    removeContact();
})