import React, { useEffect, useState } from 'react';
import './css/register.css'
import './css/wtf.css'
import axios from 'axios';
import Layout from '@theme/Layout';
const Registerboard = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [RE_password, setRE_password] = useState('');


    const handleRegister = async () => {

        if (password === RE_password) {
            if (/[?@!$A-Za-z0-9]/.test(password)) {

                const userData = {
                    username: username,
                    password: password,
                    badgeID: []
                }
                try {
                    console.log(username)
                    // 發送POST請求到後端以創建帳號
                    console.log("userData before POST request:", userData);

                    const response = await axios.post('/api/createUser', userData);

                    console.log("Response from /api/createUser:", response.data);

                    // 處理成功註冊後的操作，例如導向登錄頁面或顯示成功訊息
                    console.log('帳號註冊成功', response.data);
                    setPassword('')
                    setUsername('')
                    setRE_password('')
                } catch (error) {
                    // 處理註冊失敗的情況，例如顯示錯誤訊息
                    console.error('帳號註冊失敗', error);
                }
            } else {
                alert('密碼只能有數字，英文字，@,!,$而已')
            }
        } else {
            alert('密碼不一致')
        }





    };

    return (
        <div>
            <Layout>
                <section>
                    <div className="form-box">
                        <div className="form-value">
                            <h2>Register-創建帳號</h2>
                            <div className="inputbox">
                                <ion-icon name="mail-outline"></ion-icon>
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label id="username">使用者名稱</label>
                            </div>
                            <div className="inputbox">
                                <ion-icon name="lock-closed-outline"></ion-icon>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label id="userpsw">使用者密碼</label>
                            </div>
                            <div className="inputbox">
                                <ion-icon name="lock-closed-outline"></ion-icon>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={RE_password}
                                    onChange={(e) => setRE_password(e.target.value)}
                                />
                                <label id="userpsw">確認密碼</label>
                            </div>
                            <button onClick={handleRegister} className="glow-on-hover">
                                創建帳號
                            </button>

                            <div className="register">
                                <p>
                                    以創建帳號?? <a href="/login">登入!</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>

        </div>
    );
};


export default Registerboard;
