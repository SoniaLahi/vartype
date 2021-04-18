var keyPressed = false;
var intervalId = setInterval(loop, 20);
var touch = false,
    t = 0,
    sldr,
    r,
    currentLevel = 0,
    step = 0,
    score = [],
    penalty = [],
    prm = [],
    str,
    mode = 0,
    fonttype,
    vari = 0,
    totalscore,
    expectedInputs = false,
    fontscore = [],
    page;
var font = ['Roboto', 'RobotoMono', 'EBGaramond-VariableFont_wght', 'Quicksand-VariableFont_wght', 'Hagrid-Variable-trial', 'Minerale-variable-TRIAL', 'InterVar', 'Blacker-Sans-Variable-trial', 'GTFlexa', 'Compressa'];
var lvlname = ['Roboto', 'RobotoMono', 'EBGaramond', 'Quicksand', 'Hagrid', 'Minérale', 'Inter', 'Blacker', 'GTFlexa', 'Compressa', 'Random'];
var fmin = [[300], [100], [400], [300], [100], [0], [100, 0], [50, 100], [0, 100, 0], [10, 100]];
var fmax = [[600], [800], [800], [700], [1000], [1000], [900, -10], [499, 1000], [200, 800, 100], [200, 1000]];
var rndword = ['a', 'b', 'c', 'd']
var fntchar = [["'wght'"], ["'wght'"], ["'wght'"], ["'wght'"], ["'wght'"], ["'wght'"], ["'wght'", "'slnt'"], ["'wght'", "'opsz'"], ["'wdth'", "'wght'", "'ital'"], ["'wdth'", "'wght'"]]
var fout;

function stopInterval() {
    clearInterval(intervalId);
}

function loop() {
    switch (mode) {
        case 0:
            page = mode;
            loadReady();
            mode++;
            break;
        case 1:
            //Wait Input
            ready();
            break;
        case 2:
            //Play Game
            level(currentLevel);
            break;
        case 3:
            continueLevel(currentLevel < 4);
            if (step == Math.max(1, Math.min(currentLevel, 4))) {
                mode++;
                keyPressed = false;
            }
            break;
        case 4:
            //Wait
            waitscore();
            break;
        case 5:
            loadCollection();
            break;
        case 6:
            //Score>settings
            loadSettings();
            //if(key=="s")
            break;
    }

    function loadReady() {
        //Load Ready?
        step = 0;
        keyPressed = false;
        t = 0;
        score = [];
        penalty = [];
        document.getElementById("game").style.filter = "none";
        document.getElementById("headerready").style.display = "flex";
        document.getElementById("headerready").children[1].children[0].innerHTML = "Level " + currentLevel;
        document.getElementById("affiche").innerHTML = "Ready?";
        document.getElementById("affiche").style.opacity = 1;
        document.getElementById("slider").style.opacity = 1;

        var spacebarText;
        if (currentLevel === 0) {
            spacebarText = "Touch the <strong>(screen)</strong><br>or Press <strong>(spacebar)</strong><br> to start";
        } else if (touch) {
            spacebarText = "Touch the <strong>(screen)</strong><br>to start";
        } else {
            spacebarText = "Press <strong>(spacebar)</strong><br>to start";
        }
        editSpacebarText(spacebarText);

        document.getElementById("spacebar").style.opacity = 1;
        document.getElementById("helper").style.display = "none";
        document.getElementById("helper0").style.display = "none";
    }

    function ready() {
        t++;
        sldr = -Math.cos(t / 200 * Math.PI) / 2 + .5;
        document.getElementById("slider").style.marginLeft = sldr * 100 + "%";
        if (keyPressed === " ") {
            mode++;
            t = -200;
            document.getElementById("headerready").style.display = "none";
            document.getElementById("headerlevel").style.display = "flex";
            document.getElementById("headerlevel").children[0].children[0].innerHTML = "Level " + currentLevel;
            document.getElementById("headerlevel").children[0].children[1].innerHTML = 0 + "/" + Math.max(1, Math.min(currentLevel, 4));
        }
        if (keyPressed == "s" || keyPressed == "S") {
            document.getElementById("headerready").style.display = "none";
            document.getElementById("game").style.filter = "blur(8px)";
            mode = 6;
            keyPressed = false;
        }
        if (keyPressed == "c" || keyPressed == "C") {
            document.getElementById("headerready").style.display = "none";
            document.getElementById("game").style.filter = "blur(8px)";
            mode = 5;
            keyPressed = false;
        }
    }

    function level(flash) {
        if (flash < 4) {
            if (t == -200) {
                startLevel(flash);
                loadFontSettings();
                document.getElementById("affiche").style.opacity = 1;
                document.getElementById("slider").style.opacity = 0;
                keyPressed = false;
                document.getElementById("spacebar").style.opacity = 1;

                var spacebarText;
                if (touch) {
                    spacebarText = "Click the <strong>(screen)</strong><br>to continue";
                } else {
                    spacebarText = "Press <strong>(spacebar)</strong><br>to continue";
                }
                editSpacebarText(spacebarText);

                t = -1;
                if (flash == 3) {
                    expectedInputs = [" "];
                    stopInterval();
                } else {
                    document.getElementsByClassName("textpar")[currentLevel].children[step].style.display = "block";
                }
            } else if (t == 0) {
                startGame();
            }
            t++;
        }
        if (flash > 3) {
            switch (t) {
                case -200:
                    startLevel(flash);
                    break;
                case -120:
                    loadFontSettings();
                    //Flash On
                    document.getElementById("affiche").style.opacity = 1;
                    break;
                case -80:
                    //Flash Off
                    document.getElementById("affiche").style.opacity = 0;
                    break;
                case 0:
                    startGame();
                    break;
            }
            t++;
        }

        if (0 < t) {
            if (keyPressed === " ") {
                saveScore();
                mode++;
                t = 0;
            } else {
                moveGame(flash);
            }
        }
    }

    function continueLevel(wait) {
        if (wait && t == 0) {
            t = 100
            expectedInputs = [" "];
            stopInterval();
        } else if (t == 100) {
            if (vari == fonttype.length - 1) {
                resetAdvance();
            } else {
                advanceVarType();
            }
            mode--;
        } else {
            t++;
        }
    }

    function startLevel(flash) {
        score.push([]);
        penalty.push(0);
        if (flash == 0) {
            document.getElementById("helper0").style.display = "block";
        }
        if (flash == 1) {
            document.getElementById("helper").style.display = "block";
        }
        document.getElementById("slider").style.opacity = 0;

        var spacebarText;
        if (touch) {
            spacebarText = "Click the <strong>(screen)</strong><br>to validate";
        } else {
            spacebarText = "Hit <strong>(spacebar)</strong><br>to validate";
        }
        editSpacebarText(spacebarText);

        document.getElementById("spacebar").style.opacity = 0;
        document.getElementById("affiche").style.opacity = 0;
    }

    function loadFontSettings() {
        //Get Font settings
        if (currentLevel == 10) {
            var temp = Math.floor(Math.random() * (font.length - 1) + 1)
            var temp2 = searchFont(font[temp])
            var str = "";
            document.getElementsByClassName("textpar")[currentLevel].children[step].style.fontFamily = font[temp];

            for (var i = 0; i < fntchar[temp].length; i++) {
                str += fntchar[temp][i] + " " + Math.random() * (temp2[1][i] - temp2[0][i]) + temp2[0][i];
                if (i != fntchar[temp].length - 1) {
                    str += ", ";
                }
            }
            document.getElementsByClassName("textpar")[currentLevel].children[step].style.fontVariationSettings = str;
            document.getElementsByClassName("textpar")[currentLevel].children[step].innerHTML = rndword[Math.floor(Math.random() * rndword.length)];
        }
        document.getElementById("affiche").style.fontFamily = document.getElementsByClassName("textpar")[currentLevel].children[step].style.fontFamily;
        document.getElementById("affiche").style.fontVariationSettings = document.getElementsByClassName("textpar")[currentLevel].children[step].style.fontVariationSettings;
        document.getElementById("affiche").innerHTML = document.getElementsByClassName("textpar")[currentLevel].children[step].innerHTML;
        fout = searchFont(document.getElementsByClassName("textpar")[currentLevel].children[step].style.fontFamily);
        prm = [];
        fonttype = [];
        var fontvar = document.getElementsByClassName("textpar")[currentLevel].children[step].style.fontVariationSettings.split(", ")
        for (var i = 0; i < fontvar.length; i++) {
            fontvar[i] = fontvar[i].split(" ");
        }
        if (currentLevel == 0) {
            fontvar = [['weight', 400]]
        }
        for (var i = 0; i < fontvar.length; i++) {
            fonttype.push(fontvar[i][0]);
            prm.push((fontvar[i][1] - fout[0][i]) / (fout[1][i] - fout[0][i]));
        }
    }

    function startGame() {
        //Start Game
        document.getElementById("affiche").style.opacity = 1;
        document.getElementById("slider").style.marginLeft = 0 + "%";
        document.getElementById("slider").style.opacity = 1;
        document.getElementById("spacebar").style.opacity = 1;

        var spacebarText;
        if (touch) {
            spacebarText = "Click the <strong>(screen)</strong><br>to validate";
        } else {
            spacebarText = "Hit <strong>(spacebar)</strong><br>to validate";
        }
        editSpacebarText(spacebarText);
        keyPressed = false;
    }

    function editSpacebarText(text){
        document.getElementById("spacebar").innerHTML = text;
    }

    function moveGame(flash) {
        //Move Game
        r = Math.floor(t / 200);
        sldr = -Math.cos(t / 200 * Math.PI) / 2 + .5;
        if (flash == 0) {
            document.getElementById("affiche").style.fontWeight = sldr * (fout[1][0] - fout[0][0]) + fout[0][0];
        } else {
            var fontvariation = "";
            for (var i = 0; i < fonttype.length; i++) {
                fontvariation += fonttype[i] + " ";
                if (i < vari) {
                    fontvariation += fontscore[i] * (fout[1][i] - fout[0][i]) + fout[0][i];
                } else if (i == vari) {
                    fontvariation += sldr * (fout[1][i] - fout[0][i]) + fout[0][i];
                } else {
                    fontvariation += fout[0][i];
                }
                if (i != fonttype.length - 1) {
                    fontvariation += ", ";
                }
            }
            document.getElementById("affiche").style.fontVariationSettings = fontvariation;
        }
        document.getElementById("slider").style.marginLeft = sldr * 100 + "%";
    }

    function saveScore() {
        //Save Score/Input Time
        if (currentLevel == 0) {
            fontscore.push(parseInt(sldr * 3) / 3);
            score[step].push(1 - Math.abs(parseInt(sldr * 3) / 3 - prm[vari]));//1-Math.abs(sldr-prm[0])
        } else {
            fontscore.push(sldr);
            score[step].push(1 - Math.abs(sldr - prm[vari]));//1-Math.abs(sldr-prm[0])
        }
        penalty[step] += r;
        keyPressed = false;
        if (vari == fonttype.length - 1) {
            document.getElementsByClassName("textpar")[currentLevel].children[step].style.display = "block";
        }
    }

    function resetAdvance() {
        //Reset & Advance Game
        document.getElementById("slider").style.opacity = 0.3;
        document.getElementById("affiche").style.opacity = 0.3;
        document.getElementById("spacebar").style.opacity = 0.3;
        document.getElementsByClassName("textpar")[currentLevel].children[step].style.display = "none";
        step++;
        fontscore = [];
        vari = 0;
        t = -200;
        document.getElementById("headerlevel").children[0].children[1].innerHTML = step + "/" + Math.max(1, Math.min(currentLevel, 4));
    }

    function advanceVarType() {
        vari++;
        t = 0;
    }

    function searchFont(fnt) {
        for (var i = 0; i < font.length; i++) {
            if (fnt == font[i]) {
                return [fmin[i], fmax[i]];
            }
        }
    }

    function scoreboard(bounce) {

        var display = bounce ? "block": "none";
        document.getElementById("score").children[0].children[1].children[2].style.display = display;
        document.getElementById("score").children[0].children[2].children[2].style.display = display;

        document.getElementById("headerlevel").style.display = "none";
        document.getElementById("headerscore").style.display = "flex";
        document.getElementById("score").style.display = "flex";
        document.getElementById("game").style.filter = "blur(8px)";
        totalscore = 0;
        for (var i = 0; i < 4; i++) {

            var displayScoreStyle = null;
            if (i < Math.max(1, Math.min(currentLevel, 4))) {
                displayScoreStyle = "block";
            } else {
                displayScoreStyle = "none";
            }
            document.getElementById("score").children[0].children[2].children[0].children[i].style.display = displayScoreStyle;
            document.getElementById("score").children[0].children[2].children[1].children[i].style.display = displayScoreStyle;
            document.getElementById("score").children[0].children[2].children[2].children[i].style.display = displayScoreStyle;
            document.getElementById("score").children[0].children[2].children[3].children[i].style.display = displayScoreStyle;
        }
        for (var i = 0; i < score.length; i++) {
            if (bounce == false) {
                penalty[i] = 0;
            }
            var scorestep = 0;
            for (var j = 0; j < score[i].length; j++) {
                scorestep += score[i][j];
            }
            scorestep = Math.ceil(scorestep / score[i].length * 100);
            document.getElementById("scoreboard").children[1].children[i].innerHTML = scorestep + "%";
            document.getElementById("scoreboard").children[2].children[i].innerHTML = penalty[i];
            document.getElementById("scoreboard").children[3].children[i].innerHTML = Math.ceil(scorestep / (penalty[i] + 1)) + "%";
            totalscore += Math.ceil(scorestep / (penalty[i] + 1));
        }
        totalscore = Math.floor(totalscore / score.length);
        document.getElementById("scoreboard").parentElement.children[0].children[0].innerHTML = " Level " + currentLevel + " - <strong>" + totalscore + "%</strong>";
        //unlock Collection
        document.getElementsByClassName("elementmenu")[currentLevel].children[0].style.visibility = "visible";
        document.getElementsByClassName("elementmenu")[currentLevel].children[0].innerHTML = Math.max(parseInt(document.getElementsByClassName("elementmenu")[currentLevel].children[0].innerHTML), totalscore) + "%";
        document.getElementsByClassName("elementmenu")[currentLevel].children[1].style.fontFamily = document.getElementsByClassName("textpar")[currentLevel].children[0].style.fontFamily;
        document.getElementsByClassName("elementmenu")[currentLevel + 1].children[1].style.textDecoration = "none";
        document.getElementsByClassName("elementmenu")[currentLevel].children[1].innerHTML = lvlname[currentLevel];
        document.getElementsByClassName("elementmenu")[currentLevel + 1].children[1].innerHTML = "Next";
    }

    function waitscore() {
        if (keyPressed === false) {
            page = mode;
            //Load Scoreboard
            scoreboard(currentLevel > 3);
            expectedInputs = [" ", "r", "R", "s", "S", "c", "C"];
			stopInterval();
        } else {
            switch (keyPressed + "t") {
                case " t":
                    currentLevel++;
                    mode = 0;
                    break;
                case "Rt":
                case "rt":
                    mode = 0;
                    break;
                case "Ct":
                case "ct":
                    mode = 5;
                    break;
                case "St":
                case "st":
                    mode = 6;
                    break;
            }
            document.getElementById("headerscore").style.display = "none";
            document.getElementById("score").style.display = "none";
            keyPressed = false;
        }
    }

    function loadCollection() {
        if (keyPressed === false) {
            document.getElementById("menu").style.display = "flex";
            document.getElementById("headercollection").style.display = "flex";
            expectedInputs = ["s", "S", "c", "C", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a"]
			stopInterval();
        } else {
            document.getElementById("menu").style.display = "none";
            document.getElementById("headercollection").style.display = "none";
            if (keyPressed == "c" || keyPressed == "C") {
                mode = page;
            } else if (keyPressed == "s" || keyPressed == "S") {
                mode = 6;
            } else {
                if (document.getElementsByClassName("elementmenu")[parseInt(keyPressed)].children[1].innerHTML != "locked") {
                    mode = 0;
                    currentLevel = parseInt(keyPressed);
                }
            }
            keyPressed = false;
        }
    }

    function loadSettings() {
        if (keyPressed === false) {
            document.getElementById("settings").style.display = "flex";
            document.getElementById("headersettings").style.display = "flex";
            expectedInputs = ["c", "C", "s", "S"];
			stopInterval();
        } else {
            document.getElementById("settings").style.display = "none";
            document.getElementById("headersettings").style.display = "none";
            if (keyPressed == "s" || keyPressed == "S") {
                mode = page;
            } else if (keyPressed == "c" || keyPressed == "C") {
                mode = 5;
            }
            keyPressed = false;
        }
    }
}

function onClick() {
    onKeyPressed(" ");
}

function onKeyboard(event) {
    onKeyPressed(event.key);
}

function onKeyPressed(key) {
    if (key == "Escape") {
		stopInterval();
    } else if (expectedInputs !== false) {
        processKeyPressed(key);
    } else {
        if (keyPressed === false) {
            keyPressed = key;
        }
    }
}

function processKeyPressed(key){
    if (expectedInputs.includes(key)){
        keyPressed = key;
        intervalId = setInterval(loop, 10);
        expectedInputs = false;
    }
}

function touchScreen() {
    touch = true;
}
