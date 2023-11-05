const post = async () => {
    if (isLoggedIn) {

        var title = prompt('請輸入你的標題');
        const postData = {
            title: title,
            tag: tag,
            author: User.username, // 请将其替换为实际的用户名
            content: html,
        };


        await axios.post('http://localhost:9000/api/create-post', postData);
        window.location.href = '/article';
    } else {
        alert('你必須先登入帳號!' + userID)
    }
}
module.exports = post