function typingOn(divId) {
  let targetId = $(`#write-chat-${divId}`).data('chat');

  if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-typing', { groupId: targetId });
  } else {
    socket.emit('user-is-typing', { contactId: targetId });
  };
}

function typingOff(divId) {
  let targetId = $(`#write-chat-${divId}`).data('chat');

  if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-stop-typing', { groupId: targetId });
  } else {
    socket.emit('user-is-stop-typing', { contactId: targetId });
  };
}

$(document).ready(function () {
  socket.on('response-user-is-typing', function (response) {

    let messageTyping = `<div class="bubble you bubble-typing-gif">
      <img src="/images/chat/typing_2.gif" style="width: 60px; height: 50px;"/>
    </div>`;

    if (response.currentGroupId) {
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        let check = $(`.chat[data-chat = ${response.currentGroupId}]`).find('div.bubble-typing-gif');
        if (check.length) {
          return false;
        }
        $(`.chat[data-chat = ${response.currentGroupId} ]`).append(messageTyping);
        nineScrollRight(response.currentGroupId);
      }
    } else {
      let check = $(`.chat[data-chat = ${response.currentUserId}]`).find('div.bubble-typing-gif');
      let contactName = $(`#write-chat-${response.currentUserId}`).closest(".right").find('.top>span>span').text();
      messageTyping = `<div class="bubble you bubble-typing-gif">
      <img src="/images/chat/typing_2.gif" style="width: 60px; height: 50px;"/> <span style="font-size: 12px;line-height: 60px;"><strong>${contactName}</strong> is typing...</span>
    </div>`;
      
      if (check.length) {
        return false;
      }
      $(`.chat[data-chat = ${response.currentUserId} ]`).append(messageTyping);
      nineScrollRight(response.currentUserId);
    };
  });

  socket.on('response-user-is-stop-typing', function (response) {
    if (response.currentGroupId) {
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        $(`.chat[data-chat = ${response.currentGroupId}]`).find('div.bubble-typing-gif').remove();
        nineScrollRight(response.currentGroupId);
      }
    } else {
      $(`.chat[data-chat = ${response.currentUserId}]`).find('div.bubble-typing-gif').remove();
      nineScrollRight(response.currentUserId);
    };
  });
});