//验证有没有登录，如果有登录，获取到用户相关信息；如果没登录，跳转到登录页面
(async function() {
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        //未登录
        alert("未登录或登录已过期");
        // location.href = "/10.%20聊天机器人_接口封装/homework/login.html";
        location.href = "login.html";
        return;
    }
    const doms = {
        aside: {
            nickname: $("#nickname"),
            loginId: $("#loginId"),
        },
        close: $(".close"),
        main: {
            chatContainer: $(".chat-container"),
        },
        msgContainer: {
            formMsg: $(".msg-container"),
            txtMsg: $("#txtMsg"),
        },
    };

    //下面的代码一定是登录状态
    //设置用户信息
    setUserInfo();

    //点击❌，关闭页面
    doms.close.onclick = function() {
        API.loginOut(); //删掉token
        // location.href =
        //     "/10.%20%E8%81%8A%E5%A4%A9%E6%9C%BA%E5%99%A8%E4%BA%BA_%E6%8E%A5%E5%8F%A3%E5%B0%81%E8%A3%85/homework/login.html"; //回到登录页面
        location.href = "login.html";
    };

    //获取历史记录
    const chatHistory = await API.getHistory();
    for (const item of chatHistory.data) {
        addChat(item);
    }

    //聊天记录的滚动条滚到底部
    scrollBottom();

    //为表单添加提交事件，发送聊天消息
    doms.msgContainer.formMsg.addEventListener("submit", function(e) {
        e.preventDefault();
        sendChat();
    });

    //函数
    function setUserInfo() {
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    }

    function addChat(data) {
        //添加聊天记录到页面
        const chatItem = $$$("div");
        chatItem.classList.add("chat-item");
        if (data.from) {
            chatItem.classList.add("me");
        }

        const img = $$$("img");
        img.classList.add("chat-avatar");
        img.src = data.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

        const chatContent = $$$("div");
        chatContent.classList.add("chat-content");
        chatContent.innerText = data.content;

        const chatTime = $$$("div");
        chatTime.classList.add("chat-date");
        chatTime.innerText = format(data.createdAt);

        doms.main.chatContainer.appendChild(chatItem);
        chatItem.appendChild(img);
        chatItem.appendChild(chatContent);
        chatItem.appendChild(chatTime);
    }

    function format(timeStamp) {
        const date = new Date(timeStamp);
        const year = date.getFullYear(); //哪年
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); //哪月
        const day = date.getDate(); //getDate()哪日 getDay()星期
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        const second = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    function scrollBottom() {
        doms.main.chatContainer.scrollTop = doms.main.chatContainer.scrollHeight;
    }

    async function sendChat() {
        //将我的消息添加到页面上，并将收到的回复添加到页面上
        const content = txtMsg.value;
        if (!content) {
            return; //如果没有输入内容，则返回
        }
        addChat({
            content,
            createdAt: Date.now(),
            from: user.loginId,
        });
        scrollBottom();
        txtMsg.value = "";
        const resp = await API.sendChat(content + "");
        addChat(resp.data);
        scrollBottom();
    }
})();