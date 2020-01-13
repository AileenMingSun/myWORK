let imgs = [];
let choices = 4;
let isFullScreen = false;
let imgSize = 300;
let xSpace;
let initPosX, initPosY;
let answerData;
let textPosY;
let fontSize = 30;
let pageNum;
let score = 0;
let scene = 0;
let totalScenes = 10;
let isOver = false;

function preload() {
    startAll();

}

function setup() {
    console.debug(displayWidth, displayHeight);
    createCanvas(displayWidth, displayHeight);
    xSpace = imgSize / 4;
    initPosX = (width - (imgSize * choices) + (xSpace * (choices - 1))) / 4;
    initPosY = height - imgSize - height / 6;
    textPosY = height / 3.5;
    textAlign(CENTER);
    pageNum = 1;

    for (let i = 0; i < choices; i++) {
        imgs.push(createImg('data/0/' + (i) + '.jpg'));
        imgs[i].position(initPosX + (i * (imgSize + xSpace)), initPosY);
        imgs[i].mouseOver(hoverSelectionOn);
        imgs[i].mouseOut(hoverSelectionOff);
        imgs[i].mouseClicked(selectionMade);
    }

    noLoop();
}

function draw() {
    background(255);
    if (!isOver) {
        noStroke();
        fill(0);
        textSize(fontSize);
        for (let i = 0; i < answerData.data.length; i++) {
            let roundedNumber = answerData.data[i].confidence.toFixed(2)
            let percent = roundedNumber * 100;
            text(answerData.data[i].label + "		" + percent + "%", width / 2, textPosY + (i * fontSize * 1.8));
        }
        textSize(fontSize * 1.5);
        text(pageNum + " / " + totalScenes, width / 2, textPosY / 1.9);
    } else {
    	let s = "";
    	let l = "";
        if (score >= 8) {
            l = "A";
        } else if (score >= 6) {
            l = "B";
        } else if (score >= 4) {
            l = "C";
        } else if (score >= 2) {
            l = "D";
        } else {
            l = "E"
        }
    	s = parseInt(score/totalScenes*10000)/100+"%";

    	textSize(fontSize*3);
    	text(l, width / 2, textPosY / 1.9);
    	textSize(fontSize);
        text(s, width / 2, (textPosY+fontSize*3) / 1.9);
    }

    noLoop();
}

function keyPressed() {
    isFullScreen = !isFullScreen;
    //fullscreen(isFullScreen);
}

function startAll() {
    console.log("scene", scene);
    if (!isOver) {
        if (scene > 0) {
            for (let i = 0; i < choices; i++) {
                imgs[i].remove();
            }
        }
        imgs = [];
        answerData = loadJSON('data/' + scene + '/data.json', function() {
            console.log('data/' + scene + '/data.json');
            for (let i = 0; i < choices; i++) {
                imgs.push(createImg('data/' + scene + '/' + (i) + '.jpg'));
                imgs[i].position(initPosX + (i * (imgSize + xSpace)), initPosY);
                imgs[i].mouseOver(hoverSelectionOn);
                imgs[i].mouseOut(hoverSelectionOff);
                imgs[i].mouseClicked(selectionMade);
            }
            loop();
        });
    } else {
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].remove();
        }
        imgs = [];
        console.log(imgs);
        loop();
    }
}

function hoverSelectionOn(i) {
    i.target.style.border = "3px solid #f00";
}

function hoverSelectionOff(i) {
    i.target.style.border = "0px solid #f00";
}

function selectionMade(i) {
    let res = i.target.src.split('.');
    res = res[0].split('/');
    res = int(res[res.length - 1]);

    if (res == answerData.answer) {
        score++;
        console.log("correct, score is: " + score);
    } else {
        console.log("incorrect, score is: " + score);
    }
    if (scene + 1 >= totalScenes) {
        console.log("OVER!");
        isOver = true;
    }
    if (!isOver) {
        scene++;
        pageNum++;
    }
    startAll();
}
