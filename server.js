const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

const app = express();
const port = 3001; // 确保与前端通信的端口不同

// 设置 multer 存储配置
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 处理图片压缩请求
app.post('/compress', upload.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('请上传需要转码的图片');
    }

    const quality = parseInt(req.body.quality, 10) || 80; // 默认质量为80%
    const maxWidth = parseInt(req.body.maxWidth, 10) || 2000;
    const maxHeight = parseInt(req.body.maxHeight, 10) || 2000;

    try {
        // 使用 sharp 进行图片压缩
        const compressedBuffer = await sharp(file.buffer)
            .resize({ width: maxWidth, height: maxHeight, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: quality })
            .toBuffer();

        // 设置响应头并发送压缩后的图片
        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Length': compressedBuffer.length,
        });
        res.send(compressedBuffer);
    } catch (error) {
        console.error('压缩图片发生错误:', error);
        res.status(500).send('压缩图片发生错误');
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在运行 http://localhost:${port}`);
});