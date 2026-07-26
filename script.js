/*console.log("Hello Melody");*/
// ===========================
// SELECT HTML ELEMENTS
// ===========================
const editModal = document.getElementById("edit-modal");

const editTaskInput = document.getElementById("edit-task-input");

const editDate = document.getElementById("edit-date");

const editTime = document.getElementById("edit-time");

const editPriority = document.getElementById("edit-priority");

const cancelEdit = document.getElementById("cancel-edit");

const saveEdit = document.getElementById("save-edit");

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
const welcomeModal = document.getElementById("welcome-modal");

const nameInput = document.getElementById("name-input");

const saveName = document.getElementById("save-name");

const username = document.getElementById("username");

const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("theme-toggle");
const themeBtn = document.querySelector(".theme-btn");
const greeting = document.getElementById("greeting");
const changeNameBtn = document.getElementById("change-name");
const notification = document.getElementById("notification");
const deleteModal = document.getElementById("delete-modal");
const cancelDelete = document.getElementById("cancel-delete");
const confirmDelete = document.getElementById("confirm-delete");
const closeModalBtn = document.getElementById("close-modal");
const skipName = document.getElementById("skip-name");

skipName.addEventListener("click", function () {

    welcomeModal.classList.remove("show");

    updateGreeting();

});
closeModalBtn.addEventListener("click", function () {

    editModal.classList.remove("show");

    taskToEdit = null;

});

let taskToDelete = null;
let taskToEdit = null;

function showNotification(message, type = "info") {

    //const notification = document.getElementById("notification");

    notification.textContent = message;

    notification.className = "";

    notification.classList.add(type);

    notification.classList.add("show");

    setTimeout(function () {

        notification.classList.remove("show");

    }, 3000);

}
function updateGreeting() {

    let name = localStorage.getItem("username");

    // If no name has been saved, show the welcome modal
    if (!name) {
        name = "Guest";
        return;
    }

    // Update profile badge
    username.textContent = name;

    // Decide greeting based on time
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

        nameInput.value = localStorage.getItem("username") || "";

        welcomeModal.classList.add("show");

    });

}

saveName.addEventListener("click", function () {

    const name = nameInput.value.trim();

    if (name === "") {

        showNotification("Please enter your name.", "error");

        return;

    }

    localStorage.setItem("username", name);
    username.textContent = name;

    welcomeModal.classList.remove("show");

    updateGreeting();

    showNotification(`👋 Welcome, ${name}!`, "success");

});


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
function updateOverdueTasks() {

    const now = new Date();

    document.querySelectorAll(".task-card").forEach(function (task) {

        // Completed tasks can never be overdue
        if (task.classList.contains("completed")) {
            task.classList.remove("overdue");
            return;
        }

        const date = task.dataset.date;
        const time = task.dataset.time;

        // No due date = not overdue
        if (!date) {
            task.classList.remove("overdue");
            return;
        }

        // Build the full due date and time
        let dueDateTime;

        if (time) {
            dueDateTime = new Date(`${date}T${time}`);
        } else {
            dueDateTime = new Date(`${date}T23:59`);
        }

        if (dueDateTime < now) {
            task.classList.add("overdue");
        } else {
            task.classList.remove("overdue");
        }

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
    updateOverdueTasks();
    updateTaskDisplay();
}
function createTask(taskText, dueDateValue, dueTimeValue, priorityValue, isCompleted = false) {
    const dueText = formatDueDate(dueDateValue, dueTimeValue);
    const newTask = document.createElement("li");
    newTask.dataset.date = dueDateValue;
    newTask.dataset.time = dueTimeValue;
    newTask.dataset.priority = priorityValue;
    newTask.dataset.created = new Date().toLocaleString();
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

        taskToEdit = newTask;

        editTaskInput.value = newTask.querySelector("h3").textContent;

        editDate.value = newTask.dataset.date;

        editTime.value = newTask.dataset.time;

        editPriority.value = newTask.dataset.priority;

        editModal.classList.add("show");

    });
    deleteBtn.addEventListener("click", function () {

        taskToDelete = newTask;

        deleteModal.classList.add("show");

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
    updateOverdueTasks();

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
cancelDelete.addEventListener("click", function () {

    deleteModal.classList.remove("show");

    taskToDelete = null;

});
confirmDelete.addEventListener("click", function () {

    if (taskToDelete) {

        taskToDelete.remove();

        updateStatistics();

        saveTasks();

        showNotification("🗑 Task deleted.", "info");

        if (taskList.children.length === 0) {
            emptyMessage.style.display = "block";
        }

    }

    deleteModal.classList.remove("show");

    taskToDelete = null;

});
saveEdit.addEventListener("click", function () {

    if (!taskToEdit) return;

    const taskTitle = taskToEdit.querySelector("h3");
    const taskDate = taskToEdit.querySelector("p");
    const priorityBadge = taskToEdit.querySelector(".priority-badge");

    const newTitle = editTaskInput.value.trim();

    if (newTitle === "") {
        showNotification("Task title cannot be empty.", "error");
        return;
    }

    taskTitle.textContent = newTitle;

    taskToEdit.dataset.date = editDate.value;
    taskToEdit.dataset.time = editTime.value;
    taskToEdit.dataset.priority = editPriority.value;

    taskDate.textContent = formatDueDate(editDate.value, editTime.value);

    priorityBadge.textContent = editPriority.value;
    priorityBadge.className =
        `priority-badge ${editPriority.value.toLowerCase()}`;

    saveTasks();
    updateOverdueTasks();

    editModal.classList.remove("show");

    taskToEdit = null;

    showNotification("✏️ Task updated successfully!", "success");

});
cancelEdit.addEventListener("click", function () {

    editModal.classList.remove("show");

    taskToEdit = null;

});
saveTasks();
sortTasks();
loadTasks();
updateStatistics();
updateOverdueTasks();
updateTaskDisplay();
editModal.classList.remove("show");
//showNotification("🎉 TaskFlow notifications are working!", "success");
//showNotification("Error", "error");
//showNotification("Information", "info");