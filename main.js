const getDayName = (date) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
};

// Ёбаные карточкис дз
const renderSchedule = async () => {
    try {
        // 1. Загружаем данные из внешнего файла
        const response = await fetch('DZ.json');
        const homeworkData = await response.json();

        // 2. Находим контейнер и очищаем его
        const container = document.getElementById('days-container');
        if (!container) return;
        container.innerHTML = ""; 
        
        const today = new Date();

        // 3. Генерируем карточки на 3 недели (-7 до +14 дней)
        for (let i = -7; i <= 14; i++) {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() + i);
            const dateKey = currentDate.toISOString().split('T')[0];
            const tasks = homeworkData[dateKey] || [];

            const card = document.createElement('div');
            card.className = 'day-column';

            // Оформление цветов в зависимости от удаленности дня
            if (i < 0) card.classList.add('past-day');
            else if (i === 1) {
                card.classList.add('tomorrow1');
                if (tasks.length > 0) card.classList.add('tomorrow');
            } 
            else if (i === 2 && tasks.length > 0) card.classList.add('two-days-away');
            else if (i === 3 && tasks.length > 0) card.classList.add('three-days-away');
            else if (i > 3 && tasks.length > 0) card.classList.add('next-day-away');

            // Поиск ссылок в задачах
            const taskWithLink = tasks.find(t => typeof t === 'object' && t.link);

            card.innerHTML = `
                <div class="day-header">
                    <h3>${getDayName(currentDate)}</h3>
                    <p>${currentDate.toLocaleDateString('ru-RU')}</p>
                </div>
                <div class="hw-list">
                    ${tasks.length > 0 
                        ? `<ul>${tasks.map(t => `<li>${typeof t === 'object' ? t.text : t}</li>`).join('')}</ul>` 
                        : '<p class="no-hw">Заданий нет</p>'}
                </div>
                ${taskWithLink 
                    ? `<div class="card-footer">
                            <a href="${taskWithLink.link}" target="_blank" class="materials-btn">Материалы</a>
                       </div>` 
                    : ''
                }
            `;
            container.appendChild(card);
        }
        
        // После отрисовки крутим к завтрашнему дню
        AutoScroll();
        
    } catch (error) {
        console.error("Ошибка загрузки DZ.json. Убедитесь, что используете Live Server!", error);
    }
};


// АВТОМАТИЧЕСКАЯ ПРОКРУТКА
function AutoScroll() {
    const container = document.getElementById('days-container');
    const targetCard = container.querySelector('.tomorrow1');
    if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
    window.scrollTo(0,0);
}

// Прокрутка ленты колесиком мыши (горизонтально)
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('user-theme');
    const themeLink = document.getElementById("style_l");
        if (savedTheme) {
        themeLink.href = savedTheme;
    } else {
        themeLink.href = 'style/light.css'; 
    }

    renderSchedule(); 

    const scrollContainer = document.getElementById('days-container');
    if (scrollContainer) {
        scrollContainer.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            // Перенаправляем вертикальную прокрутку в горизонтальную
            scrollContainer.scrollLeft += evt.deltaY;
        });
    }
    
});

const updateTopBarDate = () => {
    const dateElement = document.getElementById('current-date');
    
    if (dateElement) {
        const today = new Date();
        
        // Настраиваем формат вывода: четверг, 29 января 2026 г.
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        // Превращаем дату в красивую строку и вставляем в HTML
        dateElement.innerText = today.toLocaleDateString('ru-RU', options);
    }
};



function Stylejs(){
    let a = document.getElementById("style_l");
    let new_a = '';
    if(a.getAttribute('href') ==  'style/light.css') new_a = 'style/black.css';
    else new_a = 'style/light.css';
    a.href = new_a;
    localStorage.setItem('user-theme',new_a);
}

updateTopBarDate();