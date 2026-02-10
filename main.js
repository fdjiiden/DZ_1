const homeworkData = {
    // "2026--": ["", { text: "", link: "" } ],
    // "2026-01-31": [ { text: "Химия: Таблица", link: "https://google.com" } ],
    // "2026--": [""],
    
}


const getDayName = (date) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
};

// Ёбаные карточкис дз
const renderSchedule = () => {
    const container = document.getElementById('days-container');
    const today = new Date();

    for (let i = -7; i <= 14; i++) {
        const currentDate = new Date();
        currentDate.setDate(today.getDate() + i);
        const dateKey = currentDate.toISOString().split('T')[0];
        const tasks = homeworkData[dateKey] || [];

        const card = document.createElement('div');
        card.className = 'day-column';

        // Оформление цветов
        if (i < 1) card.classList.add('past-day');
        else if (i === 1) {
            card.classList.add('tomorrow1');
            if (tasks.length > 0) card.classList.add('tomorrow');
        } 
        else if (i === 2 && tasks.length > 0) card.classList.add('two-days-away');
        else if (i === 3 && tasks.length > 0) card.classList.add('three-days-away');
        else if (i > 3 && tasks.length > 0) card.classList.add('next-day-away');

        // Ищем, есть ли в списке задач хотя бы одна ссылка
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
            ${/* Кнопка рисуется ТОЛЬКО если нашли объект с линком */
                taskWithLink 
                ? `<div class="card-footer">
                        <a href="${taskWithLink.link}" target="_blank" class="materials-btn">Материалы</a>
                   </div>` 
                : ''
            }
        `;

        container.appendChild(card);
    }
    AutoScroll();
};


// АВТОМАТИЧЕСКАЯ ПРОКРУТКА
function AutoScroll() {
    const container = document.getElementById('days-container');
    const targetCard = container.querySelector('.tomorrow1');
    if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}

// Прокрутка ленты колесиком мыши (горизонтально)
document.addEventListener('DOMContentLoaded', () => {
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
    if(a.getAttribute('href') ==  'style/light.css') a.href = 'style/black.css';
    else a.href = 'style/light.css';
}

updateTopBarDate();

