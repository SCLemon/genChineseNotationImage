const fs = require('fs');
const path = require('path');

const folderPath1 = path.join(__dirname, 'withNotation');
const folderPath2 = path.join(__dirname, 'withoutNotation');

fs.readdir(folderPath1, (err, files) => {
    if (err) {
        console.error('讀取文件夾時發生錯誤:', err);
        return;
    }
    files.forEach(file => {
        const filePath = path.join(folderPath1, file);
        fs.unlink(filePath, err => {
            if (err) {
                console.error('刪除文件時發生錯誤:', err);
                return;
            }
        });
    });
});

fs.readdir(folderPath2, (err, files) => {
    if (err) {
        console.error('讀取文件夾時發生錯誤:', err);
        return;
    }
    files.forEach(file => {
        const filePath = path.join(folderPath2, file);
        fs.unlink(filePath, err => {
            if (err) {
                console.error('刪除文件時發生錯誤:', err);
                return;
            }
        });
    });
});