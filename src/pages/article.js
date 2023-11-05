import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/RWD/article.css'
import { MdPreview, config } from 'md-editor-rt'
import './css/article.css'
import Layout from "@theme/Layout";
import { Link } from 'react-router-dom';
import "./css/button2.css"
const Article = () => {// 獲取當前 URL 的 search 部分
  const [posts, setPosts] = useState([]);
  const [id] = useState('preview-only');
  const [tag_prefix, setTag_prefix] = useState('')
  const urlParams = new URLSearchParams(window.location.search);
  const tagValue = urlParams.get('tag');
  const [noPosts, setNoPosts] = useState(false);

  useEffect(() => {
    if (tagValue) {
      console.log(`Tag 參數的值是：${tagValue}`);
      axios.get(`http://localhost:9000/api/posts?tag=${tagValue}`)
        .then((response) => {
          setPosts(response.data);
          if (response.data.length === 0) {
            setNoPosts(true);
          } else {
            setNoPosts(false);
          }
        })
        .catch((error) => {
          console.error('获取帖子时出错:', error);
        });
    } else {
      console.log('沒有找到 Tag 參數');
      axios.get(`http://localhost:9000/api/posts`)
        .then((response) => {
          setPosts(response.data);
          if (response.data.length === 0) {
            setNoPosts(true);
          } else {
            setNoPosts(false);
          }
        })
        .catch((error) => {
          console.error('获取帖子时出错:', error);
        });
    }
  }, [tagValue]);

  const goBack = () => {
    window.location.href = '/article';
  };
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
  return (
    <Layout>
      <div style={{color:'black'}} className="goback" onClick={() => window.history.back()}>
        <a  className="btn">
         回到上一頁
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </a>
      </div>



      <div className="divBoxContainer">
        {noPosts ? (
          <div>
            <p>沒有貼文可供顯示</p>
            <button onClick={goBack}>返回</button>
          </div>
        ) : (
          posts.map((post) => (
            <div
              className="divBox"
              key={post.ID}
              onClick={(e) => {
                if (e.target.tagName !== 'A') {
                  window.location.href = `/posts?id=${post.ID}`;
                }
              }}
            >
              <div>
                <img src={post.thumbnail} alt="文章图片" className="post_image" />
                <p className="post_title">{post.title}</p>
                <p className="post_date">日期: {post.date}</p>
                <p className="post_author">
                  作者: {post.author}
                  {post.tag && Array.isArray(post.tag) ? (
                    post.tag.map((tag, index) => (
                      <Link key={index} to={`/article?tag=${tag}`} className="post_tag">
                        {tag}
                      </Link>
                    ))
                  ) : (
                    <Link to={`/article?tag=${post.tag}`} className="post_tag">
                      {post.tag}
                    </Link>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Article;