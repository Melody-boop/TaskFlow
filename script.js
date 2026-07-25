/*console.log("Hello Melody");*/
// ===========================
// SELECT HTML ELEMENTS
// ===========================

const taskForm = document.getElementById("task-form");

const taskInput = document.getElementById("task-input");

const dueDate = document.getElementById("due-date");
const dueTime = document.getElementById("due-time");

const taskList = document.getElementById("task-list");

const totalTasks = document.getElementById("total-tasks");

const pendingTasks = document.getElementById("pending-tasks");

const completedTasks = document.getElementById("completed-tasks");

const emptyMessage = document.getElementById("empty-message");

const filterButtons = document.querySelectorAll(".filter-btn");

const priority = document.getElementById("priority");

const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("theme-toggle");
const themeBtn = document.querySelector(".theme-btn");
const greeting = document.getElementById("greeting");
const changeNameBtn = document.getElementById("change-name");
const notification = document.getElementById("notification");

function showNotification(message) {

    notification.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);

}


function updateGreeting() {

    let name = localStorage.getItem("username");

    if (!name) {
        name = prompt("Welcome to TaskFlow! What is your name?");

        if (name) {
            localStorage.setItem("username", name);
        } else {
            name = "User";
        }
    }

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {
        message = "🌅 Good Morning";
    }
    else if (hour < 18) {
        message = "☀️ Good Afternoon";
    }
    else {
        message = "🌙 Good Evening";
    }

    greeting.textContent = `${message}, ${name}!`;
}


updateGreeting();

if (changeNameBtn) {
    changeNameBtn.addEventListener("click", function () {

        const newName = prompt("Enter your name:");

        if (newName) {
            localStorage.setItem("username", newName);
            updateGreeting();
        }

    });
}


// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.innerHTML = "☀️";
}


// Toggle theme
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    // Save theme preference
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Change icon
    themeBtn.innerHTML = isDark ? "☀️" : "🌙";

});

let currentFilter = "all";
let currentSearch = "";

function updateStatistics() {


    const total = document.querySelectorAll(".task-card").length;

    const completed = document.querySelectorAll(".task-card.completed").length;

    const pending = total - completed;

    totalTasks.textContent = total;

    pendingTasks.textContent = pending;

    completedTasks.textContent = completed;

}
function formatDueDate(date, time) {

    if (!date) {
        return "No due date";
    }

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    const formattedDate = new Date(date).toLocaleDateString(
        "en-GB",
        options
    );

    if (time) {
        return `📅 ${formattedDate} • ${time}`;
    }

    return `📅 ${formattedDate}`;
}
function clearForm() {
    taskInput.value = "";
    dueDate.value = "";
    dueTime.value = "";
    priority.value = "Medium";

    taskInput.focus();
}

function sortTasks() {

    const tasks = Array.from(taskList.children);

    tasks.sort(function (a, b) {

        const aCompleted = a.classList.contains("completed");
        const bCompleted = b.classList.contains("completed");

        if (aCompleted === bCompleted) {
            return 0;
        }

        return aCompleted ? 1 : -1;

    });


    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        taskList.appendChild(task);
    });

}
function updateTaskDisplay() {

    const tasks = document.querySelectorAll(".task-card");

    tasks.forEach(function (task) {

        const completed = task.classList.contains("completed");

        const title = task
            .querySelector("h3")
            .textContent
            .toLowerCase();

        const matchesSearch =
            title.includes(currentSearch.toLowerCase());

        let matchesFilter = false;

        if (currentFilter === "all") {
            matchesFilter = true;
        }

        else if (currentFilter === "active") {
            matchesFilter = !completed;
        }

        else if (currentFilter === "completed") {
            matchesFilter = completed;
        }

        task.style.display =
            matchesSearch && matchesFilter
                ? "flex"
                : "none";

    });

}
function saveTasks() {
    console.log("Saving tasks");

    const tasks = [];

    document.querySelectorAll(".task-card").forEach(function (task) {

        tasks.push({

            title: task.querySelector("h3").textContent,

            date: task.dataset.date,

            time: task.dataset.time,

            priority: task.dataset.priority,

            completed: task.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(function (task) {
        createTask(
            task.title,
            task.date,
            task.time,
            task.priority,
            task.completed
        );
    });
    updateTaskDisplay();
}
function createTask(taskText, dueDateValue, dueTimeValue, priorityValue, isCompleted = false) {
    const dueText = formatDueDate(dueDateValue, dueTimeValue);
    const newTask = document.createElement("li");
    newTask.dataset.date = dueDateValue;
    newTask.dataset.time = dueTimeValue;
    newTask.dataset.priority = priorityValue;
    newTask.classList.add("task-card");
    if (isCompleted) {
        newTask.classList.add("completed");
    }
    newTask.innerHTML = `
    <div class="task-content">
        <h3>${taskText}</h3>
        <p>${dueText}</p>
        <span class="priority-badge ${priorityValue.toLowerCase()}">
        ${priorityValue}
    </span>
 </div>
 <div class="task-card-actions">
        <button class="complete-btn">
            <i class="${isCompleted ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}"></i>
        </button>

        <button class="edit-btn">
            <i class="fa-solid fa-pen"></i>
        </button>

        <button class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
    `;

    taskList.appendChild(newTask);

    const completeBtn = newTask.querySelector(".complete-btn");
    const deleteBtn = newTask.querySelector(".delete-btn");
    const editBtn = newTask.querySelector(".edit-btn");

    editBtn.addEventListener("click", function () {
        const taskTitle = newTask.querySelector("h3");
        const taskDate = newTask.querySelector("p");
        const priorityBadge = newTask.querySelector(".priority-badge");
        const updatedTask = prompt("Edit task:", taskTitle.textContent);

        if (updatedTask === null || updatedTask.trim() === "") {
            return;
        }
        const updatedDate = prompt("Edit date:", newTask.dataset.date);
        if (updatedDate === null) return;
        const updatedTime = prompt("Edit time:", newTask.dataset.time);
        if (updatedTime === null) return;
        const updatedPriority = prompt(
            "Edit priority (High, Medium, Low):",
            newTask.dataset.priority
        );
        if (updatedPriority === null) {
            return;
        }
        const normalizedPriority =
            updatedPriority.charAt(0).toUpperCase() +
            updatedPriority.slice(1).toLowerCase();

        const validPriorities = ["High", "Medium", "Low"];
        if (!validPriorities.includes(normalizedPriority)) {
            showNotification("Priority must be High, Medium or Low.");
            return;
        }
        taskTitle.textContent = updatedTask.trim();
        newTask.dataset.date = updatedDate;
        newTask.dataset.time = updatedTime;
        newTask.dataset.priority = normalizedPriority;
        priorityBadge.textContent = normalizedPriority;
        priorityBadge.className =
            `priority-badge ${normalizedPriority.toLowerCase()}`;
        taskDate.textContent = formatDueDate(updatedDate, updatedTime);
        saveTasks();
    });
    deleteBtn.addEventListener("click", function () {
        newTask.remove();
        updateStatistics();
        saveTasks();

        if (taskList.children.length === 0) {
            emptyMessage.style.display = "block";
        }
    });
    completeBtn.addEventListener("click", function () {
        newTask.classList.toggle("completed");
        const icon = completeBtn.querySelector("i");
        if (newTask.classList.contains("completed")) {
            icon.className = "fa-solid fa-circle-check";
        } else {
            icon.className = "fa-regular fa-circle";
        }
        sortTasks();
        updateStatistics();
        saveTasks();

    });

    emptyMessage.style.display = "none";

    updateStatistics();

    sortTasks();

    updateTaskDisplay();

}
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    const dueDateValue = dueDate.value;
    const dueTimeValue = dueTime.value;
    const priorityValue = priority.value;
    if (taskText === "") {
        showNotification("Please enter a task");
        return;
    }
    createTask(
        taskText,
        dueDateValue,
        dueTimeValue,
        priorityValue,
        false
    );

    saveTasks();

    clearForm();

});
filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.textContent.toLowerCase();

        updateTaskDisplay();

    });

});
searchInput.addEventListener("input", function () {

    currentSearch = searchInput.value;

    updateTaskDisplay();

});
updateTaskDisplay();