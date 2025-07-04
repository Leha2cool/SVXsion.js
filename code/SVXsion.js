/**
 * SVXsion.js - Simple Vision for X-Site Interactive Operations
 * Версия 2.4.0
 * Лицензия: MIT
 * Дата: 2025-07-03
 * GitHub: https://github.com/Leha2cool
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
        el