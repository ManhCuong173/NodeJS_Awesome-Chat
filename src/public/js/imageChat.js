//Function to convert buffer to base64
function bufferToBase64(buffer) {
  //Vì class Buffer là một class API Built in của Nodejs, nó không hỗ trợ dùng trong file JS phía client cho nên chúng ta sữ dụng 
  // một build in method của Window xử lý dữ liệu buffer chuyển đổi thành base64
  return btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

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
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận file có kích thước bé hơn 1MB", "error", 7);
      $(this).val(null);
      return false;
    }

    //Take id of user whose send it
    let targetId = $(this).data('chat');
    let isChatGroup = false;

    let formDataToUploadImage = new FormData();
    formDataToUploadImage.append('my-image-chat', fileData);
    formDataToUploadImage.append('uid', targetId);

    //Check whether user chat in group or not
    if ($(this).hasClass('chat-in-group')) {
      formDataToUploadImage.append('isChatGroup', true);
      isChatGroup = true;
    };

    $.ajax({
      url: '/message/add-new-image',
      type: 'post',
      cache: false,
      contentType: false,
      processData: false,
      data: formDataToUploadImage,
      success: function (data) {
        let dataToEmit = {
          message: data.message
        }
        // B1: Handle sended data
        let messageOfMe = $(`<div class="bubble me convert-emoji bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        let imageChat = `<img src='data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}' class = 'show-image-chat'>`
        if (isChatGroup) {
          let senderAvatar = (`<img src='/images/users/${data.message.sender.avatar}' class='avatar-small' title='${data.message.sender.name}'>`);
          messageOfMe.html(`${senderAvatar} ${imageChat}`);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(imageChat);
          dataToEmit.contactId = targetId;
        }

        //B2: Append data to display
        $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        //B3: Remove 
        //Nothing to code because we didn't have any manipulation into input element

        //B4: Change data preview & time in left side
        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(data.message.createdAt).locale('vi').startOf('seconds').fromNow());
        $(`.person[data-chat = ${divId}]`).find('span.preview').html("Hình ảnh...");

        //B5: Move conversation to the top
        $(`.person[data-chat = ${divId}]`).on('click.moveConversationToTheTop', function () {
          //Find tag <a> which contain selector 
          let dataToMove = $(this).parent();
          //Find closest parent 'ul'
          $(this).closest('ul').prepend(dataToMove);
          //End event click with namespace 'moveConversationToTheTop'
          $(this).off('click.moveConversationToTheTop');
        });
        $(`.person[data-chat = ${divId}]`).click();

        //B6: Nothing to code

        //B7: Nothign to code

        //B8: Emit realtime send image
        socket.emit('chat-image', dataToEmit);

        //B9: Add to modal image
        //Vì dữ liệu kiểu hình ảnh khi gửi trả về là một kiểu dữ liệu dạng buffer cho nên khi gửi trả về phần data sẽ được tách thành 1 đối tượng như kiểu: 
        /*
        data: {
          data: ....,
          type: 'Buffer'
        }
        */
        let imageChatToAddModal = `<img src='data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}'>`;
        $(`#imagesModal_${divId}`).find('div.all-images').append(imageChatToAddModal);
      },
      error: function (response) {
        alertify.notify(response.responseText, 'error', 7);
      }
    })
  });

};

socket.on('response-chat-image', function (response) {
  let divId = null;

  console.log(response);
  
  // B1: Handle sended data
  let messageOfYou = $(`<div class="bubble you convert-emoji bubble-image-file" data-mess-id="${response.message._id}"></div>`);
  let imageChat = `<img src='data: ${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}' class = 'show-image-chat'>`
  if (response.currentGroupId) {
    let senderAvatar = (`<img src='/images/users/${response.message.sender.avatar}' class='avatar-small' title='${response.message.sender.name}'>`);
    messageOfYou.html(`${senderAvatar} ${imageChat}`);
    //Take divId
    divId = response.currentGroupId;
  } else {
    messageOfYou.html(imageChat);
    //Take divId
    divId = response.currentUserId;
  };

  //Click into section chat then seen message
  $(`.person[data-chat = ${divId}]`).unbind('click').on('click', function () {
    $(this).find("span.time").removeClass("message-time-realtime");
  })

  //B2: Append data to display
  if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
    $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
    nineScrollRight(divId);
    $(`.person[data-chat = ${divId}]`).find("span.time").addClass("message-time-realtime");
  }

  //B4: Change data preview & time in left side
  $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale('vi').startOf('seconds').fromNow());
  $(`.person[data-chat = ${divId}]`).find('span.preview').html("Hình ảnh...");


  //B5: Move conversation to the top
  $(`.person[data-chat = ${divId}]`).on('cuongDev.moveConversationToTheTop', function () {
    //Find tag <a> which contain selector and take it 
    let dataToMove = $(this).parent();
    //Find closest parent 'ul'
    $(this).closest('ul').prepend(dataToMove);
    //End event click with namespace 'moveConversationToTheTop'
    $(this).off('cuongDev.moveConversationToTheTop');
  });
  $(`.person[data-chat = ${divId}]`).trigger('cuongDev.moveConversationToTheTop');

  //B6: Emit realtime: Nothing to code 

  //B7: Append image to modal image
  let imageChatToAddModal = `<img src='data: ${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}'>`;
        $(`#imagesModal_${divId}`).find('div.all-images').append(imageChatToAddModal);
});
