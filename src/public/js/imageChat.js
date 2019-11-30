function imageChat(divId) {

  $(`#image-chat-${divId}`).unbind('change').on('change', function () {
    let fileData = $(this).prop("files")[0];
    let math = ["image/jpg", "image/jpeg", "image/png"];
    let limit = 108576; //Byte = 1MB

    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận kiểu file jpg/jpeg/png", "error", 7);
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận kiểu file jpg/jpeg/png", "error", 7);
      $(this).val(null);
      return false;
    }

    //Take id of user whose send it
    let targetId = $(this).data('chat');

    let formDataToUploadImage = new FormData();
    formDataToUploadImage.append('my-image-chat', fileData);
    formDataToUploadImage.append('uid', targetId);

    //Check whether user chat in group or not
    if ($(this).hasClass('chat-in-group')) {
      formDataToUploadImage.append('isChatGroup', true);
    };

    $.ajax({
      url: '/message/add-new-image', 
      type: 'post',
      cache: false, 
      contentType: false,
      processData: false, 
      data: formDataToUploadImage,
      success: function(data) {
        console.log(data)
      },
      error: function(error) {
        alertify.notify(error.responseText, 'error', 7);
      }
    })
  });

}