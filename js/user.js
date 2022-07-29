//用户登录和注册的表单项的通用代码
class FieldValidator {
    constructor(txtId, validatorFun) {
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFun = validatorFun;
        this.input.onblur = () => { this.validate(); } //箭头函数中没有this，此处的this用的是外边的this
    }

    //验证 成功true/失败false：1.失去焦点时验证  
    async validate() {
        var err = await this.validatorFun(this.input.value);
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    //验证 2.点提交时验证所有框框 
    static async validate(...validators) {
        const proms = validators.map(v => v.validate()); //[Promise,Promise]
        const results = await Promise.all(proms);
        return results.every(r => r);
    }
}