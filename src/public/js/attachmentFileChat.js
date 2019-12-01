function attachmentFileChat(divId) {
  $(`#attach-chat-${divId}`).unbind('change').on('change', function() {
    let fileDataAttachment = $(this).props('files')[0];
    let limit = 108576;

    if(fileDataAttachment.size > limit) {
      alertify.notify('Kiểu file đính kèm chỉ chấp nhận dung lượng dưới 1MB', 'error', 7);
      $(this).value(null);
      return false;
    }

    let targetId = $(this).data('chat');
    let isChatGroup = false;
    
    let formDataAttachmentFile = new FormData();
    formDataAttachmentFile.append('my-attach-chat', fileDataAttachment);
    formDataAttachmentFile.append('uid', targetId);

    if($(this).hasClass('chat-in-group')) {
      formDataAttachmentFile.append('isChatGroup', true);
      isChatGroup = true;
    }

    $.ajax({
      url: '/message/add-new-attachment-file',
      type: 'post',
      cache: false,
      contentType: false,
      processData: false,
      data: formDataToUploadImage,
      success: function (data) {
        // let dataToEmit = {
        //   message: data.message
        // }
        // // B1: Handle sended data
        // let messageOfMe = $(`<div class="bubble me convert-emoji bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        // let imageChat = `<img src='data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}' class = 'show-image-chat'>`
        // if (isChatGroup) {
        //   let senderAvatar = (`<img src='/images/users/${data.message.sender.avatar}' class='avatar-small' title='${data.message.sender.name}'>`);
        //   messageOfMe.html(`${senderAvatar} ${imageChat}`);
        //   dataToEmit.groupId = targetId;
        // } else {
        //   messageOfMe.html(imageChat);
        //   dataToEmit.contactId = targetId;
        // }

        // //B2: Append data to display
        // $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
        // nineScrollRight(divId);

        // //B3: Remove 
        // //Nothing to code because we didn't have any manipulation into input element

        // //B4: Change data preview & time in left side
        // $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(data.message.createdAt).locale('vi').startOf('seconds').fromNow());
        // $(`.person[data-chat = ${divId}]`).find('span.preview').html("Hình ảnh...");

        // //B5: Move conversation to the top
        // $(`.person[data-chat = ${divId}]`).on('click.moveConversationToTheTop', function () {
        //   //Find tag <a> which contain selector 
        //   let dataToMove = $(this).parent();
        //   //Find closest parent 'ul'
        //   $(this).closest('ul').prepend(dataToMove);
        //   //End event click with namespace 'moveConversationToTheTop'
        //   $(this).off('click.moveConversationToTheTop');
        // });
        // $(`.person[data-chat = ${divId}]`).click();

        // //B6: Nothing to code

        // //B7: Nothign to code

        // //B8: Emit realtime send image
        // socket.emit('chat-image', dataToEmit);

        // //B9: Add to modal image
        // //Vì dữ liệu kiểu hình ảnh khi gửi trả về là một kiểu dữ liệu dạng buffer cho nên khi gửi trả về phần data sẽ được tách thành 1 đối tượng như kiểu: 
        // /*
        // data: {
        //   data: ....,
        //   type: 'Buffer'
        // }
        // */
        // let imageChatToAddModal = `<img src='data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}'>`;
        // $(`#imagesModal_${divId}`).find('div.all-images').append(imageChatToAddModal);
        console.log(data);
        
      },
      error: function (response) {
        alertify.notify(response.responseText, 'error', 7);
      }
    })
  });
}