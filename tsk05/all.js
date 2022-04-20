const add_txt = document.querySelector('.add_txt');
const btn_add = document.querySelector('.btn_add');
const btn_all = document.querySelector(".btn_all");
const btn_undone = document.querySelector(".btn_undone");
const btn_done = document.querySelector(".btn_done");
const menu = document.querySelector(".menu");
const todoList = document.querySelector(".todoList");
const undone_cnt = document.querySelector(".undone_cnt");
const btn_clearDone = document.querySelector(".btn_clearDone");

let data = [];  // 代辦事項

// 計算待完成項目的數量
function calc_undone_cnt() {
    let c = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].checked == false) c++;
    }
    undone_cnt.textContent = c + " 個待完成項目";
}

// 給予項目其內容
function render() {
    let str = "";
    data.forEach(function (item, index) {
        let content;
        if (data[index].checked) {
            content = `<li>
            <label data-num="${index}" ><input data-num="${index}" class="checkBox" type="checkbox" checked><span >✔</span>
            <p>${item.todoList}</p>
            </label><input class="delete" type="button" value="X"></li>`;
        } else {
            content = `<li>
            <label data-num="${index}"><input data-num="${index}" class="checkBox" type="checkbox"><span >✔</span>
            <p>${item.todoList}</p>
            </label><input class="delete" type="button" value="X"></li>`;
        }
        str += content;
    })
    todoList.innerHTML = str;  // 將 str 寫入 HTML
    calc_undone_cnt();  // 重新計算代完成項目的數量

    // 刷新 selected 位置
    const whereSelected = menu.querySelector(".selected");
    refresh_menu(whereSelected);
}

//刷新 menu，抓取目前分類位置
function refresh_menu(tag) {
    const checkBox = todoList.querySelectorAll(".checkBox");
    if (tag.value === "待完成") {
        btn_all.classList.remove("selected");
        btn_done.classList.remove("selected");
        // 只顯示待完成的 checkBox
        for (let i = 0; i < data.length; i++) {
            if (data[i].checked) {
                checkBox[i].parentNode.parentNode.style.display = 'none';
            } else {
                /*
                parentNode 屬性以 Node 物件返回指定節點的父節點
                兩次返回（checkBox → label → li）
                再設定 display: flex;
                 */
                checkBox[i].parentNode.parentNode.style.display = 'flex';
            }
        }
    } else if (tag.value === "已完成") {
        btn_undone.classList.remove("selected");
        btn_all.classList.remove("selected");
        // 只顯示已完成的 checkBox
        for (let i = 0; i < data.length; i++) {
            if (data[i].checked) {
                checkBox[i].parentNode.parentNode.style.display = 'flex';
            } else {
                checkBox[i].parentNode.parentNode.style.display = 'none';
            }
        }
    } else {
        btn_done.classList.remove("selected");
        btn_undone.classList.remove("selected");
        // 顯示全部的 checkBox
        for (let i = 0; i < data.length; i++) {
            checkBox[i].parentNode.parentNode.style.display = 'flex';
        }
    }
}

// 是否勾選以判斷是否完成
todoList.addEventListener("click", function (e) {
    let num = e.target.dataset.num;
    let checkBox = todoList.querySelectorAll(".checkBox");
    if (e.target.nodeName !== "INPUT" || e.target.className === "delete") return;
    if (checkBox[num].checked) {
        data[num].checked = true;
    } else {
        data[num].checked = false;
    }
    calc_undone_cnt();
    let whereSelected = menu.querySelector(".selected");
    refresh_menu(whereSelected);
})

// 新增項目:方法1
btn_add.addEventListener("click", function (e) {
    let content = add_txt.value.trim();  // 清除多餘空白
    if (content === "") return;  // 輸入欄空白則不執行
    // 資料放入（未完成、項目）
    data.push({
        checked: false,
        todoList: content
    });
    render();
    // 清空輸入欄
    add_txt.value = "";
})

// 新增項目:方法2
add_txt.addEventListener("keyup", function (e) {
    // 直接按 Enter 也可執行新增項目
    if (e.keyCode === 13) {
        e.preventDefault();  //阻止元素發生默認行為（預防)
        btn_add.click();
    }
});

// 選擇哪個分類（全部、待完成、已完成）
menu.addEventListener("click", function (e) {
    //添加 class - selected 給目標 class
    e.target.classList.add("selected");
    refresh_menu(e.target);
})

// 清除已完成項目
btn_clearDone.addEventListener("click", function () {
    // 檢查已勾選為完成
    for (let i = 0; i < data.length; i++) {
        if (data[i].checked) {
            data.splice(i, 1);  // 刪除項目
        }
    }
    render();
})

// 點選 delete 刪除項目
todoList.addEventListener("click", function (e) {
    // 未點選 delete 則不繼續執行
    if (e.target.className !== "delete") return;
    //  previousSibling 回傳當前元素的上一父節點（label 的 X → li）
    data.splice(e.target.previousSibling.dataset.num, 1);
    render();
})