const sharp = require('sharp');
const path = require('path');
const TextToSvg = require('text-to-svg');
const fs = require('fs');

const times = 1; // 生成次數
const num = 10; // 生成字段長度

const width = 50 * num; 
const height = 40;

const fontStyle ={
    withNotation:{
        name:'withNotation.ttf', // 填入檔名 （檔案放在 fonts 資料夾下）
        letterSpacing:0.1, // 字元間隔
        x:-3, y:0 // 偏移量
    },
    withoutNotation:{
        name: 'withoutNotation.ttf', // 填入檔名 （檔案放在 fonts 資料夾下）
        letterSpacing:0.6, // 字元間隔
        x:0, y:0 // 偏移量
    },
}

var options = {
    fontSize: 28, // 字體大小
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
        genText('withNotation',fontStyle.withNotation.name,fontStyle.withNotation.letterSpacing, fontStyle.withNotation.x, fontStyle.withNotation.y);
        genText('withoutNotation',fontStyle.withoutNotation.name,fontStyle.withoutNotation.letterSpacing,fontStyle.withoutNotation.x,fontStyle.withoutNotation.y);
   }
}

function genText(type,font_name,letterSpacing,x,y){
    options.x= x;
    options.y= y;
    options.letterSpacing = letterSpacing;
    const fontPath = path.join(__dirname, `fonts/${font_name}`);
    const textToSvg = TextToSvg.loadSync(fontPath);
    const textSvg = textToSvg.getSVG(str, options);
    outputImage(textSvg,`${type}/${projectName}.png`);
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
    .png().toBuffer()
    .then(data => {
        return sharp(data)
            .composite([{
                input: Buffer.from(textSvg),
                top: 5, left: 10
            }]).toFile(path);
    })
    .then(() => {console.log('Image generated and saved');})
    .catch(err => { console.error('Error:', err);});
}

function generateRandomSentence(length) {
    const dict = fs.readFileSync('dictionary.txt','utf8');
    let sentence = '';
    const charactersArray = dict.split('\n');

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersArray.length);
        sentence += charactersArray[randomIndex];
    }

    return sentence;
}

main();