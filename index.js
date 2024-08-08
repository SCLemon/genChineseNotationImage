const sharp = require('sharp');
const path = require('path');
const TextToSvg = require('text-to-svg');

const width = 800; 
const height = 40;

const times = 10; // 生成次數
const num = 10; // 生成字段長度

var options = {
    fontSize: 28,
    anchor: 'top',
    attributes: { fill: '#000000' }
};


// 以下不用動
var str= '';
var projectName = '';
function main(){
   for(var i=0;i<times;i++){
        str = generateRandomSentence(num);
        projectName = new Date().getTime();
        genText('withoutNotation',0.4, 5, 0);
        genText('withNotation',0.1, 0, 0);
   }
}

function genText(style,letterSpacing,x,y){
    options.x= x;
    options.y= y;
    options.letterSpacing = letterSpacing;
    const fontPath = path.join(__dirname, `fonts/${style}.ttf`);
    const textToSvg = TextToSvg.loadSync(fontPath);
    const textSvg = textToSvg.getSVG(str, options);
    outputImage(textSvg,`${style}/${projectName}.png`);
}

function outputImage(textSvg,path){
    sharp({
        create: {
            width: width,
            height: height,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    })
    .png()
    .toBuffer()
    .then(data => {
        return sharp(data)
            .composite([{
                input: Buffer.from(textSvg),
                top: 5,
                left: 10
            }])
            .toFile(path);
    })
    .then(() => {
        console.log('Image generated and saved');
    })
    .catch(err => {
        console.error('Error:', err);
    });
}

function generateRandomSentence(length) {
    const commonTraditionalChineseCharacters = '的 一 是 不 了 在 人 有 我 他 這 個 們 中 來 上 大 為 說 和 國 地 到 以 子 之 還 沒 想 從 也 你 見 就 給 他們 要 嗎 知 道 行 我 們 年 會 很 些';
    let sentence = '';
    const charactersArray = commonTraditionalChineseCharacters.split(' ');

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersArray.length);
        sentence += charactersArray[randomIndex];
    }

    return sentence;
}

main();