const getDayName = (date) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
};

//----------------------------------------------------------------------------------------- Ёбаные карточкис дз
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
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`; 

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
    updateTopBarDate();
};


// АВТОМАТИЧЕСКАЯ ПРОКРУТКА
// АВТОМАТИЧЕСКАЯ ПРОКРУТКА
function AutoScroll() {
    // 1. Крутим ленту ДЗ (как было)
    const hwContainer = document.getElementById('days-container');
    if (hwContainer) {
        const targetCard = hwContainer.querySelector('.tomorrow1');
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }
    
    // 2. Крутим ленту Расписания к сегодняшнему дню
    const scheduleContainer = document.getElementById('schedule-container');
    if (scheduleContainer) {
        const todayCol = scheduleContainer.querySelector('.schedule-today-target');
        if (todayCol) {
            todayCol.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
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
    loadUniversitySchedule();
    
    // --- ВОТ ЭТИ ДВЕ СТРОЧКИ МЫ ЗАБЫЛИ ДОБАВИТЬ ---
    enableDragToScroll('days-container');     // Включаем свайп для домашки
    enableDragToScroll('schedule-container'); // Включаем свайп для расписания
});

const updateTopBarDate = () => {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
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

async function ButtonKur1() {
    const dialog = document.getElementById('dialog1');
    dialog.showModal();
    const choice = await new Promise((resolve) => {
        dialog.onclick = (e) => {
            if (e.target.tagName === 'BUTTON') {
                dialog.close();
                resolve(e.target.value);
            }
            
        };
    });
}
async function ButtonKur2() {
    const dialog = document.getElementById('dialog2');
    dialog.showModal();
    const choice = await new Promise((resolve) => {
        dialog.onclick = (e) => {
            if (e.target.tagName === 'BUTTON') {
                dialog.close();
                resolve(e.target.value);
            }
        };
        
    });
}
const dialog3 = document.getElementById('dialog3');
if (dialog3) {
    dialog3.style.setProperty('display', 'none', 'important');
}

async function ButtonKur3() {
    const dialog = document.getElementById('dialog3');
    const closeBtn = dialog.querySelector('button');

    // 2. При вызове функции включаем flex, чтобы окно появилось
    dialog.style.setProperty('display', 'flex', 'important');
    dialog.showModal();

    return new Promise((resolve) => {
        const closeAction = () => {
            dialog.close();
            // 3. При закрытии снова полностью скрываем
            dialog.style.setProperty('display', 'none', 'important');
            resolve("cancelled");
        };

        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeAction();
        };

    });
}
// 1. Открытие/закрытие главного меню
function toggleMenu() {
    document.getElementById("dropdown-menu").classList.toggle("show");
}

// 2. Открытие/закрытие подменю (лабы, практики и т.д.)
function toggleSubMenu(menuId) {
    let subMenus = document.getElementsByClassName("sub-dropdown-content");
    for (let i = 0; i < subMenus.length; i++) {
        // Закрываем все другие подменю, кроме того, на которое кликнули
        if (subMenus[i].id !== menuId) {
            subMenus[i].classList.remove('show');
        }
    }
    // Открываем/закрываем нужное подменю
    document.getElementById(menuId).classList.toggle("show");
}

// 3. Закрытие ВСЕХ меню при клике мимо
window.addEventListener('click', function(event) {
    // Проверяем: если клик был НЕ внутри блока меню (по пустому экрану)
    if (!event.target.closest('.dropdown-wrapper')) {
        
        // Закрываем главное меню
        let mainMenu = document.getElementById("dropdown-menu");
        if (mainMenu) {
            mainMenu.classList.remove('show');
        }
        
        // Закрываем все открытые подменю
        let subMenus = document.getElementsByClassName("sub-dropdown-content");
        for (let i = 0; i < subMenus.length; i++) {
            subMenus[i].classList.remove('show');
        }
    }
});

//----------------------------------------------------------------------------------------- Вот отвесает за расписание
const parseTime = (timeStr) => {
    let [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

const formatDuration = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    if (h > 0 && m > 0) return `${h}ч ${m}м`;
    if (h > 0) return `${h}ч`;
    return `${m}м`;
};

const formatShortName = (fullName) => {
    let parts = fullName.trim().split(' ');
    if (parts.length >= 3) {
        return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
    }
    return fullName;
};

const formatDateHeader = (dateStr) => {
    let [d, m, y] = dateStr.split('.');
    let dateObj = new Date(y, m - 1, d);
    let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${days[dateObj.getDay()]}, ${parseInt(d)} ${months[dateObj.getMonth()]}`;
};

const getTypeColor = (type) => {
    let t = type.toLowerCase();
    if (t.includes('лекци')) return '#3ba88e'; 
    if (t.includes('лабораторн')) return '#e38b55'; 
    if (t.includes('практическ')) return '#44d362'; 
    return '#4a90e2';
};

async function loadUniversitySchedule() {
    const container = document.getElementById('schedule-container');
    if (!container) return;

    try {
        const response = await fetch('tulsu_schedule.json');
        if (!response.ok) throw new Error();
        const rawSchedule = await response.json();

        const scheduleByDate = {};
        rawSchedule.forEach(lesson => {
            const date = lesson.DATE_Z;
            if (!date) return;
            if (!scheduleByDate[date]) scheduleByDate[date] = [];
            scheduleByDate[date].push(lesson);
        });

        const parseDate = (d) => {
            let [day, month, year] = d.split('.');
            return new Date(year, month - 1, day).getTime();
        };
        const sortedDates = Object.keys(scheduleByDate).sort((a, b) => parseDate(a) - parseDate(b));

        // --- ИЩЕМ СЕГОДНЯШНИЙ (ИЛИ БЛИЖАЙШИЙ БУДУЩИЙ) ДЕНЬ ---
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let targetDateStr = null;
        for (let d of sortedDates) {
            if (parseDate(d) >= today.getTime()) {
                targetDateStr = d;
                break;
            }
        }

        container.innerHTML = '';

        sortedDates.forEach(date => {
            const lessons = scheduleByDate[date];
            
            // Если это сегодняшний день, вешаем класс-якорь
            let isTargetCol = (date === targetDateStr) ? " schedule-today-target" : "";
            let dayHtml = `<div class="schedule-day-column${isTargetCol}"><div class="schedule-day-title">${formatDateHeader(date)}</div>`;
            let lastEndTime = null;

            lessons.forEach((lesson) => {
                const times = (lesson.TIME_Z || "").split(' - ');
                const startTime = times[0] || "";
                const endTime = times[1] || "";
                const title = lesson.DISCIP || "Без названия";
                const aud = lesson.AUD || "";
                const teacherFull = lesson.PREP || "";
                const teacherShort = formatShortName(teacherFull);
                const type = lesson.KOW || "";
                const typeColor = getTypeColor(type);
                
                const duration = (startTime && endTime) ? formatDuration(parseTime(endTime) - parseTime(startTime)) : "";

                if (lastEndTime && startTime) {
                    const breakMins = parseTime(startTime) - parseTime(lastEndTime);
                    if (breakMins > 0) {
                        // ТЕПЕРЬ ПЕРЕРЫВЫ ПИШУТСЯ КРАСИВО: 1ч 35м
                        dayHtml += `<div class="break-row"><div class="break-pill">Перерыв ${formatDuration(breakMins)}</div></div>`;
                    }
                }
                lastEndTime = endTime;

                const audLink = `https://tulsu.ru/schedule/?search=${encodeURIComponent(aud)}`;
                const teacherLink = `https://tulsu.ru/schedule/?search=${encodeURIComponent(teacherFull)}`;

                dayHtml += `
                <div class="timeline-row" onclick="this.classList.toggle('expanded')">
                    <div class="timeline-time">
                        <span>${startTime}</span>
                        
                        <div class="timeline-line"></div>
                        
                        <span class="time-duration">${duration}</span>
                        <span>${endTime}</span>
                    </div>
                    <div class="timeline-content">
                        <div class="lesson-card" style="border-left: 6px solid ${typeColor}">
                            <div class="card-header">
                                <span class="lesson-type-pill" style="background: ${typeColor}; color: #fff;">${type}</span>
                                <svg class="expand-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="lesson-title">${title}</div>
                            <div class="collapsed-tags">
                                ${aud ? `<span class="tag-aud">ауд. ${aud}</span>` : ''}
                                ${teacherShort ? `<span class="tag-prep">${teacherShort}</span>` : ''}
                            </div>
                            <div class="expandable-area">
                                <div class="expand-divider"></div>
                                ${teacherFull ? `
                                <a href="${teacherLink}" target="_blank" class="expand-btn btn-prep" onclick="event.stopPropagation()">
                                    <div>${teacherFull}</div>
                                    <div class="btn-subtext">Посмотреть расписание</div>
                                </a>` : ''}
                                ${aud ? `
                                <a href="${audLink}" target="_blank" class="expand-btn btn-aud" onclick="event.stopPropagation()">
                                    <div class="btn-subtext">Посмотреть расписание аудитории</div>
                                </a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            dayHtml += `</div>`;
            container.innerHTML += dayHtml;
        });

        // После того как карточки сгенерированы, автоматически крутим ленту!
        AutoScroll();

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p style='text-align:center;'>Расписание недоступно.</p>";
    }
}
// --- УНИВЕРСАЛЬНАЯ ПРОКРУТКА ПЕРЕТАСКИВАНИЕМ (УМНАЯ) ---
// --- УНИВЕРСАЛЬНАЯ ПРОКРУТКА ПЕРЕТАСКИВАНИЕМ (ФИНАЛ) ---
    function enableDragToScroll(containerId) {
        const slider = document.getElementById(containerId);
        if (!slider) return;

        let isDown = false;
        let isDragged = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragged = false;
            slider.classList.add('is-dragging');
            
            // ВАЖНО: Отключаем плавную прокрутку на время перетаскивания, иначе лента будет стоять на месте!
            slider.style.scrollBehavior = 'auto'; 
            
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('is-dragging', 'is-actually-dragging');
            slider.style.scrollBehavior = ''; // Возвращаем плавность
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('is-dragging', 'is-actually-dragging');
            slider.style.scrollBehavior = ''; // Возвращаем плавность
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5; // Скорость свайпа
            
            if (Math.abs(walk) > 4) {
                isDragged = true;
                slider.classList.add('is-actually-dragging');
            }
            
            // Крутим ленту
            if (isDragged) {
                e.preventDefault(); // Глушим браузерные события только если реально тянем
                slider.scrollLeft = scrollLeft - walk;
            }
        });

        slider.addEventListener('click', (e) => {
            if (isDragged) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }