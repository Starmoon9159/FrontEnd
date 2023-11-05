import { MdEditor, config } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import React, { useState, useEffect } from "react";
import '@vavt/cm-extension/dist/previewTheme/arknights.css';
import Layout from "@theme/Layout";
import axios from "axios";
import './css/cp.css'
import './css/button.css'
const Createpost = () => {
    config({
        editorConfig: {
            languageUserDefined: {
                'my-lang': {
                    toolbarTips: {
                        bold: '加粗',
                        underline: '下劃線',
                        italic: '斜體',
                        strikeThrough: '刪除線',
                        title: '標題',
                        sub: '下標',
                        sup: '上標',
                        quote: '引用',
                        unorderedList: '無序列表',
                        orderedList: '有序列表',
                        task: '任務列表',
                        codeRow: '行內程式碼',
                        code: '區塊程式碼',
                        link: '鏈接',
                        image: '圖片',
                        table: '表格',
                        mermaid: 'mermaid圖',
                        katex: 'katex公式',
                        revoke: '後退',
                        next: '前進',
                        save: '保存',
                        prettier: '美化',
                        pageFullscreen: '瀏覽器全屏',
                        fullscreen: '屏幕全屏',
                        preview: '預覽',
                        htmlPreview: 'html代碼預覽',
                        catalog: '目錄',
                        github: '源碼地址'
                    },
                    titleItem: {
                        h1: '一級標題',
                        h2: '二級標題',
                        h3: '三級標題',
                        h4: '四級標題',
                        h5: '五級標題',
                        h6: '六級標題'
                    },
                    imgTitleItem: {
                        link: '添加鏈接',
                        upload: '上傳圖片',
                        clip2upload: '裁剪上傳'
                    },
                    linkModalTips: {
                        linkTitle: '添加鏈接',
                        imageTitle: '添加圖片',
                        descLabel: '鏈接描述：',
                        descLabelPlaceHolder: '請輸入描述...',
                        urlLabel: '鏈接地址：',
                        urlLabelPlaceHolder: '請輸入鏈接...',
                        buttonOK: '確定'
                    },
                    clipModalTips: {
                        title: '裁剪圖片上傳',
                        buttonUpload: '上傳'
                    },
                    copyCode: {
                        text: '複製程式碼',
                        successTips: '已複製！',
                        failTips: '複製失敗！'
                    },
                    mermaid: {
                        flow: '流程圖',
                        sequence: '時序圖',
                        gantt: '甘特圖',
                        class: '類圖',
                        state: '狀態圖',
                        pie: '餅圖',
                        relationship: '關係圖',
                        journey: '旅程圖'
                    },
                    katex: {
                        inline: '行內公式',
                        block: '區塊公式'
                    },
                    footer: {
                        markdownTotal: '字數',
                        scrollAuto: '同步滾動'
                    }
                }
            }
        }
    });

    const [userID, setUserID] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [User, setUser] = useState(''); // 初始化为空字符串
    const [avatarURL, setAvatarURL] = useState('');
    const [text, setText] = useState("hello md-editor-rt！");
    const [html, setHtml] = useState("");
    const [ImgMessage, setImgMessage] = useState('上傳縮略圖')
    const [thumbnailUrl, setthumbnailUrl] = useState('')
    //獲取使用者
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
        fetchUserData();
    }, []);
    //獲取投向
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

    const post = async () => {
        if (!title || !tag) {
            alert('缺少必要選項，如: 標題、標籤');
            return;
        }

        if (isLoggedIn) {
            const tagsArray = tag.split(',').map((t) => t.trim()); // 將標籤字串拆分成標籤陣列
            const postData = {
                title: title,
                tag: tagsArray, // 儲存標籤陣列
                author: User.username, // 請將其替換為實際的使用者名稱
                content: html,
                thumbnail: thumbnailUrl
            };

            await axios.post('http://localhost:9000/api/create-post', postData);
            window.location.href = '/article';
        } else {
            alert('你必須先登入帳號！');
        }
    }

    //上傳圖片
    const onUploadImg = async (files, callback) => {
        const res = await Promise.all(
            files.map((file) => {
                return new Promise((rev, rej) => {
                    const form = new FormData();
                    form.append('file', file);

                    axios
                        .post('http://localhost:9000/api/img/upload', form, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })

                        .then((res) => rev(res))
                        .catch((error) => rej(error));
                });
            })
        );

        callback(res.map((item) => item.data.urls));
    };
    const [language] = useState('my-lang');

    const [tag, setTag] = useState('')
    const [title, setTitle] = useState('')
    //上傳縮略圖
    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            axios
                .post('http://localhost:9000/api/img/upload/thumbnail', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    // 处理成功上传后的逻辑，response.data 包含了服务器返回的数据
                    console.log('上傳成功', response.data);
                    setImgMessage(`目前選擇圖片:${response.data.urls}`);
                    setthumbnailUrl(response.data.urls)
                    console.log(thumbnailUrl)
                })
                .catch((error) => {
                    // 处理上传失败后的逻辑
                    console.error('上傳失敗', error);
                });
        }
    };

    return (
        <div>
            <Layout>
                {isLoggedIn ? ( // 检查用户是否已登录
                          <><MdEditor
                        className="MdEditor"
                        modelValue={text}
                        onChange={(modelValue) => {
                            setText(modelValue);
                        } }
                        onHtmlChanged={(html) => {
                            setHtml(html);
                        } }
                        language={language}
                        theme="dark"
                        onUploadImg={onUploadImg} /><div className="button-container">
                            <input
                                type="text"
                                placeholder="輸入標題"
                                value={title}
                                className="TextInput"
                                onChange={(e) => setTitle(e.target.value)} />
                            <input
                                type="text"
                                placeholder="輸入標籤(使用逗點隔開)"
                                value={tag}
                                style={{
                                    marginBottom: '5%'
                                }}
                                className="TextInput"
                                onChange={(e) => setTag(e.target.value)} />
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageUpload} />
                            <a className="upload-btn" onClick={() => document.getElementById('fileInput').click()}>
                                {ImgMessage}
                            </a>
                            <button onClick={post} className="btn from-left">創建貼文</button>
                        </div></>
                ) : (
                    <><p className="errorMessage">你必須先登入才可以發表貼文</p><div className="button-container">
                            <button onClick={() => window.location='/article'} className="btn from-left">返回貼文頁面</button>
                        </div></>
                )}
            </Layout>
        </div>
    );
}

export default Createpost;
