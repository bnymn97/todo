document.getElementById("register-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Bitte alle Felder ausfüllen");
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
      alert("Registrierung erfolgreich! Bitte einloggen.");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    alert("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Bitte alle Felder ausfüllen");
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
      alert("Login erfolgreich!");
      localStorage.setItem("token", data.token);
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("todo-section").style.display = "block";
      fetchTasks(); // Aufgaben nach dem Login abrufen
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Fehler beim Login:", error);
    alert("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
  }
});

// **Neue Aufgabe hinzufügen**
document.getElementById("add-task-btn").addEventListener("click", async () => {
  const taskText = document.getElementById("new-task").value.trim();
  if (!taskText) {
    alert("Aufgabentext darf nicht leer sein");
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
      alert("Aufgabe erfolgreich hinzugefügt");
      document.getElementById("new-task").value = ""; // Eingabefeld leeren
      fetchTasks(); // Neue Aufgabenliste abrufen
    } else {
      alert("Fehler beim Hinzufügen der Aufgabe.");
    }
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Aufgabe:", error);
  }
});

// **Aufgaben abrufen und anzeigen**
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
      // Standardmäßig nur aktive Aufgaben anzeigen
      displayTasks(tasks.filter((task) => !task.completed));
      handleTabSwitch(tasks);
    } else {
      alert("Fehler beim Abrufen der Aufgaben.");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Aufgaben:", error);
  }
}

function displayTasks(tasks) {
  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = ""; // Liste leeren

  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("todo-item");
    taskItem.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">${
      task.task_text
    }</span>
      <div>
        <button class="complete-btn" onclick="completeTask(${
          task.id
        })">Erledigt</button>
        <button class="delete-btn" onclick="deleteTask(${
          task.id
        })">Löschen</button>
      </div>
    `;
    tasksList.appendChild(taskItem);
  });
}

// **Aufgabe als erledigt markieren**
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
      alert("Aufgabe als erledigt markiert");
      fetchTasks(); // Liste neu laden
    } else {
      alert("Fehler beim Markieren der Aufgabe.");
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Aufgabe:", error);
  }
}

// **Aufgabe löschen**
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
      alert("Aufgabe erfolgreich gelöscht");
      fetchTasks(); // Liste neu laden
    } else {
      alert("Fehler beim Löschen der Aufgabe.");
    }
  } catch (error) {
    console.error("Fehler beim Löschen der Aufgabe:", error);
  }
}

// **Tab-Umschaltung für aktive/erledigte Aufgaben**
function handleTabSwitch(tasks) {
  document.getElementById("show-active").addEventListener("click", () => {
    displayTasks(tasks.filter((task) => !task.completed)); // Nur aktive Aufgaben anzeigen
  });

  document.getElementById("show-completed").addEventListener("click", () => {
    displayTasks(tasks.filter((task) => task.completed)); // Nur erledigte Aufgaben anzeigen
  });
}
