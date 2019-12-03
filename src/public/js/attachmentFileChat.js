function attachmentFileChat(divId) {
  $(`#attach-chat-${divId}`).unbind('change').on('change', function () {
    let fileDataAttachment = $(this).prop('files')[0];
    let limit = 108576;

    if (fileDataAttachment.size > limit) {
      alertify.notify('Kiểu file đính kèm chỉ chấp nhận dung lượng dưới 2MB', 'error', 7);
      return false;
    }

    let targetId = $(this).data('chat');
    var isChatGroup = false;

    let formDataAttachmentFile = new FormData();
    formDataAttachmentFile.append('my-attach-chat', fileDataAttachment);
    formDataAttachmentFile.append('uid', targetId);

    if ($(this).hasClass('chat-in-group')) {
      formDataAttachmentFile.append('isChatGroup', true);
      isChatGroup = true;
    }

    $.ajax({
      url: '/message/add-new-attachment-file',
      type: 'post',
      cache: false,
      contentType: false,
      processData: false,
      data: formDataAttachmentFile,
      success: function (data) {

        console.log(data.message);
        
        //Data for using realtime socket
        let dataToEmit = {
          message: data.message
        }
        // B1: Handle sended data
        let messageOfMe = $(`<div class="bubble me convert-emoji bubble-attach-file" data-mess-id="${data.message._id}"></div>`);
        let attachmentChat =
          `
        <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"
        download="${data.message.file.fileName}">
        ${data.message.file.fileName}
        </a>
        `

        if (isChatGroup) {
          let senderAvatar = (`<img src='/images/users/${data.message.sender.avatar}' class='avatar-small' title='${data.message.sender.name}'>`);
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId = targetId;
        }
        console.log(isChatGroup);
        
        console.log(dataToEmit);
        
        //B2: Append data to display
        $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        //B3: Remove 
        //Nothing to code because we didn't have any manipulation into input element

        //B4: Change data preview & time in left side
        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(data.message.createdAt).locale('vi').startOf('seconds').fromNow());
        $(`.person[data-chat = ${divId}]`).find('span.preview').html("Tệp đính kèm...");

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
        socket.emit('chat-attachment', dataToEmit);

        //B9: Add to modal image
        //Vì dữ liệu kiểu hình ảnh khi gửi trả về là một kiểu dữ liệu dạng buffer cho nên khi gửi trả về phần data sẽ được tách thành 1 đối tượng như kiểu: 
        /*
        data: {
          data: ....,
          type: 'Buffer'
        }
        */
        let attachmentChatToAddModal =
          `
        <li>
          <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"
          download="${data.message.file.fileName}">
          ${data.message.file.fileName}
          </a>
        </li>    
        `;
        $(`#attachsModal_${divId}`).find('ul.list-attachs').append(attachmentChatToAddModal);

      },
      error: function (response) {
        alertify.notify(response.responseText, 'error', 7);
      }
    })
  });
}

socket.on('response-chat-attachment', function (response) {
  
  let divId = null;
  
  // B1: Handle sended data
  let messageOfYou = $(`<div class="bubble you convert-emoji bubble-attach-file" data-mess-id="${response.message._id}"></div>`);
  let attachmentChat = `
    <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"
    download="${response.message.file.fileName}">
    ${response.message.file.fileName}
    </a>
  `
  if (response.currentGroupId) {
    let senderAvatar = (`<img src='/images/users/${response.message.sender.avatar}' class='avatar-small' title='${response.message.sender.name}'>`);
    messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
    //Take divId
    divId = response.currentGroupId;
  } else {
    messageOfYou.html(attachmentChat);
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
  $(`.person[data-chat = ${divId}]`).find('span.preview').html("Tài liệu...");


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

  //B7: Append attachment file to modal image
  let attachmentChatToAddModal =
          `
        <li>
          <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"
          download="${response.message.file.fileName}">
          ${response.message.file.fileName}
          </a>
        </li>    
        `;
        $(`#attachsModal_${divId}`).find('ul.list-attachs').append(attachmentChatToAddModal);

  
});