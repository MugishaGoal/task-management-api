document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('link-logout').style.display = 'block';
        document.getElementById('link-login').style.display = 'none';
        document.getElementById('link-signup').style.display = 'none';
        showPage('task-create'); // Default page after login
    } else {
        showPage('login-form');
    }

    document.getElementById('link-login').addEventListener('click', () => showPage('login-form'));
    document.getElementById('link-signup').addEventListener('click', () => showPage('signup-form'));
    document.getElementById('link-create-task').addEventListener('click', () => {
        checkAuthentication();
        showPage('task-create');
    });
    document.getElementById('link-tasks').addEventListener('click', () => {
        checkAuthentication();
        showPage('tasks');
        fetchAllTasks();
    });
    document.getElementById('link-logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload();
    });
});

function showPage(pageId) {
    const forms = document.querySelectorAll('.form');
    const pages = document.querySelectorAll('.page');
    forms.forEach(form => form.style.display = 'none');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        document.getElementById('link-logout').style.display = 'block';
        document.getElementById('link-login').style.display = 'none';
        document.getElementById('link-signup').style.display = 'none';
        showPage('task-create');
    } else {
        alert(data.message);
    }
}

async function signup() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        document.getElementById('link-logout').style.display = 'block';
        document.getElementById('link-login').style.display = 'none';
        document.getElementById('link-signup').style.display = 'none';
        showPage('task-create');
    } else {
        alert(data.message);
    }
}

function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to access this page');
        showPage('login-form');
        throw new Error('Not authenticated');
    }
}

async function createTask() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a task');
      showPage('login-form');
      return;
    }
  
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-dueDate').value;
    const priority = document.getElementById('task-priority').value;
  
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, dueDate, priority })
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }
  
      alert('Task created successfully');
    } catch (error) {
      console.error('Create task error:', error);
      alert(error.message || 'Failed to create task');
    }
}
  

async function fetchAllTasks() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view tasks');
        showPage('login-form');
        return;
    }

    const response = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    displayTasks(tasks);
}

async function fetchTasksByPriority(priority) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view tasks');
        showPage('login-form');
        return;
    }

    const response = await fetch(`/api/tasks/priority/${priority}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    displayTasks(tasks);
}

async function fetchTasksByStatus(status) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view tasks');
        showPage('login-form');
        return;
    }

    const response = await fetch(`/api/tasks/status/${status}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    displayTasks(tasks);
}

async function fetchTasksByDueDate(dueDate) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view tasks');
        showPage('login-form');
        return;
    }

    const response = await fetch(`/api/tasks/dueDate/${dueDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    displayTasks(tasks);
}

async function fetchCompletedTasks() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view tasks');
        showPage('login-form');
        return;
    }

    const response = await fetch('/api/tasks/analytics/completed', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const { completedTasks } = await response.json();
    alert(`Completed Tasks: ${completedTasks}`);
}

async function fetchOverdueTasks() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view tasks');
        showPage('login-form');
        return;
    }

    const response = await fetch('/api/tasks/analytics/overdue', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = tasks.map(task => `
        <div class="task">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Priority: ${task.priority}</p>
            <p>Status: ${task.status}</p>
        </div>
    `).join('');
}