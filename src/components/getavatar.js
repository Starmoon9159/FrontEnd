const getUserAvatar = async (UserID) => {
    try {
        const backendURL = `http://localhost:9000/api/user/${UserID}/avatar`;
        const response = await axios.get(backendURL, { responseType: 'blob' });

        if (response.status === 200) {
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            setAvatarURL(url);
            setErrorMessage('');
        } else {
            setAvatarURL('');
            setErrorMessage('找不到使用者的頭像');
        }
    } catch (error) {
        console.error('發生錯誤：', error);
        setAvatarURL('');
        setErrorMessage('發生錯誤');
    }
};

module.exports = getUserAvatar