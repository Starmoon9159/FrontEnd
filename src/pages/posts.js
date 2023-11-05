import React, { useState, useEffect } from 'react';
import { MdPreview, MdCatalog } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import './css/posts.css';
import axios from 'axios';
import Layout from "@theme/Layout";
import './css/cp.css';
import './css/button.css';
import Link from '@docusaurus/Link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Posts = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const [posts, setPosts] = useState();

    const [ErrorMessage, setErrorMessage] = useState('似乎出了點問題...請檢查是否有這篇貼文');
    const [post_title, setPost_title] = useState('');
    const [post_author, setPost_author] = useState('');
    const [post_date, setPost_date] = useState('');
    const [html, setHtml] = useState('');
    const [id] = useState('preview-only');
    const [noPosts, setNoPosts] = useState(false);
    const [postid, setPostid] = useState(urlParams.get('id'));
    const [avatar, setAvatar] = useState(null);
    const [comments, setComments] = useState(['1', '2']);
    const [newComment, setNewComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [User, setUser] = useState(''); // 初始化为空字符串
    const [userID, setUserID] = useState('');

    // 准备成功和错误的 Toast 函数
    const done_toast = () => toast.success('成功發送!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const error_toast = () => toast.error('發送失敗!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/comments?postID=${postid}`);
            setComments(response.data);
        } catch (error) {
            console.error('獲取留言失敗:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postid]);

    const handleSubmitComment = async () => {
        try {
            await axios.post(`http://localhost:9000/api/comments`, {
                postID: postid,
                username: User.username,
                text: newComment,
                userID: userID,
            });
            setNewComment('');
            fetchComments(); // Refresh the comments list
            done_toast();
        } catch (error) {
            console.error('發布留言失敗:', error);
            error_toast();
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            axios.get(`http://localhost:9000/api/posts?ID=${postid}`)
                .then((response) => {
                    if (response.data === null) {
                        setNoPosts(true);
                    } else {
                        setPosts(response.data);
                        setHtml(response.data.content);
                        setPost_author(response.data.author);
                        setPost_date(response.data.date);
                        setPost_title(response.data.title);
                        setNoPosts(false);
                    }
                })
                .catch((error) => {
                    console.error('獲取貼文失敗:', error);
                });
        };

        fetchUserData();
    }, [postid]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await axios.post('http://localhost:9000/api/verifyJWT', { token });
                    if (response.data.data === 'success') {
                        setIsLoggedIn(true);
                        setUserID(response.data.user.UserID);
                        setUser(response.data.user); // 更新User为用户对象

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
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUserAvatar = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/api/getUserAvatar?username=${post_author}`);
                if (response.data.avatar) {
                    setAvatar(response.data.avatar);
                    console.log('完成');
                } else {
                    setAvatar('http://localhost:9000/uploads/avatars/default-avatar.png');
                    console.log('預設');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserAvatar();
    }, [post_author]);

    return (
        <div style={{ backgroundColor: 'black' }}>
            <Layout>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                {noPosts ? (
                    <div className="button-container">
                        <p className='errorMessage'>{ErrorMessage}</p>
                        <button onClick={() => window.history.back()} className="btn from-left">返回貼文頁面</button>
                    </div>
                ) : (
                    <>
                        <div style={{ backgroundColor: 'black' }} className="goback" onClick={() => window.history.back()}>
                            <a className="btn">
                                回到上一頁
                                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                            </a>
                        </div>
                        <div className='content' style={{ backgroundColor: 'black' }}>
                            <p className='title_post'>{post_title}</p>
                            <p className='post_author'>{post_author}</p>
                            <p className='post_date'>{post_date}</p>
                        </div>
                        <MdPreview editorId={id} modelValue={html} theme='dark' previewTheme='github' />

                        <div className="comments-container">
                            <h2>留言</h2>
                            <div className="comments-list">
                                {comments
                                    .map(comment => {
                                        const datePattern = /\d{4}\/\d{2}\/\d{2} \d{2}點:\d{2}分/;
                                        const match = datePattern.exec(comment.date);

                                        if (match) {
                                            const parsedDate = new Date(match[0]);
                                            if (!isNaN(parsedDate)) {
                                                return { ...comment, date: parsedDate };
                                            }
                                        }

                                        return comment;
                                    })
                                    .filter(comment => comment.date)
                                    .sort((a, b) => b.date - a.date)
                                    .map((comment) => (
                                        <div key={comment._id} className="comment">
                                            <div className="divBox_comment">
                                                <p className='comment_user'>{comment.username}</p>
                                                <p className='comment_date'>{comment.date.toString()}</p>
                                                <p>{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {isLoggedIn ? (
                                <div className="new-comment">
                                    <textarea
                                        placeholder="發表留言..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button onClick={handleSubmitComment}>發送!</button>
                                </div>
                            ) : (
                                <p className="errorMessage">你必須先登入才可以發表留言</p>
                            )}
                        </div>
                    </>
                )}
            </Layout>
        </div>
    );
}

export default Posts;
