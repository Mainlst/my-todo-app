document.addEventListener('DOMContentLoaded', () => {
  const daysElement = document.getElementById('days');
  const monthYearElement = document.getElementById('month-year');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');

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

      for (let x = firstDayIndex; x > 0; x--) {
          days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
      }

      for (let i = 1; i <= monthDays; i++) {
          if (
              i === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear()
          ) {
              days += `<div class="today">${i}</div>`;
          } else {
              days += `<div>${i}</div>`;
          }
      }

      for (let j = 1; j <= nextDays; j++) {
          days += `<div class="next-date">${j}</div>`;
      }

      daysElement.innerHTML = days;
  }

  prevButton.addEventListener('click', () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
  });

  nextButton.addEventListener('click', () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
  });

  renderCalendar();
});
