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

const COUNTER_API = "https://api.counterapi.dev/v1/youbang-profile-2026/likes";

// 1. 先從本地讀取備援數字，保證畫面一打開絕對不會是空白 ()
let currentLikes = Number(localStorage.getItem("my-profile-likes")) || 0;
likeCountSpan.textContent = currentLikes;

// 2. 嘗試向雲端查詢全球總數
async function loadGlobalLikes() {
  try {
    const res = await fetch(COUNTER_API);
    if (!res.ok) throw new Error("API 回應異常");
    const data = await res.json();
    if (typeof data.count === "number") {
      currentLikes = data.count;
      likeCountSpan.textContent = currentLikes;
      localStorage.setItem("my-profile-likes", currentLikes);
    }
  } catch (error) {
    console.warn("雲端計數暫時無法連線，已自動切換為本地計數模式");
  }
}
loadGlobalLikes();

// 3. 點擊按鈕時：先立刻讓畫面數字 +1，再背景同步雲端
likeBtn.addEventListener("click", async () => {
  currentLikes += 1;
  likeCountSpan.textContent = currentLikes;
  localStorage.setItem("my-profile-likes", currentLikes);

  try {
    const res = await fetch(`${COUNTER_API}/up`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === "number") {
        currentLikes = data.count;
        likeCountSpan.textContent = currentLikes;
        localStorage.setItem("my-profile-likes", currentLikes);
      }
    }
  } catch (error) {
    // 雲端失敗時數字也已經安全存在本地了
  }
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
typeEffect();// --- 新增「功能四：無跳轉雲端留言表單」 ---
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // 阻止瀏覽器預設跳轉到 Formspree 感謝頁
  formStatus.textContent = "傳送中...";

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      formStatus.textContent = "✅ 留言已成功寄出，謝謝你！";
      contactForm.reset(); // 清空輸入框
    } else {
      formStatus.textContent = "❌ 傳送失敗，請檢查表單網址是否正確。";
    }
  } catch (error) {
    formStatus.textContent = "❌ 網路錯誤，無法送出留言。";
  }
});