function textAndEmojiChat(divId) {

  $('.emojionearea').unbind('keyup').on('keyup', function (element) {
    let currentEmojioneArea = $(this);
    $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-realtime");
    if (element.which == 13) {
      let targetId = $(`#write-chat-${divId}`).data('chat');
      let messageVal = $(`#write-chat-${divId}`).val();

      //Prevent not have any keyword sended
      if (!messageVal.length) {
        return false;
      }

      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };

      if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
        dataTextEmojiForSend.isChatGroup = true;
      };

      $.post('/message/add-new-text-emoji', dataTextEmojiForSend, function (data) {
        
        let dataToEmit = {
          message: data.message
        }
        // B1: Handle sended data
        let messageOfMe = $(`<div class="bubble me convert-emoji" data-mess-id="${data.message._id}"></div>`);
        let convertEmojiMessages = emojione.toImage(data.message.text);
        if (dataTextEmojiForSend.isChatGroup) {
          let senderAvatar = (`<img src='/images/users/${data.message.sender.avatar}' class='avatar-small' title='${data.message.sender.name}'>`);
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessages}`);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(convertEmojiMessages);
          dataToEmit.contactId = targetId;
        }

        //B2: Append data to display
        $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        //B3: Remove 
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find('.emojionearea-editor').text("");

        //B4: Change data preview & time in left side
        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(data.message.createdAt).locale('vi').startOf('seconds').fromNow());
        $(`.person[data-chat = ${divId}]`).find('span.preview').html(emojione.toImage(data.message.text));


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

        //B6: Handle realtime chat text
          socket.emit('chat-text-emoji', dataToEmit);

        //B7: Handle stop typing effect
        socket.emit('user-is-stop-typing', dataToEmit);
        
      }).fail(function (response) {
        alertify.notify(response.responseText, 'error', 7);
      });
    }
  });
}

socket.on('response-chat-text-emoji', function (response) {

  let divId = null;
  
  // B1: Handle sended data
  let messageOfYou = $(`<div class="bubble you convert-emoji" data-mess-id="${response.message._id}"></div>`);
  let convertEmojiMessages = emojione.toImage(response.message.text);
  if (response.currentGroupId) {
    let senderAvatar = (`<img src='/images/users/${response.message.sender.avatar}' class='avatar-small' title='${response.message.sender.name}'>`);
    messageOfYou.html(`${senderAvatar} ${convertEmojiMessages}`);
    //Take divId
    divId = response.currentGroupId;
  } else {
    messageOfYou.html(convertEmojiMessages);
    //Take divId
    divId = response.currentUserId;
  };

    //Click into section chat then seen message
    $(`.person[data-chat = ${divId}]`).unbind('click').on('click', function() {
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
  $(`.person[data-chat = ${divId}]`).find('span.preview').html(emojione.toImage(response.message.text));


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
})