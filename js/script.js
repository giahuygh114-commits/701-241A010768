// Menu điều hướng dùng chung
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Bài 1: dữ liệu và tìm kiếm sản phẩm
const productList = document.querySelector("#productList");
if (productList) {
  const products = [
    { id: 1, name: "iPhone 15", category: "Điện thoại", price: 18000000, icon: "📱", description: "Điện thoại thông minh, thiết kế hiện đại." },
    { id: 2, name: "Samsung Galaxy S24", category: "Điện thoại", price: 20000000, icon: "📲", description: "Màn hình sắc nét và hiệu năng mạnh mẽ." },
    { id: 3, name: "MacBook Air", category: "Laptop", price: 25000000, icon: "💻", description: "Laptop mỏng nhẹ cho học tập và công việc." },
    { id: 4, name: "iPad Air", category: "Máy tính bảng", price: 15000000, icon: "📟", description: "Máy tính bảng phục vụ học tập, giải trí." },
    { id: 5, name: "AirPods Pro", category: "Phụ kiện", price: 6000000, icon: "🎧", description: "Tai nghe không dây nhỏ gọn." },
    { id: 6, name: "Chuột không dây", category: "Phụ kiện", price: 350000, icon: "🖱️", description: "Chuột tiện dụng cho máy tính." }
  ];
  const searchInput = document.querySelector("#searchInput");
  const emptyMessage = document.querySelector("#emptyMessage");
  const resultCount = document.querySelector("#resultCount");
  const formatPrice = value => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

  function renderProducts(items) {
    productList.replaceChildren();
    items.forEach(product => {
      const card = document.createElement("article");
      card.className = "product-card";
      const icon = document.createElement("div");
      icon.className = "product-emoji";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = product.icon;
      const title = document.createElement("h2");
      title.textContent = product.name;
      const description = document.createElement("p");
      description.textContent = product.description;
      const bottom = document.createElement("div");
      bottom.className = "product-bottom";
      const price = document.createElement("span");
      price.className = "price";
      price.textContent = formatPrice(product.price);
      const button = document.createElement("button");
      button.className = "add-button";
      button.type = "button";
      button.textContent = "Xem sản phẩm";
      button.dataset.productId = String(product.id);
      bottom.append(price, button);
      card.dataset.name = product.name;
      card.append(icon, title, description, bottom);
      productList.append(card);
    });
    emptyMessage.hidden = items.length !== 0;
    resultCount.textContent = `Hiển thị ${items.length}/${products.length} sản phẩm`;
  }

  function searchProducts() {
    const keyword = searchInput.value.trim().toLocaleLowerCase("vi");
    const filtered = products.filter(product =>
      product.name.toLocaleLowerCase("vi").includes(keyword)
    );
    renderProducts(filtered);
  }

  searchInput.addEventListener("input", searchProducts);
  document.querySelector("#clearSearch").addEventListener("click", () => {
    searchInput.value = "";
    searchProducts();
    searchInput.focus();
  });

  // Event Delegation: một listener xử lý nút của tất cả thẻ sản phẩm.
  productList.addEventListener("click", event => {
    const button = event.target.closest(".add-button");
    if (!button) return;
    const product = products.find(item => item.id === Number(button.dataset.productId));
    if (product) window.alert(`Bạn đã chọn: ${product.name}`);
  });

  renderProducts(products);
}

// Bài 2: kiểm tra biểu mẫu. Không lưu mật khẩu vào LocalStorage.
const registerForm = document.querySelector("#registerForm");
if (registerForm) {
  const fields = {
    name: document.querySelector("#fullName"),
    email: document.querySelector("#email"),
    password: document.querySelector("#password"),
    terms: document.querySelector("#terms")
  };
  const message = document.querySelector("#formMessage");
  const savedInfo = document.querySelector("#savedUserInfo");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  function setError(id, text) {
    document.querySelector(`#${id}`).textContent = text;
  }
  function clearErrors() {
    ["nameError", "emailError", "passwordError", "termsError"].forEach(id => setError(id, ""));
    message.textContent = "";
    message.className = "form-message";
  }
  function showSavedUser() {
    try {
      const user = JSON.parse(localStorage.getItem("demoRegisteredUser") || "null");
      savedInfo.textContent = user ? `Thông tin demo đã lưu: ${user.fullName} (${user.email})` : "Chưa có thông tin demo được lưu.";
    } catch {
      savedInfo.textContent = "Không đọc được thông tin demo đã lưu.";
    }
  }

  registerForm.addEventListener("submit", event => {
    event.preventDefault();
    clearErrors();
    const fullName = fields.name.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value;
    let valid = true;

    if (fullName.length < 2) { setError("nameError", "Vui lòng nhập họ tên (ít nhất 2 ký tự)."); valid = false; }
    if (!emailPattern.test(email)) { setError("emailError", "Email chưa đúng định dạng."); valid = false; }
    if (!passwordPattern.test(password)) { setError("passwordError", "Mật khẩu cần từ 8 ký tự, có chữ hoa, chữ thường và số."); valid = false; }
    if (!fields.terms.checked) { setError("termsError", "Bạn cần đồng ý với điều khoản."); valid = false; }

    if (!valid) {
      message.textContent = "Vui lòng kiểm tra lại thông tin.";
      message.classList.add("error");
      return;
    }

    try {
      // Chỉ lưu họ tên và email; tuyệt đối không lưu mật khẩu.
      localStorage.setItem("demoRegisteredUser", JSON.stringify({ fullName, email, registeredAt: new Date().toISOString() }));
      message.textContent = "Đăng ký demo thành công! Thông tin cơ bản đã được lưu trên trình duyệt.";
      message.classList.add("success");
      registerForm.reset();
      showSavedUser();
    } catch {
      message.textContent = "Không thể lưu dữ liệu trên trình duyệt này.";
      message.classList.add("error");
    }
  });

  document.querySelector("#clearSavedUser").addEventListener("click", () => {
    localStorage.removeItem("demoRegisteredUser");
    showSavedUser();
    message.textContent = "Đã xóa thông tin demo.";
    message.className = "form-message success";
  });
  showSavedUser();
}

// Bài 3: countdown 10 phút. Luôn dừng interval trước khi tạo hoặc đặt lại.
const timerDisplay = document.querySelector("#timerDisplay");
if (timerDisplay) {
  const initialSeconds = 10 * 60;
  let remainingSeconds = initialSeconds;
  let intervalId = null;
  const display = timerDisplay;
  const card = document.querySelector("#timerCard");
  const status = document.querySelector("#timerStatus");
  const startButton = document.querySelector("#startTimer");
  const pauseButton = document.querySelector("#pauseTimer");
  const resetButton = document.querySelector("#resetTimer");

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  function renderTimer() {
    display.textContent = formatTime(remainingSeconds);
    card.classList.toggle("warning", remainingSeconds > 0 && remainingSeconds < 60);
  }
  function stopTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  function tick() {
    remainingSeconds = Math.max(0, remainingSeconds - 1);
    renderTimer();
    if (remainingSeconds === 0) {
      stopTimer();
      startButton.disabled = true;
      pauseButton.disabled = true;
      status.textContent = "Đã hết giờ!";
      window.alert("Đồng hồ đếm ngược đã kết thúc!");
    }
  }

  startButton.addEventListener("click", () => {
    if (intervalId !== null || remainingSeconds === 0) return;
    intervalId = window.setInterval(tick, 1000);
    startButton.disabled = true;
    pauseButton.disabled = false;
    status.textContent = "Đang đếm ngược...";
  });
  pauseButton.addEventListener("click", () => {
    stopTimer();
    startButton.disabled = remainingSeconds === 0;
    pauseButton.disabled = true;
    status.textContent = "Đã tạm dừng";
  });
  resetButton.addEventListener("click", () => {
    stopTimer();
    remainingSeconds = initialSeconds;
    renderTimer();
    startButton.disabled = false;
    pauseButton.disabled = true;
    status.textContent = "Đã đặt lại — sẵn sàng bắt đầu";
  });
  renderTimer();
}
