document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const trashList = document.getElementById('trashList');
    const completedTasksWrapper = document.getElementById('completedTasksWrapper');
    const trashWrapper = document.getElementById('trashWrapper');
    const toggleCompletedTasksButton = document.getElementById('toggleCompletedTasks');
    const toggleTrashButton = document.getElementById('toggleTrash');
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.value = today;

    function addTask(taskText, deadline, completed = false, trashed = false) {
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
            renderCalendar(); // カレンダーの再描画
        });

        const deadlineSpan = document.createElement('input');
        deadlineSpan.type = 'date';
        deadlineSpan.value = deadline;
        deadlineSpan.addEventListener('change', () => {
            saveTasks();
            sortTasks();
            renderCalendar(); // カレンダーの再描画
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            if (trashed) {
                li.remove();
                saveTasks();
                renderCalendar(); // カレンダーの再描画
            } else {
                li.remove();
                trashTask(taskText, deadline, completed);
                saveTasks();
                renderCalendar(); // カレンダーの再描画
            }
        });

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
            renderCalendar(); // カレンダーの再描画
        });

        if (trashed) {
            trashList.appendChild(li);
            const restoreButton = document.createElement('button');
            restoreButton.textContent = '復元';
            restoreButton.addEventListener('click', () => {
                li.remove();
                addTask(taskText, deadline, completed);
                saveTasks();
                renderCalendar(); // カレンダーの再描画
            });
            li.appendChild(restoreButton);
        } else if (completed) {
            completedTaskList.appendChild(li);
        } else {
            taskList.appendChild(li);
        }

        sortTasks();
        renderCalendar(); // カレンダーの再描画
    }

    function trashTask(taskText, deadline, completed) {
        addTask(taskText, deadline, completed, true);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('input[type="text"]').value,
                deadline: li.querySelector('input[type="date"]').value,
                completed: false,
                trashed: false
            });
        });
        completedTaskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('input[type="text"]').value,
                deadline: li.querySelector('input[type="date"]').value,
                completed: true,
                trashed: false
            });
        });
        trashList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('input[type="text"]').value,
                deadline: li.querySelector('input[type="date"]').value,
                completed: li.querySelector('input[type="checkbox"]').checked,
                trashed: true
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.deadline, task.completed, task.trashed);
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
            renderCalendar(); // カレンダーの再描画
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

    toggleCompletedTasksButton.addEventListener('click', () => {
        completedTasksWrapper.classList.toggle('collapsed');
        toggleCompletedTasksButton.textContent = completedTasksWrapper.classList.contains('collapsed') ? '表示' : '非表示';
    });

    toggleTrashButton.addEventListener('click', () => {
        trashWrapper.classList.toggle('collapsed');
        toggleTrashButton.textContent = trashWrapper.classList.contains('collapsed') ? '表示' : '非表示';
    });

    loadTasks();
});
