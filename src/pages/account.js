import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/account.css';
import Layout from '@theme/Layout';
import "./css/button2.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Account = () => {
    const [userID, setUserID] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [User, setUser] = useState(''); // 初始化为空字符串
    const [avatarURL, setAvatarURL] = useState('');
    const [html, setHtml] = useState('');
    const [password, setPassword] = useState('');
    const [R_password, setR_Password] = useState('');
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const [newAvatar, setNewAvatar] = useState(null);
    const [newBio, setNewBio] = useState(''); // 新的自我介绍
    const [old_username, setold_username] = useState('')
    const error_toast = (message) => toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const success_toast = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    useEffect(() => {
        const fetchUserBio = async () => {
            try {
                const response = await axios.get('http://localhost:9000/api/user/' + userID + '/bio');
                if (response.data.bio) {
                    setBio(response.data.bio);
                }
            } catch (error) {
                console.error('獲取個人介紹時發生錯誤:', error);
            }
        };

        fetchUserBio();
    }, [userID]);
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await axios.post('http://localhost:9000/api/verifyJWT', { token });
                    if (response.data.data === 'success') {
                        setIsLoggedIn(true);
                        setUserID(response.data.user.UserID);
                        setUser(response.data.user);
                        setold_username(response.data.user.username)
                        getUserAvatar(response.data.user.UserID);
                    } else {
                        setIsLoggedIn(false);
                    }
                } catch (error) {
                    console.error('驗證令牌時發生錯誤:', error);
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        fetchUserData();
    }, []);

    const getUserAvatar = async (UserID) => {
        try {
            const backendURL = `http://localhost:9000/api/getUserAvatar?ID=${UserID}`;
            const response = await axios.get(backendURL);

            if (response.status === 200) {
                setAvatarURL(response.data.avatar);
                console.log(response.data.avatar)
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

    const handleAvatarChange = async (e) => {
        // 获取用户选择的头像文件
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        // 创建一个 FormData 对象，用于上传文件
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            // 发送 POST 请求将头像上传到后端的 /api/user/UserID/Cavatar 路由
            const response = await fetch(`http://localhost:9000/api/user/${userID}/Cavatar`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                success_toast('頭像上傳成功!');
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
            } else {
                // 上传失败，处理失败逻辑
                error_toast('頭像上傳失敗');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveChanges = async () => {
        if (!userID) return error_toast('尚未登入');

        try {
            if (username.trim() !== '') {
                const response = await axios.post('http://localhost:9000/api/change-username', {
                    userID: userID,
                    newUsername: username,
                });

                if (response.data.message === 'done') {
                    // 使用者名稱更改成功
                    success_toast('使用者名稱更改成功');
                } else if (response.data.message === 'replace') {
                    error_toast('使用者名稱已存在，請嘗試其他使用者名稱');
                    // 這裡可以進行其他處理，比如清空輸入框
                } else {
                    // 其他錯誤情況
                    error_toast('更改使用者名稱時發生錯誤');
                }
            }

            if (password) {
                const response = await fetch('http://localhost:9000/api/changePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userID, password }),
                });

                if (response.ok) {
                    success_toast('密碼已成功更改');
                } else {
                    error_toast('無法更改密碼');
                }
            }

            if (newBio) {
                const response = await axios.post('http://localhost:9000/api/update-bio', {
                    userID: userID,
                    bio: newBio,
                });

                if (response.data.message === 'done') {
                    // 自我介绍更新成功
                    success_toast('自我介绍已更新');
                } else {
                    // 其他错误情况
                    error_toast('請求時發生了錯誤');
                }
            }
        } catch (error) {
            console.error('請求時發生錯誤:', error);
            error_toast('請求時發生了錯誤');
            // 這裡可以進行其他處理
        }
        if (password) {
            try {
                const response = await fetch('http://localhost:9000/api/changePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userID, password }),
                });

                if (response.ok) {
                    success_toast('密碼已成功更改');
                } else {
                    error_toast('無法更改密碼');
                }
            } catch (error) {
                console.log('發生錯誤：' + error.message);
            }
        }

    };
    const handleLogout = async () => {
        localStorage.removeItem('token')
        success_toast('成功登出')
        setTimeout(() => {
            window.location='/article'
        }, 2000);
      };
    return (
        <div>
            <Layout>
                <ToastContainer position="top-right" theme="dark" />
                <div style={{ color: 'black' }} className="goback" onClick={() => window.history.back()}>
                    <a className="btn">
                        返回上一頁
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                    </a>
                </div>
                {isLoggedIn ? (
                    <div className="account-container">
                        <a onClick={handleLogout}className="myButton">登出</a>
                        <h2>個人資料</h2>
                        <div className="avatar-container">
                            <img src={avatarURL} alt="使用者頭像" />
                            <input type="file" accept="image/*" onChange={handleAvatarChange} />
                        </div>
                        <div className="form-container">
                            <label>使用者名稱：
                                <input type="text" placeholder={old_username} onChange={(e) => setUsername(e.target.value)} />
                            </label>
                            <label>新密碼：
                                <input type="password" placeholder={password} value={password} onChange={(e) => setPassword(e.target.value)} />
                            </label>
                            <label>確認密碼：
                                <input type="password" value={R_password} onChange={(e) => setR_Password(e.target.value)} />
                            </label>
                            <label>自我介紹：
                                <textarea placeholder={bio} onChange={(e) => setNewBio(e.target.value)} />
                            </label>
                        </div>
                        <button onClick={handleSaveChanges}>儲存變更</button>
                    </div>
                ) : (
                    <div className="not-logged-in-message">尚未登入，請前往登入</div>
                )}
            </Layout>
        </div>
    );
};

export default Account;
