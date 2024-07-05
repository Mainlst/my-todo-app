document.addEventListener('DOMContentLoaded', () => {
    const daysElement = document.getElementById('days');
    const monthYearElement = document.getElementById('month-year');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const addTaskButton = document.getElementById('add-task'); // タスク追加ボタン
    const taskInput = document.getElementById('task-input'); // タスク入力欄
    const deadlineInput = document.getElementById('deadline-input'); // 締め切り入力欄
  
    let date = new Date();
  
    function renderCalendar() {
      date.setDate(1);
  
      const monthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
      const firstDayIndex = date.getDay();
      const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
      const nextDays = 7 - lastDayIndex - 1;
  
      const months = [
          "1月", "2月", "3月", "4月", "5月", "6月",
          "7月", "8月", "9月", "10月", "11月", "12月"
      ];
  
      monthYearElement.innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;
  
      let days = "";
  
      // タスク情報を取得
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
      for (let x = firstDayIndex; x > 0; x--) {
          days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
      }
  
      for (let i = 1; i <= monthDays; i++) {
          const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
          const isTaskDate = tasks.some(task => task.deadline === currentDate);
  
          if (
              i === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear()
          ) {
              days += `<div class="today">${i}</div>`;
          } else if (isTaskDate) {
              days += `<div class="highlight">${i}</div>`;
          } else {
              days += `<div>${i}</div>`;
          }
      }
  
      for (let j = 1; j <= nextDays; j++) {
          days += `<div class="next-date">${j}</div>`;
      }
  
      daysElement.innerHTML = days;
    }
  
    function addTask() {
      const task = taskInput.value;
      const deadline = deadlineInput.value;
  
      if (task && deadline) {
          const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
          tasks.push({ task, deadline });
          localStorage.setItem('tasks', JSON.stringify(tasks));
  
          // タスク追加後にカレンダーを再描画
          renderCalendar();
  
          // 入力欄をクリア
          taskInput.value = '';
          deadlineInput.value = '';
      }
    }
  
    // カレンダーを初期表示
    renderCalendar();
  
    prevButton.addEventListener('click', () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });
  
    nextButton.addEventListener('click', () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });
  
    addTaskButton.addEventListener('click', addTask); // タスク追加ボタンのイベントリスナー
  });
  