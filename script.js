// 1. 抓取 HTML 元素
const themeBtn = document.getElementById("theme-btn");
const likeBtn = document.getElementById("like-btn");
const likeCountSpan = document.getElementById("like-count");
const typewriterSpan = document.getElementById("typewriter");

// 2. 功能一：切換日夜模式（並記住上次的設定）
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeBtn.textContent = "🌙";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  themeBtn.textContent = isLight ? "🌙" : "☀️";
  // 把目前主題存進瀏覽器
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// 3. 功能二：打招呼計數器（使用 localStorage 永久記憶，重整不歸零）
let count = Number(localStorage.getItem("likeCount")) || 0;
likeCountSpan.textContent = count;

likeBtn.addEventListener("click", () => {
  count = count + 1;
  likeCountSpan.textContent = count;
  // 把最新數字存進瀏覽器
  localStorage.setItem("likeCount", count);
});

// 4. 功能三：打字機動態文字循環效果
const titles = [
  "網頁開發學習者",
  "創意工作者",
  "VS Code 實戰玩家"
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = titles[titleIndex];

  if (isDeleting) {
    // 刪字模式
    typewriterSpan.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // 打字模式
    typewriterSpan.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  // 控制打字與刪字的速度（毫秒）
  let typingSpeed = isDeleting ? 60 : 120;

  // 如果整句話打完了，停頓 1.5 秒後開始刪除
  if (!isDeleting && charIndex === currentText.length) {
    typingSpeed = 1500;
    isDeleting = true;
  } 
  // 如果整句話刪完了，換下一句話並停頓 0.4 秒後重新打字
  else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    typingSpeed = 400;
  }

  setTimeout(typeEffect, typingSpeed);
}

// 網頁載入後啟動打字機效果
typeEffect();