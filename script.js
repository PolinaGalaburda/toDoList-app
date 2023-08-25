"use strict";

// оголошуємо змінні з якими будемо працювати
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks-btn");

// слухачі подій
// запускаємо функцію showTasks коли весь HTML завантажено
document.addEventListener("DOMContentLoaded", showTasks);
// запускаємо функцію addTask коли відправляємо форму (клікаємо на кнопку "Додати завдання")
form.addEventListener("submit", addTask);
// запускаємо функцію deleteTask коли клік попадає на список <ul>
taskList.addEventListener("click", deleteTask);
// запускаємо функцію після кліку на кнопку "Видалити всі елементи"
clearBtn.addEventListener("click", deleteAllTasks);
// запускаємо функцію filterTasks після того як ввідпускаємо клавішу (тоді, коли фокус в інпуті "Пошук завдань")
filterInput.addEventListener("keyup", filterTasks);
// запускаємо функцію editTask після кліку на кнопку редагування
taskList.addEventListener("click", editTask);

function showTasks() {
  // перевіряємо чи є у localStorage вже якісь завдання
  if (localStorage.getItem("tasks")) {
    // якщо вони там є - витягуємо їх і присвоюємо змінній
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    // для кожної задачі яка є
    tasks.forEach((task, index) => {
      // створюємо елемент списку
      const li = document.createElement("li");
      li.textContent = task;
      li.setAttribute("data-index", index);

      const deleteButton = document.createElement("i");
      deleteButton.className = "fa fa-trash btn-delete";

      const editButton = document.createElement("i");
      editButton.className = "fa-solid fa-pencil btn-edit";

      li.append(editButton, deleteButton);
      taskList.append(li);
    });
  }
}
// створення таску
function addTask(event) {
  // зупиняємо поведінку браузера за замовчуванням
  event.preventDefault();

  // отримуємо значення з інпута через форму
  const value = taskInput.value;

  // повторюємо всі дії з функції showTasks
  const li = document.createElement("li");
  li.textContent = value;

  // отримуємо завдання з локального сховища або створюємо порожній список, якщо їх немає
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // встановлюємо індекс для нового завдання
  li.setAttribute("data-index", tasks.length);

  // створюємо кнопку видалення для завдання
  const deleteButton = document.createElement("i");
  deleteButton.className = "fa fa-trash btn-delete";

  const editButton = document.createElement("i");
  editButton.className = "fa-solid fa-pencil btn-edit";
  // додажмо кнопку до завдання та завдання до списку
  li.append(editButton, deleteButton);
  taskList.append(li);

  // зберігаємо завдання в localStorage
  storeTaskInLocalStorage(value);

  // очищуємо поле вводу
  taskInput.value = "";
}

function storeTaskInLocalStorage(task) {
  // оголошуємо змінну яка буде використовуватись для списку завдань
  let tasks;

  // перевіряємо чи є у localStorage вже якісь завдання
  if (localStorage.getItem("tasks") !== null) {
    // якщо вони там є - витягуємо їх і присвоюємо змінній
    tasks = JSON.parse(localStorage.getItem("tasks"));
  } else {
    // якщо їх там нема - присвоюємо змінній значення порожнього масиву
    tasks = [];
  }

  // додаємо до списку нове завдання
  tasks.push(task);

  // зберігаємо список завданнь в Local Storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// функція редагування завдання
function editTask(event) {
  if (event.target.classList.contains("btn-edit")) {
    // отримання поточного тексту завдання
    const currentTask = event.target.previousSibling.textContent;
    // запит на оновлення завдання від користувача
    const newTask = prompt("Оновіть ваше завдання:", currentTask);

    // якщо користувач ввів щось і не натиснув "скасувати"
    if (newTask !== null && newTask.trim() !== "") {
      event.target.previousSibling.textContent = newTask;
      updateTaskInLocalStorage(
        event.target.parentElement.getAttribute("data-index"),
        newTask
      );
    }
  }
}
// функція для оновлення завдання в localStorage
function updateTaskInLocalStorage(index, newTask) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index] = newTask;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// видалення завдання зі списку при кліку на кнопку видалення
function deleteTask(event) {
  // перевіряємо, чи клік було зроблено по кнопці видалення
  if (event.target.classList.contains("btn-delete")) {
    // пересвідчуємось чи юзер справді хоче видалити цей елемент
    if (confirm("Ви впевнені що хочете видалити цю задачу?")) {
      const taskIndex = event.target.closest("li").getAttribute("data-index");

      // видаляємо завдання з DOM
      event.target.closest("li").remove();

      // видаляємо завдання з localStorage
      removeTaskFromLocalStorage(taskIndex);

      // оновлюємо індекси завдань у DOM і localStorage
      updateTaskIndexesInDOMAndStorage();
    }
  }
}
// оновлення індексів завдань в DOM і в localStorage після видалення завдання
function updateTaskIndexesInDOMAndStorage() {
  // отримуємо всі елементи списку завдань
  const taskItems = taskList.querySelectorAll("li");
  const tasks = [];

  // перебираємо всі завдання та оновлюємо їх індекси
  taskItems.forEach((taskItem, index) => {
    taskItem.setAttribute("data-index", index);
    tasks.push(taskItem.firstChild.textContent);
  });

  // зберігаємо оновлений список завдань у localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// видалення завдання з localStorage на основі його індексу
function removeTaskFromLocalStorage(taskIndex) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(taskIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// видалення всіх завдань при кліку на кнопку "видалити всі завдання"
function deleteAllTasks() {
  // пересвідчуємось чи юзер справді хоче видалити всі елементи
  if (confirm("Ви впевнені що хочете видалити всі задачі?")) {
    // видалення всіх завдань з DOM
    taskList.innerHTML = "";
    // видалити всі елементи з localStorage
    removeAllTasksFromLocalStorage();
  }
}

// видалити всі елементи з localStorage
function removeAllTasksFromLocalStorage() {
  localStorage.removeItem("tasks");
}

// фільтруємо завдання на основі введеного тексту в полі пошуку
function filterTasks(event) {
  // отримуємо всі елементи списку
  const tasks = taskList.querySelectorAll("li");
  // отримуємо значення інпуту "Пошук завдань" і робимо його в нижньому регістрі
  const searchQuery = event.target.value.toLowerCase();

  // проходимось по кожному елементу завдань
  tasks.forEach((task) => {
    // отримуємо текст завдання
    const taskValue = task.firstChild.textContent.toLowerCase();

    // перевіряємо чи текст завдання має в собі значення інпута "Пошук завдань"
    if (taskValue.includes(searchQuery)) {
      // якщо має, то display = list-item
      task.style.display = "block";
    } else {
      // якщо ні - ховаємо цей елемент списку
      task.style.display = "none";
    }
  });
}
