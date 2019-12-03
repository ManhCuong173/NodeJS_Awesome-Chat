export const transValidation = {
  email_incorrect: "Email phải có dạng example@manhcuongdev.com",
  gender_incorrect: "Đừng có nghịch tml!",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, thường, số, kí tự đặc biệt",
  password_confirmation_incorrect: "Mật khẩu không trùng. Vui lòng nhập lại",
  update_username:"Usename giới hạn trong khoảng từ 3-17 kí tự và không chứa kí tự đặc biệt",
  update_gender:"Dữ liệu gốc có vấn đề",
  update_address:"Địa chỉ giới hạn trong khoảng 3-30 kí tự",
  update_phone:"Số điện thoại giới hạn trong khoảng 10-11 kí tự, dùng đầu số nhà mạng Việt Nam",
  search_contact_incorrect: "Lỗi từ khóa tìm kiếm, không cho phép nhập ký tự đặc biệt",
  message_text_emoji_incorrect: "Tin nhắn không hợp lệ! "
}

export const transError = {
  account_in_use: "Email này đã được sử dụng",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống, nếu tin rằng đây là sự hiểu nhầm vui lòng liên hệ bộ phận tư vấn của chúng tôi. Xin chân thành cảm ơn",
  account_not_active: "Tài khoản này đã được đăng ký nhưng chưa kích hoạt. Vui lòng kiểm tra email của bạn để xác nhận kích hoạt. Xin cảm ơn",
  account_undefined: "Tài khoản không tổn tại",
  token_undefined: "Token không tồn tại",
  login_failed: "Sai tài khoản hoặc mật khẩu" ,
  server_error: "Lỗi từ phía server. Bạn đăng nhập lại một lần nữa",
  avatar_type: "Kiểu file không hợp lệ, chỉ chấp nhận kiểu file png, jpg, jpeg",
  avatar_size: "Ảnh upload chỉ tối đa cho phép 1MB",
  user_current_password_failed: "Mật khẩu hiện tại không chính xác",
  conversation_not_founded: "Không tìm thấy cuộc trò chuyện này",
  image_message_type: "Kiểu file không hợp lệ, chỉ chấp nhận kiểu file png, jpg, jpeg",
  image_message_size: "Ảnh upload chỉ tối đa cho phép 1MB",
  attachment_message_size: "File upload chỉ tối đa cho phép 2MB"
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được kích hoạt, vui lòng kiểm tra email của bạn để active`
  },
  account_actived: "Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng",
  login_success: (username) => {
    return `Xin chào <h2><strong>${username}</strong></h2>`;
  },
  logout_success: "Đăng xuất thành công",
  user_info_updated: "Thay đổi thông tin thành công",
  user_password_updated: "Thay đổi thông tin mật khẩu thành công"
};

export const transMail = {
  subject: "Chatvn Application: Xác nhận kích hoạt tài khoản",
  template: (linkVerify) => {
    return `
      <h2>Bạn nhận được email này vì đã đuọc kích hoạt tài khoản trên ứng dụng Chatvn Application</h2>
      <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản</h3>
      <h3><a href='${linkVerify}' target='blank'>${linkVerify}</a></h3>
      <h4>Nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó. Trân trọng cảm ơn</h4>
          `
  },
  send_failed: "Có lỗi trong quá trình gửi email, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi"
};
