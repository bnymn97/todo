document.getElementById("register-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please fill out all fields");
    return;
  }

  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful! Please log in.");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred. Please try again later.");
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please fill out all fields");
    return;
  }

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Login successful!");
      localStorage.setItem("token", data.token);
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("todo-section").style.display = "block";
      fetchTasks();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again later.");
  }
});

document.getElementById("add-task-btn").addEventListener("click", async () => {
  const taskText = document.getElementById("new-task").value.trim();
  if (!taskText) {
    alert("Task text cannot be empty");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/tasks/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_text: taskText }),
    });

    if (response.ok) {
      alert("Task added successfully");
      document.getElementById("new-task").value = "";
      fetchTasks();
    } else {
      alert("Error adding task.");
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  document.getElementById("auth-section").style.display = "flex";
  document.getElementById("todo-section").style.display = "none";
  alert("Logged out successfully");
});

async function fetchTasks() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const tasks = await response.json();
    if (response.ok) {
      displayTasks(tasks.filter((task) => !task.completed));
      handleTabSwitch(tasks);
    } else {
      alert("Error fetching tasks.");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

function displayTasks(tasks) {
  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("todo-item");

    let buttonsHtml = "";
    if (!task.completed) {
      buttonsHtml = `
        <button class="complete-btn" onclick="completeTask(${task.id})">Complete</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      `;
    } else {
      buttonsHtml = `
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      `;
    }

    taskItem.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">${
      task.task_text
    }</span>
      <div>
        ${buttonsHtml}
      </div>
    `;
    tasksList.appendChild(taskItem);
  });
}

async function completeTask(taskId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/tasks/${taskId}/complete`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Task marked as completed");
      fetchTasks();
    } else {
      alert("Error marking task as completed.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

async function deleteTask(taskId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Task deleted successfully");
      fetchTasks();
    } else {
      alert("Error deleting task.");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

function handleTabSwitch(tasks) {
  document.getElementById("show-active").addEventListener("click", () => {
    displayTasks(tasks.filter((task) => !task.completed));
  });

  document.getElementById("show-completed").addEventListener("click", () => {
    displayTasks(tasks.filter((task) => task.completed));
  });
}
