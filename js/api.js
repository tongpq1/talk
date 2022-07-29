var API = (function() {
    const BASE_URL = 'https://study.duyiedu.com'; //全局常量的所有字母都大写
    const TOKEN_KEY = 'token';

    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            method: 'GET',
            headers,
        });
    }

    function post(path, bodyObj) {
        const headers = {
            'content-type': 'application/json',
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj),
        });
    }

    //注册账号
    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo);
        const body = await resp.json();
        return body;
    }

    //登录
    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo);
        const body = await resp.json();
        //如果登录成功，则把令牌保存起来
        if (body.code === 0) {
            const token = resp.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }
        return body;
    }

    //验证
    async function verify(loginId) {
        const resp = await get('/api/user/exists?loginId=' + loginId);
        const body = await resp.json();
        return body;
    }


    //当前登陆的用户信息
    async function profile() {
        const resp = await get('/api/user/profile');
        const body = await resp.json();
        return body;
    }

    //发送消息
    async function sendChat(content) {
        const resp = await post('/api/chat', { content });
        const body = await resp.json();
        return body;
    }

    //获取聊天记录
    async function getHistory() {
        const resp = await get('/api/chat/history');
        const body = await resp.json();
        return body;
    }

    //退出登录
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        reg,
        login,
        verify,
        profile,
        sendChat,
        getHistory,
        loginOut,
    }
})()