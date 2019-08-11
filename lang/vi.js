export const transValidation = {
  email_incorrect: "Email phải có dạng example@manhcuongdev.com",
  gender_incorrect: "Đừng có nghịch tml!",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, thường, số, kí tự đặc biệt",
  password_confirmation_incorrect: "Mật khẩu không trùng. Vui lòng nhập lại"
}

export const transError = {
  account_in_use: "Email này đã được sử dụng"
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoàn <strorng> ${userEmail} </strong> đã được kích hoạt, vui lòng kiểm tra email của bạn để active`
  }

}