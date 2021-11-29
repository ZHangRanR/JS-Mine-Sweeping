var ulBox = document.getElementsByTagName("ul")[0];
var scoreSpan = document.getElementsByTagName("span")[1];
var itemArr = ulBox.children;
var mineArr = []; // 存储地雷位置
var aroundMineArr = []; // 存储每个方格九宫格范围的地雷数
var noMine;
var win;
var score = 0; // 游戏得分

// 模式选择 n = 1 简单模式; n = 2 普通模式; n = 3 困难模式。
var mode = document.getElementsByTagName("select")[0];
var n = mode.selectedIndex + 1;
window.onload = function () {
    init();
}

function init() {
    ulBox.innerHTML = null;
    score = 0;
    scoreSpan.innerText = score;
    aroundMineArr = [];
    mineArr = [];
    createBox();

    // 绑定事件
    ulBox.addEventListener("mouseup", itemClick, false);
}

mode.addEventListener("change", function () {
    n = mode.selectedIndex + 1;
    init();
})




// 创建游戏面板
function createBox() {
    var line = n * 9;  // 游戏界面行数
    var len = (n * 9) ** 2; // 游戏界面方格数
    win = len - (n ** 2 * 9) // 游戏中没有地雷的方格数
    ulBox.style.width = 30 * line + "px";
    ulBox.style.height = 30 * line + "px";

    for (var i = 1; i <= len; i++) {
        var liItem = document.createElement("li");
        var row = Math.ceil(i / line);
        var col = Math.ceil(i % line) !== 0 ? Math.ceil(i % line) : line;

        liItem.setAttribute("class", "itemBox");
        liItem.setAttribute("data-row", row);
        liItem.setAttribute("data-col", col);

        ulBox.append(liItem);
    }
    createMine();
}




// 随机生成地雷
function createMine() {
    var line = n * 9;
    var countMine = n ** 2 * 9;
    var sqr = n * 3;
    for (var i = 0; i < countMine; i++) {
        mineArr[i] = [];
        var rowNumber = Math.ceil(Math.random() * 3) + Math.floor(i / sqr) * 3;
        var colNumber = Math.ceil(Math.random() * 3) + i % sqr * 3;

        var index = (rowNumber - 1) * line + colNumber - 1;
        mineArr[i].push(rowNumber, colNumber);
        itemArr[index].classList.add("mineItem");
    }

    noMineItem = Array.prototype.filter.call(itemArr, function (ele) {
        return !ele.classList.contains("mineItem");
    })
    nearbyMine();
}


// 获取 每个网格的坐标
function nearbyMine() {
    var len = itemArr.length;
    var row, col;
    var line = n * 9;
    for (var i = 1; i <= len; i++) {
        row = Math.ceil(i / line);
        col = Math.ceil(i % line) !== 0 ? Math.ceil(i % line) : line;
        aroundEle(row, col);
        // console.log(row,col);
    }
}

// 获取元素周边地雷数量
function aroundEle(row, col) {
    var line = n * 9;
    var diffRow = [-1, -1, -1, 0, 0, 1, 1, 1];
    var diffCol = [-1, 0, 1, -1, 1, -1, 0, 1];
    var aroundRow, aroundCol, index;
    var count = 0;
    for (var i = 0; i < 8; i++) {
        aroundRow = row + diffRow[i];
        aroundCol = col + diffCol[i];
        if (aroundRow > 0 && aroundRow <= line && aroundCol > 0 && aroundCol <= line) {
            index = (aroundRow - 1) * line + aroundCol - 1;
            count = itemArr[index].classList.contains("mineItem") ? count += 1 : count;

        }
    }
    aroundMineArr.push(count);
}


// 扩散
function diffuse(row, col) {
    var line = n * 9;
    var diffRow = [-1, 0, 0, 1];
    var diffCol = [0, 1, -1, 0];

    index = (row - 1) * line + col - 1;
    if (aroundMineArr[index] !== 0) {
        if (itemArr[index] !== "💣") {
            itemArr[index].style.background = "#ddd";
            if (itemArr[index].innerText === "") {
                itemArr[index].innerText = aroundMineArr[index];
                score = score + 1;
                isWin();
            }
        }
    } else {
        if (itemArr[index].innerText === "") {
            score = score + 1;
            isWin();
        }
        itemArr[index].innerText = "0";
        itemArr[index].style.color = "transparent";
        itemArr[index].style.background = "#ddd";

        // 向上扩散
        for (var i = 0; i < 4; i++) {
            aroundRow = row + diffRow[i];
            aroundCol = col + diffCol[i];
            if (aroundRow > 0 && aroundCol > 0 && aroundRow <= line && aroundCol <= line) {
                index = (aroundRow - 1) * line + aroundCol - 1;
            }
            if (index > 0 && index < line * line && itemArr[index].innerText === "") {
                diffuse(aroundRow, aroundCol);
            }
        }
    }

    scoreSpan.innerText = score;

}

// 判断游戏是否结束
function isWin() {
    if (score === win) {
        clearTimeout(timer);
        requestAnimationFrame
        var timer = setTimeout(function () {
            ulBox.removeEventListener("mouseup", itemClick, false);
            alert("you win!");
        }, 100);
    }
}

// 点击事件
function itemClick(e) {
    var ele = e.target;
    if (e.button === 0) {
        if (ele.innerText === "🚩" || ele.innerText === "❓") {
            ele.innerText = "";
        }
        var r = n * 9;
        var row = parseInt(e.target.dataset.row);
        var col = parseInt(e.target.dataset.col);
        var index = (row - 1) * r + col - 1;
        if (itemArr[index].classList.contains("mineItem")) {
            ele.innerText = "💣";
            itemArr[index].style.background = "#ddd";
            ulBox.removeEventListener("mouseup", itemClick, false);
            clearTimeout(timer_02);
            var timer_02 = setTimeout(() => {
                alert("game over!");
            }, 100)
            return;
        }
        diffuse(row, col);
    } else if (e.button === 2) {
        if (ele.innerText === "") {
            ele.innerText = "🚩";
        } else if (ele.innerText === "🚩") {
            ele.innerText = "❓";
        } else if (ele.innerText === "❓") {
            ele.innerText = "";
        }
    }

}


// 解除鼠标右键默认功能
ulBox.addEventListener("contextmenu", function (e) {
    e.preventDefault();
})

