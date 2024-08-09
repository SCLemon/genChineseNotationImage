const sharp = require('sharp');
const path = require('path');
const TextToSvg = require('text-to-svg');
const fs = require('fs');

const times = 1; // 個別生成張數
var numArr = [4,5,6]; // 依序生成字段長度 <-- 字數太少可能導致背景無法渲染

const widthBasis = 50; // 一個字的寬度 
const height = 40; // 行高 <-- 若報 Dimension error，則代表這個寬度基底太小或行高太低。

const fontStyle ={
    withNotation:{
        name:'withNotation.ttf', // 放在 fonts 資料夾
        backgroundFileName:'background.jpeg', // 放在 background 資料夾，若無請填 ''
        letterSpacing:0.1,
        x:-3, y:0,
        outputFolderName:'withNotation' // 可自由填寫（系統會自動創建）
    },
    withoutNotation:{
        name: 'withoutNotation.ttf', // 放在 fonts 資料夾
        backgroundFileName:'', // 放在 background 資料夾，若無請填 ''
        letterSpacing:0.6,
        x:0, y:0,
        outputFolderName:'withoutNotation' // 可自由填寫（系統會自動創建）
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
var width = 0;

function main(){
    if(numArr.length == 0) return;
    num = numArr[0];
    width = widthBasis*num;
    for(var i=0;i<times;i++){
        str = generateRandomSentence(num);
        projectName = new Date().getTime();
        genText('withNotation',fontStyle.withNotation.name,fontStyle.withNotation.letterSpacing, fontStyle.withNotation.x, fontStyle.withNotation.y,fontStyle.withNotation.outputFolderName,fontStyle.withNotation.backgroundFileName);
        genText('withoutNotation',fontStyle.withoutNotation.name,fontStyle.withoutNotation.letterSpacing,fontStyle.withoutNotation.x,fontStyle.withoutNotation.y,fontStyle.withoutNotation.outputFolderName,fontStyle.withoutNotation.backgroundFileName);
    }
    numArr.shift();
    main();
}

function genText(type,font_name,letterSpacing,x,y,outputFolderName,backgroundFileName){
    options.x= x;
    options.y= y;
    options.letterSpacing = letterSpacing;
    const fontPath = path.join(__dirname, `fonts/${font_name}`);
    const textToSvg = TextToSvg.loadSync(fontPath);
    const textSvg = textToSvg.getSVG(str, options);
    outputImage(textSvg,backgroundFileName,outputFolderName,`/${projectName}.png`);
}

function outputImage(textSvg,backgroundFileName,folderName,fileName){
    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName, { recursive: true });
    if(backgroundFileName!=''){ // 含背景
        const backgroundImagePath = path.join(__dirname, `/background/${backgroundFileName}`);
        sharp(backgroundImagePath)
            .resize(width, height)
            .toBuffer()
            .then(backgroundData => {
                return sharp(backgroundData)
                    .composite([{
                        input: Buffer.from(textSvg),
                        top: 5, left: 10
                    }])
                    .toFile(path.join(folderName, fileName));
            })
            .then(() => { console.log('Image generated and saved'); })
        .catch(err => { console.error('Error:', err); });
    }
    else { // 不含背景
        sharp({
            create: {
                width: width,
                height: height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        }).png().toBuffer()
        .then(data => {
            return sharp(data)
                .composite([{
                    input: Buffer.from(textSvg),
                    top: 5, left: 10
                }]).toFile(folderName+fileName);
        })
        .then(() => {console.log('Image generated and saved');})
        .catch(err => { console.error('Error:', err);});
    }
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