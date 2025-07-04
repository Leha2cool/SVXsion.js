/**
 * SVXsion.js - Simple Vision for X-Site Interactive Operations
 * Версия 2.0.0
 * Лицензия: MIT
 */

const S = (function() {
    // Проверка на мобильное устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Реестр плагинов
    const plugins = {};
    
    // Приватные вспомогательные функции
    const _getElements = (selector) => {
        if (!selector) return [];
        if (typeof selector === 'string') {
            return document.querySelectorAll(selector);
        } else if (selector instanceof NodeList) {
            return selector;
        } else if (selector instanceof HTMLElement) {
            return [selector];
        } else if (Array.isArray(selector)) {
            return selector.filter(el => el instanceof HTMLElement);
        }
        return [];
    };
    
    const _getElement = (selector) => {
        return _getElements(selector)[0] || null;
    };
    
    const _addPrefix = (style) => {
        const prefixes = ['webkit', 'moz', 'ms', 'o'];
        const result = {};
        
        for (const prop in style) {
            if (Object.prototype.hasOwnProperty.call(style, prop)) {
                result[prop] = style[prop];
                
                // Добавляем префиксы для CSS свойств
                if (prop.startsWith('transform') || prop.startsWith('transition')) {
                    prefixes.forEach(prefix => {
                        result[`${prefix}-${prop}`] = style[prop];
                    });
                }
            }
        }
        return result;
    };
    
    // Основной объект библиотеки
    const pub = {
        debugMode: false,
        plugins: {}
    };
    
    /**
     * ======================
     * СИСТЕМА ПЛАГИНОВ
     * ======================
     */
    
    pub.use = (pluginName, pluginFactory) => {
        if (plugins[pluginName]) {
            if (pub.debugMode) console.warn(`Плагин "${pluginName}" уже зарегистрирован`);
            return pub;
        }
        
        try {
            const plugin = pluginFactory(pub);
            plugins[pluginName] = plugin;
            pub.plugins[pluginName] = plugin;
            
            if (plugin.init && typeof plugin.init === 'function') {
                plugin.init();
            }
            
            if (pub.debugMode) console.log(`Плагин "${pluginName}" успешно загружен`);
        } catch (e) {
            if (pub.debugMode) console.error(`Ошибка загрузки плагина "${pluginName}":`, e);
        }
        
        return pub;
    };
    
    /**
     * ======================
     * DOM-МАНИПУЛЯЦИИ
     * ======================
     */
    
    pub.get = (selector) => _getElement(selector);
    pub.getAll = (selector) => _getElements(selector);
    
    pub.setText = (selector, text) => {
        _getElements(selector).forEach(el => {
            el.textContent = text;
        });
        return pub;
    };
    
    pub.setHTML = (selector, html) => {
        _getElements(selector).forEach(el => {
            el.innerHTML = html;
        });
        return pub;
    };
    
    pub.append = (selector, content) => {
        _getElements(selector).forEach(el => {
            el.insertAdjacentHTML('beforeend', content);
        });
        return pub;
    };
    
    pub.prepend = (selector, content) => {
        _getElements(selector).forEach(el => {
            el.insertAdjacentHTML('afterbegin', content);
        });
        return pub;
    };
    
    pub.before = (selector, content) => {
        _getElements(selector).forEach(el => {
            el.insertAdjacentHTML('beforebegin', content);
        });
        return pub;
    };
    
    pub.after = (selector, content) => {
        _getElements(selector).forEach(el => {
            el.insertAdjacentHTML('afterend', content);
        });
        return pub;
    };
    
    pub.remove = (selector) => {
        _getElements(selector).forEach(el => {
            el.parentNode?.removeChild(el);
        });
        return pub;
    };
    
    pub.addClass = (selector, className) => {
        _getElements(selector).forEach(el => {
            el.classList.add(className);
        });
        return pub;
    };
    
    pub.removeClass = (selector, className) => {
        _getElements(selector).forEach(el => {
            el.classList.remove(className);
        });
        return pub;
    };
    
    pub.toggleClass = (selector, className) => {
        _getElements(selector).forEach(el => {
            el.classList.toggle(className);
        });
        return pub;
    };
    
    pub.hasClass = (selector, className) => {
        const el = _getElement(selector);
        return el ? el.classList.contains(className) : false;
    };
    
    pub.setStyle = (selector, styles) => {
        const prefixedStyles = _addPrefix(styles);
        _getElements(selector).forEach(el => {
            Object.assign(el.style, prefixedStyles);
        });
        return pub;
    };
    
    pub.getStyle = (selector, property) => {
        const el = _getElement(selector);
        return el ? window.getComputedStyle(el).getPropertyValue(property) : null;
    };
    
    pub.setAttr = (selector, attr, value) => {
        _getElements(selector).forEach(el => {
            el.setAttribute(attr, value);
        });
        return pub;
    };
    
    pub.getAttr = (selector, attr) => {
        const el = _getElement(selector);
        return el ? el.getAttribute(attr) : null;
    };
    
    pub.removeAttr = (selector, attr) => {
        _getElements(selector).forEach(el => {
            el.removeAttribute(attr);
        });
        return pub;
    };
    
    pub.hide = (selector) => {
        _getElements(selector).forEach(el => {
            el.style.display = 'none';
        });
        return pub;
    };
    
    pub.show = (selector, display = 'block') => {
        _getElements(selector).forEach(el => {
            el.style.display = display;
        });
        return pub;
    };
    
    pub.toggle = (selector, display = 'block') => {
        _getElements(selector).forEach(el => {
            el.style.display = el.style.display === 'none' ? display : 'none';
        });
        return pub;
    };
    
    pub.isVisible = (selector) => {
        const el = _getElement(selector);
        if (!el) return false;
        return el.offsetWidth > 0 && el.offsetHeight > 0 && 
               window.getComputedStyle(el).display !== 'none';
    };
    
    /**
     * ======================
     * СОЗДАНИЕ ЭЛЕМЕНТОВ
     * ======================
     */
    
    pub.createEl = (tagName, options = {}) => {
        const el = document.createElement(tagName);
        
        // Установка атрибутов
        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => {
                el.setAttribute(key, value);
            });
        }
        
        // Установка классов
        if (options.class) {
            const classes = Array.isArray(options.class) ? options.class : [options.class];
            classes.forEach(className => el.classList.add(className));
        }
        
        // Установка стилей
        if (options.styles) {
            Object.assign(el.style, _addPrefix(options.styles));
        }
        
        // Установка текста/HTML
        if (options.text) {
            el.textContent = options.text;
        } else if (options.html) {
            el.innerHTML = options.html;
        }
        
        // Добавление обработчиков событий
        if (options.on) {
            Object.entries(options.on).forEach(([event, handler]) => {
                el.addEventListener(event, handler);
            });
        }
        
        // Добавление дочерних элементов
        if (options.children) {
            options.children.forEach(child => {
                if (child instanceof HTMLElement) {
                    el.appendChild(child);
                } else if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                }
            });
        }
        
        // Вставка в DOM
        if (options.parent) {
            const parent = _getElement(options.parent);
            if (parent) {
                parent.appendChild(el);
            }
        }
        
        return el;
    };
    
    /**
     * ======================
     * РАБОТА С СОБЫТИЯМИ
     * ======================
     */
    
    pub.on = (selector, eventName, callback) => {
        _getElements(selector).forEach(el => {
            el.addEventListener(eventName, callback);
        });
        return pub;
    };
    
    pub.off = (selector, eventName, callback) => {
        _getElements(selector).forEach(el => {
            el.removeEventListener(eventName, callback);
        });
        return pub;
    };
    
    pub.once = (selector, eventName, callback) => {
        const handler = (e) => {
            callback(e);
            pub.off(selector, eventName, handler);
        };
        pub.on(selector, eventName, handler);
        return pub;
    };
    
    pub.trigger = (selector, eventName, detail = {}) => {
        const event = new CustomEvent(eventName, { detail });
        _getElements(selector).forEach(el => {
            el.dispatchEvent(event);
        });
        return pub;
    };
    
    pub.delegate = (containerSelector, eventName, targetSelector, callback) => {
        const container = _getElement(containerSelector);
        if (!container) return pub;
        
        container.addEventListener(eventName, (e) => {
            let target = e.target;
            while (target && target !== container) {
                if (target.matches(targetSelector)) {
                    callback.call(target, e);
                    break;
                }
                target = target.parentNode;
            }
        });
        
        return pub;
    };
    
    /**
     * ======================
     * AJAX И РАБОТА С СЕРВЕРОМ
     * ======================
     */
    
    pub.fetchData = async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            if (pub.debugMode) console.error('SVXsion.fetchData error:', error);
            throw error;
        }
    };
    
    pub.get = async (url, data = {}, options = {}) => {
        const params = new URLSearchParams(data).toString();
        const finalUrl = params ? `${url}?${params}` : url;
        return pub.fetchData(finalUrl, { ...options, method: 'GET' });
    };
    
    pub.post = async (url, data = {}, options = {}) => {
        return pub.fetchData(url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        });
    };
    
    pub.upload = async (url, file, fieldName = 'file', extraData = {}) => {
        const formData = new FormData();
        formData.append(fieldName, file);
        
        for (const [key, value] of Object.entries(extraData)) {
            formData.append(key, value);
        }
        
        return pub.fetchData(url, {
            method: 'POST',
            body: formData
        });
    };
    
    pub.download = (url, filename) => {
        const link = pub.createEl('a', {
            attrs: {
                href: url,
                download: filename
            },
            styles: { display: 'none' }
        });
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    /**
     * ======================
     * ФОРМЫ И ВАЛИДАЦИЯ
     * ======================
     */
    
    pub.serializeForm = (formSelector) => {
        const form = _getElement(formSelector);
        if (!form) return {};
        
        const formData = new FormData(form);
        const result = {};
        
        for (const [key, value] of formData.entries()) {
            if (result[key]) {
                if (!Array.isArray(result[key])) {
                    result[key] = [result[key]];
                }
                result[key].push(value);
            } else {
                result[key] = value;
            }
        }
        
        return result;
    };
    
    pub.validateForm = (formSelector, rules) => {
        const form = _getElement(formSelector);
        if (!form) return { isValid: false, errors: {} };
        
        let isValid = true;
        const errors = {};
        
        Object.keys(rules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) return;
            
            const fieldRules = rules[fieldName];
            const value = field.value.trim();
            let errorElement = field.nextElementSibling;
            
            // Создаем элемент для ошибки, если его нет
            if (!errorElement || !errorElement.classList.contains('svx-error')) {
                errorElement = pub.createEl('div', {
                    class: 'svx-error',
                    styles: {
                        color: 'red',
                        fontSize: '0.8rem',
                        marginTop: '5px'
                    }
                });
                field.parentNode?.insertBefore(errorElement, field.nextSibling);
            }
            
            // Очистка предыдущих ошибок
            errorElement.textContent = '';
            
            // Проверка обязательного поля
            if (fieldRules.required && !value) {
                isValid = false;
                errors[fieldName] = 'Это поле обязательно для заполнения';
                errorElement.textContent = errors[fieldName];
                return;
            }
            
            // Проверка минимальной длины
            if (fieldRules.min && value.length < fieldRules.min) {
                isValid = false;
                errors[fieldName] = `Минимальная длина: ${fieldRules.min} символов`;
                errorElement.textContent = errors[fieldName];
                return;
            }
            
            // Проверка максимальной длины
            if (fieldRules.max && value.length > fieldRules.max) {
                isValid = false;
                errors[fieldName] = `Максимальная длина: ${fieldRules.max} символов`;
                errorElement.textContent = errors[fieldName];
                return;
            }
            
            // Проверка email
            if (fieldRules.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errors[fieldName] = 'Некорректный email адрес';
                    errorElement.textContent = errors[fieldName];
                    return;
                }
            }
            
            // Проверка совпадения паролей
            if (fieldRules.match) {
                const matchField = form.querySelector(`[name="${fieldRules.match}"]`);
                if (matchField && value !== matchField.value.trim()) {
                    isValid = false;
                    errors[fieldName] = 'Пароли не совпадают';
                    errorElement.textContent = errors[fieldName];
                    return;
                }
            }
        });
        
        return { isValid, errors };
    };
    
    pub.disableForm = (formSelector) => {
        const form = _getElement(formSelector);
        if (!form) return pub;
        
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = true;
        }
        return pub;
    };
    
    pub.enableForm = (formSelector) => {
        const form = _getElement(formSelector);
        if (!form) return pub;
        
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = false;
        }
        return pub;
    };
    
    /**
     * ======================
     * АНИМАЦИИ И ЭФФЕКТЫ
     * ======================
     */
    
    pub.animate = (selector, properties, duration = 400, easing = 'ease') => {
        const el = _getElement(selector);
        if (!el) return pub;
        
        const startTime = performance.now();
        const startValues = {};
        const computedStyle = getComputedStyle(el);
        
        // Получаем начальные значения свойств
        Object.keys(properties).forEach(prop => {
            startValues[prop] = parseFloat(computedStyle[prop]) || 0;
        });
        
        const animateFrame = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Применяем easing
            let easedProgress;
            if (easing === 'ease-in') {
                easedProgress = progress * progress;
            } else if (easing === 'ease-out') {
                easedProgress = 1 - Math.pow(1 - progress, 2);
            } else if (easing === 'ease-in-out') {
                easedProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            } else {
                easedProgress = progress;
            }
            
            // Применяем изменения
            Object.keys(properties).forEach(prop => {
                const startValue = startValues[prop];
                const endValue = parseFloat(properties[prop]);
                const currentValue = startValue + (endValue - startValue) * easedProgress;
                
                if (prop === 'opacity') {
                    el.style[prop] = currentValue;
                } else {
                    el.style[prop] = `${currentValue}px`;
                }
            });
            
            // Продолжаем анимацию
            if (progress < 1) {
                requestAnimationFrame(animateFrame);
            }
        };
        
        requestAnimationFrame(animateFrame);
        return pub;
    };
    
    pub.fadeIn = (selector, duration = 400) => {
        const el = _getElement(selector);
        if (!el) return pub;
        
        el.style.opacity = 0;
        el.style.display = 'block';
        
        pub.animate(selector, { opacity: 1 }, duration, 'ease-in');
        return pub;
    };
    
    pub.fadeOut = (selector, duration = 400, callback) => {
        const el = _getElement(selector);
        if (!el) return pub;
        
        pub.animate(selector, { opacity: 0 }, duration, 'ease-out', () => {
            el.style.display = 'none';
            if (callback) callback();
        });
        return pub;
    };
    
    pub.slideDown = (selector, duration = 400) => {
        const el = _getElement(selector);
        if (!el) return pub;
        
        el.style.display = 'block';
        const height = el.scrollHeight;
        
        el.style.height = '0px';
        el.style.overflow = 'hidden';
        
        pub.animate(selector, { height }, duration, 'ease-out');
        return pub;
    };
    
    pub.slideUp = (selector, duration = 400, callback) => {
        const el = _getElement(selector);
        if (!el) return pub;
        
        const height = el.scrollHeight;
        el.style.height = `${height}px`;
        el.style.overflow = 'hidden';
        
        pub.animate(selector, { height: 0 }, duration, 'ease-in', () => {
            el.style.display = 'none';
            el.style.height = '';
            el.style.overflow = '';
            if (callback) callback();
        });
        return pub;
    };
    
    /**
     * ======================
     * РАБОТА С ХРАНИЛИЩЕМ
     * ======================
     */
    
    pub.store = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            if (pub.debugMode) console.error('SVXsion.store error:', e);
        }
        return pub;
    };
    
    pub.getStore = (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            if (pub.debugMode) console.error('SVXsion.getStore error:', e);
            return null;
        }
    };
    
    pub.removeStore = (key) => {
        localStorage.removeItem(key);
        return pub;
    };
    
    pub.setCookie = (name, value, days = 365) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
        return pub;
    };
    
    pub.getCookie = (name) => {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }
        return null;
    };
    
    pub.deleteCookie = (name) => {
        pub.setCookie(name, '', -1);
        return pub;
    };
    
    pub.session = (key, value) => {
        if (value === undefined) {
            return pub.getStore(`session_${key}`);
        }
        pub.store(`session_${key}`, value);
        return pub;
    };
    
    /**
     * ======================
     * УТИЛИТЫ
     * ======================
     */
    
    pub.isMobile = () => isMobile;
    
    pub.random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    pub.formatDate = (date, format = 'dd.MM.yyyy') => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('dd', day)
            .replace('MM', month)
            .replace('yyyy', year)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    };
    
    pub.debounce = (func, delay = 300) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };
    
    pub.throttle = (func, limit = 300) => {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                func.apply(this, args);
                lastCall = now;
            }
        };
    };
    
    pub.uuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    
    pub.copy = (text) => {
        return new Promise((resolve, reject) => {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = 0;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    };
    
    pub.capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    
    pub.truncate = (str, maxLength, suffix = '...') => {
        return str.length > maxLength 
            ? str.substring(0, maxLength) + suffix 
            : str;
    };
    
    pub.smoothScroll = (selector, offset = 0) => {
        const target = _getElement(selector);
        if (!target) return pub;
        
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, startPosition + distance * progress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
        return pub;
    };
    
    /**
     * ======================
     * UI КОМПОНЕНТЫ
     * ======================
     */
    
    pub.toast = (message, type = 'info', duration = 3000) => {
        const toast = pub.createEl('div', {
            class: `svx-toast svx-toast-${type}`,
            styles: {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: type === 'error' ? '#ff6b6b' : 
                              type === 'success' ? '#51cf66' : 
                              type === 'warning' ? '#ffd43b' : '#339af0',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 10000,
                opacity: 0,
                transition: 'opacity 0.3s'
            },
            text: message
        });
        
        document.body.appendChild(toast);
        
        // Показываем тост
        setTimeout(() => {
            toast.style.opacity = 1;
        }, 10);
        
        // Скрываем и удаляем через указанное время
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    };
    
    pub.tooltip = (selector, content, position = 'top') => {
        const elements = _getElements(selector);
        if (elements.length === 0) return pub;
        
        elements.forEach(el => {
            const tooltipId = `tooltip-${pub.uuid()}`;
            let tooltip = null;
            
            const showTooltip = () => {
                if (tooltip) return;
                
                tooltip = pub.createEl('div', {
                    id: tooltipId,
                    class: 'svx-tooltip',
                    styles: {
                        position: 'absolute',
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        zIndex: 1000,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none'
                    },
                    text: content
                });
                
                document.body.appendChild(tooltip);
                
                const rect = el.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                let top, left;
                
                switch (position) {
                    case 'top':
                        top = rect.top - tooltipRect.height - 5;
                        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                        break;
                    case 'bottom':
                        top = rect.bottom + 5;
                        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                        break;
                    case 'left':
                        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                        left = rect.left - tooltipRect.width - 5;
                        break;
                    case 'right':
                        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                        left = rect.right + 5;
                        break;
                }
                
                tooltip.style.top = `${top + window.scrollY}px`;
                tooltip.style.left = `${left + window.scrollX}px`;
            };
            
            const hideTooltip = () => {
                if (tooltip && tooltip.parentNode) {
                    document.body.removeChild(tooltip);
                    tooltip = null;
                }
            };
            
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
            el.addEventListener('focus', showTooltip, true);
            el.addEventListener('blur', hideTooltip, true);
        });
        
        return pub;
    };
    
    pub.carousel = (containerSelector, images, options = {}) => {
        const container = _getElement(containerSelector);
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Создаем карусель
        const carouselId = `carousel-${pub.uuid()}`;
        const carousel = pub.createEl('div', {
            id: carouselId,
            styles: {
                position: 'relative',
                overflow: 'hidden',
                width: options.width || '100%',
                height: options.height || '400px',
                borderRadius: options.radius || '8px'
            }
        });
        
        // Создаем слайды
        const slides = [];
        images.forEach((img, index) => {
            const slide = pub.createEl('div', {
                class: 'svx-slide',
                styles: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: index === 0 ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out'
                }
            });
            carousel.appendChild(slide);
            slides.push(slide);
        });
        
        // Навигация
        if (options.navigation) {
            // Кнопки вперед/назад
            const prevBtn = pub.createEl('button', {
                class: 'svx-carousel-prev',
                html: '&larr;',
                styles: {
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    zIndex: 10
                }
            });
            
            const nextBtn = pub.createEl('button', {
                class: 'svx-carousel-next',
                html: '&rarr;',
                styles: {
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    zIndex: 10
                }
            });
            
            carousel.appendChild(prevBtn);
            carousel.appendChild(nextBtn);
        }
        
        container.appendChild(carousel);
        
        // Логика карусели
        let currentIndex = 0;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.opacity = i === index ? 1 : 0;
            });
            currentIndex = index;
        };
        
        const nextSlide = () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            showSlide(nextIndex);
        };
        
        const prevSlide = () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        };
        
        // Автопрокрутка
        let intervalId;
        if (options.autoplay) {
            intervalId = setInterval(nextSlide, options.interval || 3000);
            
            // Остановка при наведении
            carousel.addEventListener('mouseenter', () => {
                if (intervalId) clearInterval(intervalId);
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (options.autoplay) {
                    intervalId = setInterval(nextSlide, options.interval || 3000);
                }
            });
        }
        
        // Обработчики навигации
        if (options.navigation) {
            const nextBtn = carousel.querySelector('.svx-carousel-next');
            const prevBtn = carousel.querySelector('.svx-carousel-prev');
            
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Индикаторы
        if (options.indicators) {
            const indicators = pub.createEl('div', {
                class: 'svx-carousel-indicators',
                styles: {
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '5px',
                    zIndex: 10
                }
            });
            
            slides.forEach((_, i) => {
                const indicator = pub.createEl('button', {
                    class: 'svx-carousel-indicator',
                    styles: {
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        border: 'none',
                        background: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer'
                    }
                });
                
                indicator.addEventListener('click', () => showSlide(i));
                indicators.appendChild(indicator);
            });
            
            carousel.appendChild(indicators);
        }
        
        return {
            next: nextSlide,
            prev: prevSlide,
            goTo: showSlide
        };
    };
    
    /**
     * ======================
     * РАБОТА С URL
     * ======================
     */
    
    pub.getUrlParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };
    
    pub.getAllUrlParams = () => {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    };
    
    pub.updateUrl = (path, params = {}) => {
        const url = new URL(window.location);
        
        if (path) {
            url.pathname = path;
        }
        
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        
        window.history.pushState({}, '', url.toString());
        return pub;
    };
    
    pub.router = (routes) => {
        const handleRoute = () => {
            const path = window.location.pathname;
            const handler = routes[path] || routes['*'];
            
            if (handler && typeof handler === 'function') {
                handler();
            }
        };
        
        window.addEventListener('popstate', handleRoute);
        document.addEventListener('DOMContentLoaded', handleRoute);
        
        return {
            navigate: (path) => {
                window.history.pushState({}, '', path);
                handleRoute();
            }
        };
    };
    
    /**
     * ======================
     * ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
     * ======================
     */
    
    pub.debug = (enable = true) => {
        pub.debugMode = enable;
        return pub;
    };
    
    pub.version = () => {
        return '2.0.0';
    };
    
    // Инициализация библиотеки
    document.addEventListener('DOMContentLoaded', () => {
        if (pub.debugMode) {
            console.log('SVXsion.js v' + pub.version() + ' успешно загружена!');
        }
    });
    
    return pub;
})();

// Экспорт для различных сред
if (typeof module !== 'undefined' && module.exports) {
    module.exports = S;
}

if (typeof window !== 'undefined') {
    window.S = S;
}