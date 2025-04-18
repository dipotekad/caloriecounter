// --- Пользовательская авторизация ---

// Хранение пользователей в localStorage в формате:
// users = { username1: hashedPassword1, username2: hashedPassword2, ... }
// currentUser - логин текущего пользователя

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterBtn = document.getElementById("show-register");
const showLoginBtn = document.getElementById("show-login");
const authContainer = document.getElementById("auth-container");
const appContainer = document.getElementById("app-container");
const userGreeting = document.getElementById("user-greeting");
const logoutBtn = document.getElementById("logout-btn");

const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function hashPassword(password) {
  // Простое хеширование для демонстрации (не безопасно для реальных проектов)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

function setCurrentUser(username) {
  localStorage.setItem("currentUser", username);
}

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  appContainer.classList.add("hidden");
  authContainer.classList.remove("hidden");
  clearForms();
}

// Переключение между формами
showRegisterBtn.addEventListener("click", () => {
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
  clearErrors();
  clearForms();
});

showLoginBtn.addEventListener("click", () => {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
  clearErrors();
  clearForms();
});

// Очистка ошибок
function clearErrors() {
  loginError.textContent = "";
  registerError.textContent = "";
}

// Очистка форм
function clearForms() {
  loginForm.reset();
  registerForm.reset();
}

// Обработка регистрации
registerForm.addEventListener("submit", e => {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;
  const passwordConfirm = document.getElementById("register-password-confirm").value;

  if (username.length < 3) {
    registerError.textContent = "Логин должен быть не менее 3 символов";
    return;
  }
  if (password.length < 6) {
    registerError.textContent = "Пароль должен быть не менее 6 символов";
    return;
  }
  if (password !== passwordConfirm) {
    registerError.textContent = "Пароли не совпадают";
    return;
  }

  const users = getUsers();
  if (users[username]) {
    registerError.textContent = "Пользователь с таким логином уже существует";
    return;
  }

  users[username] = hashPassword(password);
  saveUsers(users);
  setCurrentUser(username);
  startApp();
});

// Обработка входа
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const users = getUsers();

  if (!users[username]) {
    loginError.textContent = "Пользователь не найден";
    return;
  }

  if (users[username] !== hashPassword(password)) {
    loginError.textContent = "Неверный пароль";
    return;
  }

  setCurrentUser(username);
  startApp();
});

// Выход
logoutBtn.addEventListener("click", () => {
  logoutUser();
});

// --- Основное приложение ---

const mealsDB = {
  underweight: [
    "Смузи с орехами и бананом",
    "Авокадо тост с яйцом",
    "Паста с соусом песто и курицей",
    "Овсянка с ягодами и мёдом",
    "Греческий йогурт с гранолой",
    "Рис с овощами и тофу",
    "Ореховые батончики домашние",
    "Запечённый картофель с сыром"
  ],
  normal: [
    "Салат с курицей и авокадо",
    "Рыба на пару с брокколи",
    "Овощное рагу с индейкой",
    "Киноа с овощами и фета",
    "Тушёная капуста с морковью",
    "Запечённый лосось с лимоном",
    "Суп из чечевицы",
    "Тост с хумусом и овощами"
  ],
  overweight: [
    "Овощной суп с зеленью",
    "Гречка с тушёными овощами",
    "Запечённая рыба с лимоном",
    "Салат из свежих овощей с оливковым маслом",
    "Куриное филе на гриле с зеленью",
    "Тушёные кабачки и баклажаны",
    "Смузи из шпината и огурца",
    "Суп-пюре из цветной капусты"
  ]
};

const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const calculateBtn = document.getElementById("calculate-btn");
const resultDiv = document.getElementById("result");
const mealsDiv = document.getElementById("meals");

calculateBtn.addEventListener("click", () => {
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value) / 100;

  if (!weight || !height || weight < 20 || weight > 300 || height < 1 || height > 2.5) {
    resultDiv.style.color = "#d93025";
    resultDiv.textContent = "Пожалуйста, введите корректные значения веса и роста.";
    mealsDiv.innerHTML = "";
    return;
  }

  const bmi = weight / (height * height);
  let category = "";
  let color = "";

  if (bmi < 18.5) {
    category = "Недостаток веса";
    color = "#ffc44d";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = "Нормальный вес";
    color = "#0be881";
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = "Избыточный вес";
    color = "#ff884d";
  } else {
    category = "Ожирение";
    color = "#ff4444";
  }

  resultDiv.style.color = color;
  resultDiv.textContent = `Ваш ИМТ: ${bmi.toFixed(2)} (${category})`;

  // Вывод блюд
  let mealsList = [];
  if (category === "Недостаток веса") {
    mealsList = mealsDB.underweight;
  } else if (category === "Нормальный вес") {
    mealsList = mealsDB.normal;
  } else {
    mealsList = mealsDB.overweight;
  }

  mealsDiv.innerHTML = "<h3>Рекомендуемые блюда:</h3><ul>" +
    mealsList.map(meal => `<li>${meal}</li>`).join("") +
    "</ul>";
});

// Запуск приложения если пользователь уже залогинен
function startApp() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    userGreeting.textContent = `Привет, ${currentUser}!`;
    clearErrors();
    clearForms();
    resultDiv.textContent = "";
    mealsDiv.innerHTML = "";
    weightInput.value = "";
    heightInput.value = "";
  } else {
    authContainer.classList.remove("hidden");
    appContainer.classList.add("hidden");
  }
}

// При загрузке страницы
window.onload = () => {
  startApp();
};
