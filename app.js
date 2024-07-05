document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.value = today;

    function addTask(taskText, deadline, completed = false) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;

        const taskSpan = document.createElement('input');
        taskSpan.type = 'text';
        taskSpan.value = taskText;
        taskSpan.addEventListener('change', () => {
            saveTasks();
            sortTasks();
        });

        const deadlineSpan = document.createElement('input');
        deadlineSpan.type = 'date';
        deadlineSpan.value = deadline;
        deadlineSpan.addEventListener('change', () => {
            saveTasks();
            sortTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';

        if (completed) {
            li.classList.add('completed');
        }

        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(deadlineSpan);
        li.appendChild(deleteButton);
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            if (checkbox.checked) {
                completedTaskList.appendChild(li);
            } else {
                taskList.appendChild(li);
            }
            saveTasks();
            sortTasks();
        });

        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        if (completed) {
            completedTaskList.appendChild(li);
        } else {
            taskList.appendChild(li);
        }

        sortTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('input[type="text"]').value,
                deadline: li.querySelector('input[type="date"]').value,
                completed: false
            });
        });
        completedTaskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('input[type="text"]').value,
                deadline: li.querySelector('input[type="date"]').value,
                completed: true
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.deadline, task.completed);
        });
    }

    function sortTasks() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const deadlineA = new Date(a.querySelector('input[type="date"]').value);
            const deadlineB = new Date(b.querySelector('input[type="date"]').value);
            return deadlineA - deadlineB;
        });
        tasks.forEach(task => taskList.appendChild(task));
    }

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const deadline = deadlineInput.value;
        if (taskText !== '' && deadline !== '') {
            addTask(taskText, deadline);
            taskInput.value = '';
            deadlineInput.value = today;
            saveTasks();
            sortTasks();
        }
    });

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    deadlineInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    loadTasks();
});
