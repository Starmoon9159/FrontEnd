
const getUserAvatar = require('./getavatar')
const fetchUserData = async () => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const response = await axios.post('http://localhost:9000/api/verifyJWT', { token });
            if (response.data.data === 'success') {
                setIsLoggedIn(true);
                setUserID(response.data.user.UserID);
                setUser(response.data.user); // 更新User为用户对象

                getUserAvatar(response.data.user.UserID);
            } else {
                setIsLoggedIn(false);
                console.log('err');
            }
        } catch (error) {
            console.error('驗證令牌时发生错误:', error);
            setIsLoggedIn(false);
        }
    } else {
        setIsLoggedIn(false);
    }

};

// 调用异步函数以获取用户信息

module.exports = fetchUserData