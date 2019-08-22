let userAvatar = null;
let userInfo = {};
let avatarOrigin = null;
let originUserInfo = null;
let userUpdatedPassword = {};

function updateUserInfo(){
  $("#input-change-avatar").bind("change", function(){
    let fileData = $(this).prop("files")[0];
    let math = ["image/jpg", "image/jpeg", "image/png"];
    let limit = 108576; //Byte = 1MB

    // if($.inArray(fileData.type, math) === -1){
    //   alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận kiểu file jpg/jpeg/png", "error", 7);
    //   $(this).val(null);
    //   return false;
    // }

    // if(fileData.size>limit){
    //   alertify.notify("File không được quá lớn, chỉ cho phép dung lượng 1MB", "error", 7);
    //   $(this).val(null);
    //   return false;
    // }

    //Chỉ khi event change được gọi mới xử lý những dòng code dưới đây
    if(typeof FileReader !== 'undefined'){
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();
      let fileReader = new FileReader();
      fileReader.onload = function(element){
        $("<img>",{
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);
      
      //Tạo 1 form data gửi dữ liêu lên server qua AJAX
      let formData = new FormData();
      formData.append("avatar", fileData);
      userAvatar = formData;
    }
    else{
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error", 7);
    }
  });

  $("#input-change-username").bind("change", function(){
    let username = $(this).val();
    let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regexUsername.test(username) || username.length<3 || username.length > 17){
      alertify.notify("Usename giới hạn trong khoảng từ 3-17 kí tự và không chứa kí tự đặc biệt", "error", 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }

    userInfo.username = username;

  });

  $("#input-change-gender-male").bind("click", function(){
    let gender = $(this).val();
    if(gender !== "male"){
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = gender;
  });

  $("#input-change-gender-female").bind("click", function(){
    let gender = $(this).val();
    if(gender !== "female"){
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = gender;
  });

  $("#input-change-address").bind("change", function(){
    let address = $(this).val();
    if(address.length <3 || address.length> 30) {
      alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 kí tự", "error", 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }

    userInfo.address = address;
  });

  $("#input-change-phone").bind("change", function(){
    let phone = $(this).val();
    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
    if(!regexPhone.test(phone)){
      alertify.notify("Số điện thoại giới hạn trong khoảng 10-11 kí tự, dùng đầu số nhà mạng Việt Nam", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }

    userInfo.phone = phone;
  });

  $("#input-change-current-password").bind("change", function(){
    let currentPassword = $(this).val();
    userUpdatedPassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").bind("change", function(){
    let newPassword = $(this).val();
    // let regexNewpassword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    // if(!regexNewpassword.test(newPassword)) {
    //   alertify.notify("Mật khẩu giới hạn trong khoảng từ 3-17 kí tự và không chứa kí tự đặc biệt", "error", 7);
    //   return false;
    // }

    // if(newPassword !== $("#input-change-renew-password").val() && $("#input-change-renew-password").val() !== "") {
    //   alertify.notify("Mật khẩu nhập lại không trùng khớp với mật khẩu mới", "error", 7);
    //   return false;
    // }

    userUpdatedPassword.newPassword = newPassword;
  });
  $("#input-change-renew-password").bind("change", function(){
    let renewPassword = $(this).val();
    // if(!userUpdatedPassword.newPassword){
    //   alertify.notify("Bạn chưa nhập mật khẩu mới", "error", 7);
    //   return false;
    // }
    // if(renewPassword !== userUpdatedPassword.newPassword) {
    //   alertify.notify("Mật khẩu nhập lại không trùng khớp", "error", 7);
    //   return false;
    // }
    userUpdatedPassword.renewPassword = renewPassword;
  });
};

function callUpdateUserAvatar(){
  $.ajax({
    url: "/user/update-avatar",
    //Chuẩn restful API update data
    type: "put",
    //Với kiểu dữ liệu gửi lên là formData gửi những dữ liệu binary data thì phải để 3 trường ở dưới là false
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(result){
      //Display success
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      //update avatar navbar src 
      $("#navbar-avatar").attr("src", result.imageSrc);
      $('#user-modal-avatar').attr("src", result.imageSrc);

    },
    error: function(error){
      //Display error
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");   
    }
  });
};

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    //Chuẩn restful API update data
    type: "put",
    data: userInfo,
    success: function(result){
      //Display success
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      //Phương thức này sẽ gán dữ liệu gửi lên server (userInfo) vào biến originUserInfo
      //nếu server xử lý xong và success trả về cho client. Methods Assign được thực 
      //thi với điều kiện 2 object phải có cùng key
      originUserInfo = Object.assign(originUserInfo, userInfo);
      $('#navbar-username').text(originUserInfo.username);
      $('#input-btn-cancel-update-user').click();
    },
    error: function(error){
      //Display error
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");   
    }
  });
};

function callLogout() {
  let timeInterval;
  Swal.fire({
    position: "top-end",
    type: "success",
    title: "Your work has been saved",
    html: "Thời gian: <strong></strong>",
    showConfirmButton: true,
    timer: 6000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timeInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
      }, 1000);
    },
    onClose: () => {
      clearInterval(timeInterval);
    }
  }).then((result) => {
    $.get('/logout', () => location.reload());
  })
}

function callUpdateUserPassword(){
  $.ajax({
    url: "/user/update-password",
    //Chuẩn restful API update data
    type: "put",
    data: userUpdatedPassword,
    success: function(result){
      //Display success
      $(".user-modal-password-alert-success").find("span").text(result.message);
      $(".user-modal-password-alert-success").css("display", "block");
      $('#input-btn-cancel-update-user-password').click();

      callLogout();
    },
    error: function(error){
      //Display error
      $(".user-modal-password-alert-error").find("span").text(error.responseText);
      $(".user-modal-password-alert-error").css("display", "block");   
    }
  });
};
$("document").ready(function(){
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  }
  avatarOrigin = $('#user-modal-avatar').attr("src"); 
  //Gọi function chỉnh ảnh phía client và gán giá trị gốc váo biến userInfo
  updateUserInfo();

  //Nhận 1 sự kiện click thay đổi
  $("#input-btn-update-user").bind('click', function(){
    if($.isEmptyObject(userInfo) && userAvatar==null){
      alertify.notify("Bạn phải chỉnh sửa trước khi lưu thông tin", "error", 7);
      return false;
    }
    
    //Chỉ chỉnh ảnh
    if(userAvatar!=null){
      //Call ajax 
      callUpdateUserAvatar();
    }
    //Chỉ chỉnh thông tin text
    if(!$.isEmptyObject(userInfo)){
      callUpdateUserInfo();
    }
    
  });

  $("#input-btn-cancel-update-user").bind("click", function(){
    userAvatar = null;
    userInfo = {};
    $('#input-change-avatar').val("");
    $('#user-modal-avatar').attr("src", avatarOrigin);
    $('#input-change-username').val(originUserInfo.username);
    $('#input-change-address').val(originUserInfo.address);
    $('#input-change-phone').val(originUserInfo.phone);
    originUserInfo.gender === 'male' ? $('#input-change-gender-male').click() : $('#input-change-gender-female').click()
  });

  $("#input-btn-update-user-password").bind("click", function(){
    if($("#input-change-current-password").val() == "" || $("#input-change-new-password").val() == "" || $("#input-change-renew-password").val() == "") {
      alertify.notify("Bạn phải nhập đầy đủ thông tin", "error", 7);
      return false;
    };

    Swal.fire({
      title: "Bạn chắc chắn muốn thay đổi mật khẩu",
      text: "Bạn không thể hoàn tác lại quá trình này",
      type: "info",
      showCancelButton:true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy bỏ"
    }).then(result => {
      if(!result.value){
        return false;
      }
      callUpdateUserPassword();
    });
  });

  $("#input-btn-cancel-update-user-password").bind("click", function() {
    userUpdatedPassword = {};
    $("#input-change-current-password").val("");
    $("#input-change-new-password").val("");
    $("#input-change-renew-password").val("");
  });
});