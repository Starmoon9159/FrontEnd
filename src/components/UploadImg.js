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

module.exports = onUploadImg;