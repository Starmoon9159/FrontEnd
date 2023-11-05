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
            })
            .catch((error) => {
                // 处理上传失败后的逻辑
                console.error('上船失敗', error);
            });
    }
};
module.exports = handleImageUpload