var loginIdValidator = new FieldValidator('txtLoginId', async function(value) {
    if (!value) {
        return '请填写账号';
    }
    if (value) {
        //验证账号名是否已被占用
        const end = await API.verify(value);
        if (end.data) {
            return '此账号名已被注册，请重新输入';
        }
    }
});

var nicknameValidator = new FieldValidator('txtNickname', async function(value) {
    if (!value) {
        return '请填写昵称';
    }
});

var loginPwdValidator = new FieldValidator('txtLoginPwd', async function(value) {
    if (!value) {
        return '请填写密码';
    }
});

var loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', async function(value) {
    if (!value) {
        return '请填写密码';
    }
    if (value !== loginPwdValidator.input.value) {
        return '两次密码填写不一致';
    }
});

const form = $('.user-form');
form.onsubmit = async function(e) {
    e.preventDefault();
    const result = await FieldValidator.validate(
        loginIdValidator,
        nicknameValidator,
        loginPwdValidator,
        loginPwdConfirmValidator
    );
    if (!result) {
        return;
    }
    const formData = new FormData(form); //可以拿到表单form里的所有有name属性的信息
    const data = Object.fromEntries(formData.entries()); //把数组变成对象
    const resp = await API.reg(data);
    if (resp.code === 0) {
        alert('注册成功，点击确定，跳转到登录页面');
        // location.href = 'http://localhost:8080/10.%20%E8%81%8A%E5%A4%A9%E6%9C%BA%E5%99%A8%E4%BA%BA_%E6%8E%A5%E5%8F%A3%E5%B0%81%E8%A3%85/homework/login.html';
        location.href = 'login.html';
    }
}