/**
 * ComPAC.js - Common Patterns And Components
 * Плагин для SVXsion.js
 * Версия 1.0.0
 * Лицензия: MIT
 */

S.use('ComPAC', (S) => {
    // Приватные вспомогательные функции
    const _getElements = S.getAll;
    const _getElement = S.get;

    // Основной объект плагина
    const pac = {};

    /**
     * ======================
     * УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     * ======================
     */

    // Генерация случайного цвета
    pac.randomColor = (opacity = 1) => {
        const r = S.random(0, 255);
        const g = S.random(0, 255);
        const b = S.random(0, 255);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Форматирование чисел
    pac.formatNumber = (num, decimals = 2) => {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    // Проверка на пустой объект
    pac.isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };

    // Глубокое копирование объекта
    pac.deepCopy = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    };

    // Слияние объектов
    pac.mergeObjects = (...objects) => {
        return Object.assign({}, ...objects);
    };

    // Фильтрация массива объектов
    pac.filterArray = (array, key, value) => {
        return array.filter(item => item[key] === value);
    };

    // Сортировка массива объектов
    pac.sortArray = (array, key, ascending = true) => {
        return array.sort((a, b) => {
            if (a[key] < b[key]) return ascending ? -1 : 1;
            if (a[key] > b[key]) return ascending ? 1 : -1;
            return 0;
        });
    };

    // Получение уникальных значений массива
    pac.unique = (array) => {
        return [...new Set(array)];
    };

    // Случайный элемент массива
    pac.randomItem = (array) => {
        return array[S.random(0, array.length - 1)];
    };

    // Преобразование объекта в строку запроса
    pac.toQueryString = (obj) => {
        return Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    };

    // Генератор уникального ID
    pac.uniqueId = (prefix = 'id') => {
        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    };

    /**
     * ======================
     * РАБОТА С ДАТАМИ И ВРЕМЕНЕМ
     * ======================
     */

    // Добавление дней к дате
    pac.addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Разница между двумя датами в днях
    pac.daysBetween = (date1, date2) => {
        const diff = Math.abs(date1 - date2);
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    // Форматирование продолжительности
    pac.formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Проверка на выходной день
    pac.isWeekend = (date = new Date()) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    // Возраст по дате рождения
    pac.calculateAge = (birthDate) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    /**
     * ======================
     * РАБОТА С ФОРМАМИ И ВАЛИДАЦИЯ
     * ======================
     */

    // Очистка формы
    pac.clearForm = (formSelector) => {
        const form = _getElement(formSelector);
        if (!form) return;
        
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            
            switch (element.type) {
                case 'text':
                case 'password':
                case 'textarea':
                case 'hidden':
                    element.value = '';
                    break;
                case 'checkbox':
                case 'radio':
                    element.checked = false;
                    break;
                case 'select-one':
                case 'select-multiple':
                    element.selectedIndex = -1;
                    break;
            }
        }
    };

    // Отображение ошибок формы
    pac.showFormErrors = (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
            const errorElement = _getElement(`.error-${field}`) || 
                                _getElement(`#error-${field}`);
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        });
    };

    // Скрытие всех ошибок формы
    pac.hideFormErrors = (formSelector) => {
        const form = _getElement(formSelector);
        if (!form) return;
        
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    };

    // Валидация email
    pac.validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Валидация пароля
    pac.validatePassword = (password) => {
        // Минимум 8 символов, хотя бы одна цифра и одна буква
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    // Валидация номера телефона
    pac.validatePhone = (phone) => {
        // Поддерживает форматы: 123-456-7890, (123) 456-7890, 123 456 7890, 1234567890
        const regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return regex.test(phone);
    };

    /**
     * ======================
     * UI КОМПОНЕНТЫ
     * ======================
     */

    // Аккордеон
    pac.accordion = (containerSelector, options = {}) => {
        const container = _getElement(containerSelector);
        if (!container) return;
        
        const items = container.querySelectorAll('.accordion-item');
        const multiple = options.multiple || false;
        const activeClass = options.activeClass || 'active';
        
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (!header) return;
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains(activeClass);
                
                if (!multiple) {
                    items.forEach(i => i.classList.remove(activeClass));
                }
                
                if (isActive) {
                    item.classList.remove(activeClass);
                } else {
                    item.classList.add(activeClass);
                }
            });
        });
    };

    // Табы
    pac.tabs = (containerSelector, options = {}) => {
        const container = _getElement(containerSelector);
        if (!container) return;
        
        const tabs = container.querySelectorAll('.tab');
        const contents = container.querySelectorAll('.tab-content');
        const activeClass = options.activeClass || 'active';
        const event = options.event || 'click';
        
        tabs.forEach(tab => {
            tab.addEventListener(event, () => {
                const target = tab.dataset.target;
                
                // Деактивация всех табов и контента
                tabs.forEach(t => t.classList.remove(activeClass));
                contents.forEach(c => c.classList.remove(activeClass));
                
                // Активация текущего таба и контента
                tab.classList.add(activeClass);
                if (target) {
                    const content = _getElement(target);
                    if (content) content.classList.add(activeClass);
                }
            });
        });
        
        // Активация первого таба по умолчанию
        if (tabs.length > 0 && options.activateFirst !== false) {
            tabs[0].dispatchEvent(new Event(event));
        }
    };

    // Выпадающее меню
    pac.dropdown = (selector, options = {}) => {
        const dropdowns = _getElements(selector);
        const activeClass = options.activeClass || 'open';
        const closeOnClickOutside = options.closeOnClickOutside !== false;
        const toggleOnClick = options.toggleOnClick !== false;
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;
            
            if (toggleOnClick) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle(activeClass);
                });
            }
            
            // Закрытие при клике вне меню
            if (closeOnClickOutside) {
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove(activeClass);
                    }
                });
            }
        });
    };

    // Переключатель (Toggle Switch)
    pac.toggleSwitch = (selector, callback) => {
        const switches = _getElements(selector);
        
        switches.forEach(sw => {
            sw.addEventListener('change', (e) => {
                if (callback) callback(e.target.checked);
            });
        });
    };

    // Рейтинг (звезды)
    pac.starRating = (containerSelector, options = {}) => {
        const container = _getElement(containerSelector);
        if (!container) return;
        
        const stars = container.querySelectorAll('.star');
        const maxRating = stars.length;
        let currentRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                currentRating = rating;
                
                // Обновление визуального отображения
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
                
                if (options.onChange) {
                    options.onChange(rating);
                }
            });
            
            // Эффект при наведении
            if (options.hoverEffect) {
                star.addEventListener('mouseenter', () => {
                    stars.forEach((s, i) => {
                        if (i <= index) {
                            s.classList.add('hover');
                        } else {
                            s.classList.remove('hover');
                        }
                    });
                });
                
                star.addEventListener('mouseleave', () => {
                    stars.forEach(s => s.classList.remove('hover'));
                });
            }
        });
    };

    /**
     * ======================
     * ШАБЛОНЫ СТРАНИЦ
     * ======================
     */

    // Шаблон страницы входа
    pac.loginPageTemplate = () => {
        return `
            <div class="login-container">
                <div class="login-card">
                    <h2>Вход в систему</h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                            <div class="error-message" id="email-error"></div>
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль</label>
                            <input type="password" id="password" name="password" required>
                            <div class="error-message" id="password-error"></div>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn-primary">Войти</button>
                        </div>
                    </form>
                    <div class="login-footer">
                        <a href="#forgot-password">Забыли пароль?</a>
                        <a href="#register">Регистрация</a>
                    </div>
                </div>
            </div>
        `;
    };

    // Шаблон карточки товара
    pac.productCardTemplate = (product) => {
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">
                        ${product.oldPrice ? `<span class="old-price">${S.formatNumber(product.oldPrice)} ₽</span>` : ''}
                        <span class="current-price">${S.formatNumber(product.price)} ₽</span>
                    </div>
                    <div class="product-rating">
                        ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <button class="btn-add-to-cart" data-id="${product.id}">В корзину</button>
                </div>
            </div>
        `;
    };

    // Шаблон галереи изображений
    pac.imageGalleryTemplate = (images, options = {}) => {
        const columns = options.columns || 3;
        const gap = options.gap || '10px';
        
        return `
            <div class="image-gallery" style="
                display: grid;
                grid-template-columns: repeat(${columns}, 1fr);
                gap: ${gap};
            ">
                ${images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.url}" alt="${img.alt || ''}" loading="lazy">
                        ${img.caption ? `<div class="caption">${img.caption}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    };

    // Шаблон пагинации
    pac.paginationTemplate = (currentPage, totalPages, options = {}) => {
        const maxVisible = options.maxVisible || 5;
        const prevText = options.prevText || '&laquo;';
        const nextText = options.nextText || '&raquo;';
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;
        
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return `
            <nav class="pagination">
                <ul>
                    ${currentPage > 1 ? `
                        <li>
                            <a href="#" data-page="${currentPage - 1}" class="prev">${prevText}</a>
                        </li>
                    ` : ''}
                    
                    ${startPage > 1 ? `
                        <li>
                            <a href="#" data-page="1">1</a>
                        </li>
                        ${startPage > 2 ? '<li><span>...</span></li>' : ''}
                    ` : ''}
                    
                    ${pages.map(page => `
                        <li>
                            <a href="#" data-page="${page}" ${page === currentPage ? 'class="active"' : ''}>
                                ${page}
                            </a>
                        </li>
                    `).join('')}
                    
                    ${endPage < totalPages ? `
                        ${endPage < totalPages - 1 ? '<li><span>...</span></li>' : ''}
                        <li>
                            <a href="#" data-page="${totalPages}">${totalPages}</a>
                        </li>
                    ` : ''}
                    
                    ${currentPage < totalPages ? `
                        <li>
                            <a href="#" data-page="${currentPage + 1}" class="next">${nextText}</a>
                        </li>
                    ` : ''}
                </ul>
            </nav>
        `;
    };

    /**
     * ======================
     * АНИМАЦИИ И ЭФФЕКТЫ
     * ======================
     */

    // Параллакс-эффект
    pac.parallax = (selector, options = {}) => {
        const elements = _getElements(selector);
        const speed = options.speed || 0.5;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            elements.forEach(element => {
                const position = -(scrollY * speed);
                element.style.transform = `translateY(${position}px)`;
            });
        });
    };

    // Эффект при наведении (hover)
    pac.hoverEffect = (selector, options = {}) => {
        const elements = _getElements(selector);
        const scale = options.scale || 1.05;
        const duration = options.duration || '0.3s';
        
        elements.forEach(element => {
            element.style.transition = `transform ${duration} ease`;
            
            element.addEventListener('mouseenter', () => {
                element.style.transform = `scale(${scale})`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
            });
        });
    };

    // Эффект печатной машинки
    pac.typewriter = (selector, text, options = {}) => {
        const element = _getElement(selector);
        if (!element) return;
        
        const speed = options.speed || 50;
        const deleteSpeed = options.deleteSpeed || 30;
        const pause = options.pause || 1000;
        const loop = options.loop || false;
        const cursor = options.cursor !== false;
        
        let i = 0;
        let isDeleting = false;
        let currentText = '';
        
        if (cursor) {
            element.classList.add('typewriter-cursor');
        }
        
        const type = () => {
            const fullText = text;
            
            if (isDeleting) {
                // Удаление текста
                currentText = fullText.substring(0, currentText.length - 1);
                element.textContent = currentText;
                
                if (currentText === '') {
                    isDeleting = false;
                    i = 0;
                    if (!loop) return;
                }
            } else {
                // Набор текста
                currentText = fullText.substring(0, i + 1);
                element.textContent = currentText;
                i++;
                
                if (i > fullText.length) {
                    if (pause > 0) {
                        isDeleting = true;
                        setTimeout(type, pause);
                        return;
                    } else {
                        isDeleting = true;
                    }
                }
            }
            
            setTimeout(type, isDeleting ? deleteSpeed : speed);
        };
        
        type();
    };

    /**
     * ======================
     * РАБОТА С API И ДАННЫМИ
     * ======================
     */

    // Загрузка и отображение данных JSON
    pac.loadJSON = async (url, containerSelector, templateFunction) => {
        try {
            const data = await S.fetchData(url);
            const container = _getElement(containerSelector);
            
            if (container && templateFunction) {
                container.innerHTML = data.map(item => templateFunction(item)).join('');
            }
            
            return data;
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            S.toast('Ошибка загрузки данных', 'error');
        }
    };

    // Фильтрация данных
    pac.filterData = (data, filters) => {
        return data.filter(item => {
            for (const key in filters) {
                if (filters[key] !== undefined && item[key] !== filters[key]) {
                    return false;
                }
            }
            return true;
        });
    };

    // Поиск по данным
    pac.searchData = (data, query, fields) => {
        if (!query) return data;
        
        const lowerQuery = query.toLowerCase();
        
        return data.filter(item => {
            for (const field of fields) {
                const value = String(item[field]).toLowerCase();
                if (value.includes(lowerQuery)) {
                    return true;
                }
            }
            return false;
        });
    };

    // Пагинация данных
    pac.paginateData = (data, currentPage, perPage) => {
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        return data.slice(start, end);
    };

    /**
     * ======================
     * РАБОТА С МЕДИА
     * ======================
     */

    // Предпросмотр изображения перед загрузкой
    pac.imagePreview = (inputSelector, previewSelector) => {
        const input = _getElement(inputSelector);
        const preview = _getElement(previewSelector);
        
        if (!input || !preview) return;
        
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        });
    };

    // Проигрыватель аудио
    pac.audioPlayer = (containerSelector, tracks) => {
        const container = _getElement(containerSelector);
        if (!container) return;
        
        // Создаем элементы плеера
        const player = document.createElement('div');
        player.className = 'audio-player';
        
        const audio = document.createElement('audio');
        audio.controls = false;
        
        const trackList = document.createElement('ul');
        trackList.className = 'track-list';
        
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.dataset.src = track.src;
            if (index === 0) li.classList.add('active');
            trackList.appendChild(li);
        });
        
        const controls = document.createElement('div');
        controls.className = 'player-controls';
        
        const playBtn = document.createElement('button');
        playBtn.className = 'play-btn';
        playBtn.innerHTML = '&#9658;';
        
        const pauseBtn = document.createElement('button');
        pauseBtn.className = 'pause-btn';
        pauseBtn.innerHTML = '&#10074;&#10074;';
        pauseBtn.style.display = 'none';
        
        const progress = document.createElement('div');
        progress.className = 'progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progress.appendChild(progressBar);
        
        const time = document.createElement('div');
        time.className = 'time';
        time.textContent = '0:00 / 0:00';
        
        controls.appendChild(playBtn);
        controls.appendChild(pauseBtn);
        controls.appendChild(progress);
        controls.appendChild(time);
        
        player.appendChild(audio);
        player.appendChild(trackList);
        player.appendChild(controls);
        container.appendChild(player);
        
        // Обработчики событий
        playBtn.addEventListener('click', () => {
            audio.play();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        });
        
        pauseBtn.addEventListener('click', () => {
            audio.pause();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
        });
        
        // Выбор трека
        trackList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                trackList.querySelectorAll('li').forEach(item => {
                    item.classList.remove('active');
                });
                li.classList.add('active');
                
                audio.src = li.dataset.src;
                audio.play();
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'inline-block';
            });
        });
        
        // Обновление прогресса
        audio.addEventListener('timeupdate', () => {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            
            if (duration) {
                const percent = (currentTime / duration) * 100;
                progressBar.style.width = `${percent}%`;
                
                // Форматирование времени
                const formatTime = (seconds) => {
                    const min = Math.floor(seconds / 60);
                    const sec = Math.floor(seconds % 60);
                    return `${min}:${sec.toString().padStart(2, '0')}`;
                };
                
                time.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            }
        });
        
        // Перемотка по клику на прогресс-бар
        progress.addEventListener('click', (e) => {
            const rect = progress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        });
        
        // Автоматическое воспроизведение следующего трека
        audio.addEventListener('ended', () => {
            const current = trackList.querySelector('li.active');
            const next = current.nextElementSibling || trackList.firstElementChild;
            
            if (next) {
                current.classList.remove('active');
                next.classList.add('active');
                audio.src = next.dataset.src;
                audio.play();
            }
        });
        
        // Загрузка первого трека
        const firstTrack = trackList.querySelector('li.active');
        if (firstTrack) {
            audio.src = firstTrack.dataset.src;
        }
    };

    /**
     * ======================
     * ИНИЦИАЛИЗАЦИЯ ПЛАГИНА
     * ======================
     */
    
    // Регистрация всех функций плагина
    return {
        // Утилиты
        randomColor: pac.randomColor,
        formatNumber: pac.formatNumber,
        isEmpty: pac.isEmpty,
        deepCopy: pac.deepCopy,
        mergeObjects: pac.mergeObjects,
        filterArray: pac.filterArray,
        sortArray: pac.sortArray,
        unique: pac.unique,
        randomItem: pac.randomItem,
        toQueryString: pac.toQueryString,
        uniqueId: pac.uniqueId,
        
        // Работа с датами
        addDays: pac.addDays,
        daysBetween: pac.daysBetween,
        formatDuration: pac.formatDuration,
        isWeekend: pac.isWeekend,
        calculateAge: pac.calculateAge,
        
        // Формы
        clearForm: pac.clearForm,
        showFormErrors: pac.showFormErrors,
        hideFormErrors: pac.hideFormErrors,
        validateEmail: pac.validateEmail,
        validatePassword: pac.validatePassword,
        validatePhone: pac.validatePhone,
        
        // UI компоненты
        accordion: pac.accordion,
        tabs: pac.tabs,
        dropdown: pac.dropdown,
        toggleSwitch: pac.toggleSwitch,
        starRating: pac.starRating,
        
        // Шаблоны
        loginPageTemplate: pac.loginPageTemplate,
        productCardTemplate: pac.productCardTemplate,
        imageGalleryTemplate: pac.imageGalleryTemplate,
        paginationTemplate: pac.paginationTemplate,
        
        // Анимации
        parallax: pac.parallax,
        hoverEffect: pac.hoverEffect,
        typewriter: pac.typewriter,
        
        // Работа с данными
        loadJSON: pac.loadJSON,
        filterData: pac.filterData,
        searchData: pac.searchData,
        paginateData: pac.paginateData,
        
        // Работа с медиа
        imagePreview: pac.imagePreview,
        audioPlayer: pac.audioPlayer,
        
        // Инициализация плагина
        init: () => {
            if (S.debugMode) {
                console.log('ComPAC.js plugin initialized');
            }
        }
    };
});