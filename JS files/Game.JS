var board = [];
var rows;
var columns;

var minesCount;

function Settings(){

    var radiosDiff = document.getElementsByName('Difficulty');
    var radiosMap = document.getElementsByName('Map');
    var isCheckedDiff = false;
    var isCheckedMap = false;

    for (var i = 0; i < radiosDiff.length; i++) {
        if (radiosDiff[i].checked) {
            isCheckedDiff = true;
            break;
        }
    }

    for (var i = 0; i < radiosMap.length; i++) {
        if (radiosMap[i].checked) {
            isCheckedMap = true;
            break;
        }
    }


    if (!isCheckedDiff || !isCheckedMap) {
        alert('Please select an option before submitting.');
        return;
    } else {
        if (document.getElementById("Easy").checked){
            minesCount = parseInt(document.getElementById("Easy").value, 10);
        }
        if (document.getElementById("Medium").checked){
            minesCount = parseInt(document.getElementById("Medium").value, 10);
        }
        if (document.getElementById("Hard").checked){
            minesCount = parseInt(document.getElementById("Hard").value, 10); 
        }
    
    
        if (document.getElementById("Small").checked){
            rows = parseInt(document.getElementById("Small").value, 10);
            columns = rows;
            minesCount -= 10;
            document.getElementById("board").style.width = "350px";
            document.getElementById("board").style.height = "350px";
    
            document.getElementById("Game").style.bottom = "30%";
            document.getElementById("Game").style.left = "40%";
        }
        if (document.getElementById("Med").checked){
            rows = parseInt(document.getElementById("Med").value, 10);
            columns = rows;
            document.getElementById("board").style.width = "600px";
            document.getElementById("board").style.height = "600px";
    
            document.getElementById("Game").style.bottom = "10%";
            document.getElementById("Game").style.left = "32%";
            
        }
        if (document.getElementById("Large").checked){
            rows = parseInt(document.getElementById("Large").value, 10); 
            columns = rows;
            minesCount += 10;
            document.getElementById("board").style.width = "750px";
            document.getElementById("board").style.height = "750px";
    
            document.getElementById("Game").style.bottom = "5%";
            document.getElementById("Game").style.left = "30%";
        }

        document.getElementById("Game").style.visibility = "visible";
        document.getElementById("StartMenu").style.visibility = "hidden";
        startGame();
        document.getElementById("Restart-Button").addEventListener("click", restartGame);
    }
    
    
}


var minesLocation = []; // "2-2", "3-4", "2-1"

var tilesClicked = 0; // goal to click all tiles except the ones containing mines
var flagEnabled = false;
var gameOver = false;




function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}
function startGame() {
    document.getElementById("mines-count").innerText = minesCount;

    setMines();

    // Populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", placeFlag); 
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function clickTile(e) {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;

    if (e.type === "contextmenu") {
        e.preventDefault();
        placeFlag.call(tile);
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    let revealedTiles = revealTile(r, c);
    updateDonePercent(revealedTiles);

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}


function placeFlag() {
    if (this.classList.contains("tile-clicked")) {
        return;
    }

    this.innerText = this.innerText === "" ? "🚩" : "";
}

function updateDonePercent(revealedTiles) {
    let totalRevealableTiles = rows * columns - minesCount;
    tilesClicked += revealedTiles;

    let donePercentElement = document.getElementById("Done-Procent");
    let percentComplete = Math.floor((tilesClicked / totalRevealableTiles) * 100);
    
    donePercentElement.innerText = percentComplete + "%";

    let progressBar = document.getElementById("progress-bar");
    progressBar.style.width = percentComplete + "%";

    if (percentComplete === 100) {
        progressBar.style.backgroundColor = "green";
    }
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
                document.getElementById("BombExplotion").style.visibility  = "visible";
            }
        }
    }
}

function revealTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns || board[r][c].classList.contains("tile-clicked")) {
        return 0;
    }

    board[r][c].classList.add("tile-clicked");
    let minesFound = 0;

    minesFound += checkTile(r-1, c-1);
    minesFound += checkTile(r-1, c);
    minesFound += checkTile(r-1, c+1);
    minesFound += checkTile(r, c-1);
    minesFound += checkTile(r, c+1);
    minesFound += checkTile(r+1, c-1);
    minesFound += checkTile(r+1, c);
    minesFound += checkTile(r+1, c+1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
        return 1;
    } else {
        board[r][c].innerText = "";
        return 1 + revealTile(r-1, c-1) + revealTile(r-1, c) + revealTile(r-1, c+1)
            + revealTile(r, c-1) + revealTile(r, c+1)
            + revealTile(r+1, c-1) + revealTile(r+1, c) + revealTile(r+1, c+1);
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    return minesLocation.includes(r.toString() + "-" + c.toString()) ? 1 : 0;
}

function restartGame() {
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    gameOver = false;
    flagEnabled = false;


    document.getElementById("BombExplotion").style.visibility  = "hidden";
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("board").innerHTML = "";
    document.getElementById("Done-Procent").innerText = "%";
    document.getElementById("progress-bar").style.width = "0%";
    document.getElementById("progress-bar").style.backgroundColor = "rgb(146, 230, 245)";
    startGame();
}
