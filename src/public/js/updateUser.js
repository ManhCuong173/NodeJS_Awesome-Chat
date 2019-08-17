let userAvatar = null;
let userInfo = {};
let avatarOrigin = null;

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
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function(){
    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function(){
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function(){
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function(){
    userInfo.phone = $(this).val();
  });
};



$("document").ready(function(){
  avatarOrigin = $('#user-modal-avatar').attr("src"); 
  updateUserInfo();
  
  //Nhận 1 sự kiện click thay đổi ảnh 
  $("#input-btn-update-user").bind('click', function(){
    if($.isEmptyObject(userInfo) && userAvatar==null){
      alertify.notify("Bạn phải chỉnh sửa trước khi lưu thông tin", "error", 7);
      return false;
    }
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
        
      },
      error: function(error){
        //Display error
        $(".user-modal-alert-error").find("span").text(error.responseText);
        $(".user-modal-alert-error").css("display", "block");
      }
    });
  });

  $("#input-btn-cancel-update-user").bind("click", function(){
    userAvatar = null;
    userInfo = {};
    $('#user-modal-avatar').attr("src", avatarOrigin);
  });
});