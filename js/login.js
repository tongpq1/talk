var loginIdValidator = new FieldValidator('txtLoginId', async function(value) {
    if (!value) {
        return '请填写账号';
    }
});

const form = $('.user-form');

var loginPwdValidator = new FieldValidator('txtLoginPwd', async function(value) {
    if (!value) {
        return '请填写密码';
    }
});

form.onsubmit = async function(e) {
    e.preventDefault();
    const result = await FieldValidator.validate(
        loginIdValidator,
        loginPwdValidator
    );
    if (!result) {
        return;
    }
    const formData = new FormData(form); //可以拿到表单form里的所有有name属性的信息
    const data = Object.fromEntries(formData.entries()); //把数组变成对象
    const resp = await API.login(data);
    if (resp.code === 0) {
        alert('登录成功，点击确定，跳转到聊天页面');
        // location.href = 'http://localhost:8080/10.%20%E8%81%8A%E5%A4%A9%E6%9C%BA%E5%99%A8%E4%BA%BA_%E6%8E%A5%E5%8F%A3%E5%B0%81%E8%A3%85/homework/index.html';
        location.href = 'index.html';
    } else {
        loginIdValidator.p.innerText = '账号或密码错误';
        loginPwdValidator.innerText = '';
    }
}