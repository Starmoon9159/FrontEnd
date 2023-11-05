//login.js
import React, { useEffect, useState } from 'react';
import './css/login.css'
import './css/wtf.css'

const Loginboard = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                if (token) {
                    // Token is valid, save it to local storage and perform the redirect.
                    localStorage.setItem('token', token);
                    window.location.href = '/';
                } else {
                    alert('Token is missing in the response data.');
                }
            } else {
                // Handle non-200 HTTP status codes, e.g., login failed.
                alert('Login failed. Check your username and password.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred during login.');
        }
    };

    return (
        <div>
            <section>
                <div className="form-box">
                    <div className="form-value">
                        <h2>Login-登入</h2>
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

                        <button onClick={handleLogin} className="glow-on-hover">
                            Log in
                        </button>

                        <div className="register">
                            <p>
                                你沒有帳號?? <a href="/register">創建!</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Loginboard;