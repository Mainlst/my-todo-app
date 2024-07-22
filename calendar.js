document.addEventListener('DOMContentLoaded', () => {
    const daysElement = document.getElementById('days');
    const monthYearElement = document.getElementById('month-year');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const addTaskButton = document.getElementById('addTaskButton'); // タスク追加ボタン
    const taskInput = document.getElementById('taskInput'); // タスク入力欄
    const deadlineInput = document.getElementById('deadlineInput'); // 締め切り入力欄
  
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
          const task = tasks.find(task => task.deadline === currentDate && !task.completed);
  
          if (
              i === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear()
          ) {
              if (task) {
                  days += `<div class="highlight today" style="background-color: ${task.color}">${i}</div>`;
              } else {
                  days += `<div class="today">${i}</div>`;
              }
          } else if (task) {
              days += `<div class="highlight" style="background-color: ${task.color}">${i}</div>`;
          } else {
              days += `<div>${i}</div>`;
          }
      }
  
      for (let j = 1; j <= nextDays; j++) {
          days += `<div class="next-date">${j}</div>`;
      }
  
      daysElement.innerHTML = days;
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
  
    addTaskButton.addEventListener('click', () => {
        addTask();
        renderCalendar(); // タスク追加時にカレンダーを再描画
    }); // タスク追加ボタンのイベントリスナー

    // グローバルにカレンダーの再描画関数を提供
    window.renderCalendar = renderCalendar;
});
