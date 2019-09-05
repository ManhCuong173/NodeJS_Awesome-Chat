function callFindUsers() {
  let keyword = $("#input-find-user-contact").val();
  let regexUsername = new RegExp(/^[\sb0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
  if(keyword === ""){
    $('#find-user ul li').remove();
    return false;
  }
  if(!regexUsername.test(keyword)){
      alertify.notify("Lỗi tìm kiếm! Không chấp nhận những kí tự đặc biệt", "error", 7);
      return false;
  }
  $.get(`/contact/find-users/${keyword}`, function(data) {
    $('#find-user ul').html(data);
    addContact();//js/addContact.js
    removeRequestContactSent(); //js/removeRequestContact.js
  });
};

$(document).ready(function(){
  $("#input-find-user-contact").bind('input', callFindUsers);
  $('#btn-find-user-contact').bind('click', callFindUsers);
});