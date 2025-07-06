/**
 * StaMina.js - Simplified Tools and Methods for Interactive Applications
 * Расширение для SVXsion.js
 * Версия 2.0.1
 * Лицензия: MIT
 * Дата: 2025-07-06
 * GitHub: https://github.com/Leha2cool
 */

S.use('StaMina', function(S) {
    // ========================
    // АЛИАСЫ ДЛЯ НОВИЧКОВ
    // ========================
    S.$ = S.get;
    S.$$ = S.getAll;
    S.text = S.setText;
    S.html = S.setHTML;
    S.add = S.addClass;
    S.remove = S.removeClass;
    S.toggle = S.toggleClass;
    S.css = S.setStyle;
    S.bind = S.on;
    S.unbind = S.off;
    S.fire = S.trigger;
    S.val = function(selector, value) {
        if (value === undefined) {
            const el = S.$(selector);
            return el ? el.value : null;
        }
        S.$$(selector).forEach(el => el.value = value);
        return S;
    };
    S.show = S.showAll;
    S.hide = S.hideAll;

    // ========================
    // РАСШИРЕННЫЕ ДОМ-ФУНКЦИИ
    // ========================
    S.create = S.createEl;
    S.q = S.$;
    S.qa = S.$$;
    
    S.each = function(selector, callback) {
        S.$$(selector).forEach(callback);
        return S;
    };
    
    S.find = function(selector, childSelector) {
        const parent = S.$(selector);
        return parent ? parent.querySelectorAll(childSelector) : [];
    };
    
    S.parent = function(selector) {
        const el = S.$(selector);
        return el ? el.parentElement : null;
    };
    
    S.children = function(selector) {
        const el = S.$(selector);
        return el ? Array.from(el.children) : [];
    };
    
    S.appendTo = function(selector, targetSelector) {
        const elements = S.$$(selector);
        const target = S.$(targetSelector);
        if (target) elements.forEach(el => target.appendChild(el));
        return S;
    };
    
    S.prependTo = function(selector, targetSelector) {
        const elements = S.$$(selector);
        const target = S.$(targetSelector);
        if (target) elements.forEach(el => target.insertBefore(el, target.firstChild));
        return S;
    };
    
    S.clone = function(selector) {
        const el = S.$(selector);
        return el ? el.cloneNode(true) : null;
    };
    
    S.empty = function(selector) {
        const el = S.$(selector);
        if (el) el.innerHTML = '';
        return S;
    };
    
    S.attr = function(selector, attr, value) {
        if (value === undefined) return S.getAttr(selector, attr);
        return S.setAttr(selector, attr, value);
    };
    
    S.data = function(selector, key, value) {
        const attr = `data-${key}`;
        if (value === undefined) return S.getAttr(selector, attr);
        return S.setAttr(selector, attr, value);
    };
    
    S.index = function(selector) {
        const el = S.$(selector);
        if (!el) return -1;
        return Array.from(el.parentElement.children).indexOf(el);
    };

    // ========================
    // РАСШИРЕННЫЕ АНИМАЦИИ
    // ========================
    S.fadeToggle = function(selector, duration = 400) {
        return S.isVisible(selector) 
            ? S.fadeOut(selector, duration) 
            : S.fadeIn(selector, duration);
    };
    
    S.slideToggle = function(selector, duration = 400) {
        return S.isVisible(selector) 
            ? S.slideUp(selector, duration) 
            : S.slideDown(selector, duration);
    };
    
    S.animateTo = function(selector, properties, duration = 400, easing = 'ease') {
        return S.animate(selector, properties, duration, easing);
    };

    // ========================
    // УПРОЩЕННЫЕ AJAX-ЗАПРОСЫ
    // ========================
    S.ajax = function(url, options = {}) {
        return S.fetchData(url, options);
    };
    
    S.getJSON = function(url, data = {}, options = {}) {
        return S.get(url, data, {...options, headers: {'Accept': 'application/json'}});
    };
    
    S.postJSON = function(url, data = {}, options = {}) {
        return S.post(url, data, {
            ...options,
            headers: {'Content-Type': 'application/json'}
        });
    };

    // ========================
    // УТИЛИТЫ ДЛЯ РАБОТЫ С ДАННЫМИ
    // ========================
    S.ready = function(callback) {
        if (document.readyState !== 'loading') callback();
        else document.addEventListener('DOMContentLoaded', callback);
        return S;
    };
    
    S.parseJSON = function(str) {
        try { return JSON.parse(str); } 
        catch (e) { return null; }
    };
    
    S.stringify = function(obj) {
        return JSON.stringify(obj);
    };
    
    S.redirect = function(url) {
        window.location.href = url;
        return S;
    };
    
    S.reload = function() {
        window.location.reload();
        return S;
    };
    
    S.param = function(obj) {
        return new URLSearchParams(obj).toString();
    };
    
    S.formData = function(selector) {
        return S.serializeForm(selector);
    };

    // ========================
    // ФУНКЦИИ ДЛЯ РАБОТЫ С МАССИВАМИ
    // ========================
    S.first = function(arr, n = 1) {
        return n === 1 ? arr[0] : arr.slice(0, n);
    };
    
    S.last = function(arr, n = 1) {
        return n === 1 ? arr[arr.length - 1] : arr.slice(-n);
    };
    
    S.sample = function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };
    
    S.shuffle = function(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    };
    
    S.chunk = function(arr, size) {
        return Array.from(
            { length: Math.ceil(arr.length / size) },
            (_, i) => arr.slice(i * size, i * size + size)
        );
    };
    
    S.uniq = function(arr) {
        return [...new Set(arr)];
    };
    
    S.pluck = function(arr, key) {
        return arr.map(item => item[key]);
    };
    
    S.groupBy = function(arr, key) {
        return arr.reduce((acc, obj) => {
            const group = obj[key];
            acc[group] = acc[group] || [];
            acc[group].push(obj);
            return acc;
        }, {});
    };

    // ========================
    // ФУНКЦИИ ДЛЯ РАБОТЫ С ОБЪЕКТАМИ
    // ========================
    S.objKeys = function(obj) {
        return Object.keys(obj);
    };
    
    S.objValues = function(obj) {
        return Object.values(obj);
    };
    
    S.objEntries = function(obj) {
        return Object.entries(obj);
    };
    
    S.objFrom = function(arr, key) {
        return arr.reduce((acc, item) => {
            acc[item[key]] = item;
            return acc;
        }, {});
    };
    
    S.objPick = function(obj, keys) {
        return keys.reduce((acc, key) => {
            if (obj.hasOwnProperty(key)) acc[key] = obj[key];
            return acc;
        }, {});
    };
    
    S.objOmit = function(obj, keys) {
        return Object.keys(obj)
            .filter(k => !keys.includes(k))
            .reduce((acc, k) => {
                acc[k] = obj[k];
                return acc;
            }, {});
    };

    // ========================
    // МАТЕМАТИЧЕСКИЕ ФУНКЦИИ
    // ========================
    S.sum = function(arr) {
        return arr.reduce((acc, val) => acc + val, 0);
    };
    
    S.avg = function(arr) {
        return S.sum(arr) / arr.length;
    };
    
    S.min = function(arr) {
        return Math.min(...arr);
    };
    
    S.max = function(arr) {
        return Math.max(...arr);
    };
    
    S.range = function(start, end, step = 1) {
        const result = [];
        for (let i = start; i <= end; i += step) {
            result.push(i);
        }
        return result;
    };
    
    S.clamp = function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    // ========================
    // СТРОКОВЫЕ ФУНКЦИИ
    // ========================
    S.trim = function(str) {
        return str.trim();
    };
    
    S.camelCase = function(str) {
        return str.replace(/[-_\s]+(.)?/g, (_, c) => 
            c ? c.toUpperCase() : ''
        );
    };
    
    S.snakeCase = function(str) {
        return str.replace(/\s+/g, '_')
                  .replace(/([a-z])([A-Z])/g, '$1_$2')
                  .toLowerCase();
    };
    
    S.kebabCase = function(str) {
        return str.replace(/\s+/g, '-')
                  .replace(/([a-z])([A-Z])/g, '$1-$2')
                  .toLowerCase();
    };
    
    S.startsWith = function(str, prefix) {
        return str.startsWith(prefix);
    };
    
    S.endsWith = function(str, suffix) {
        return str.endsWith(suffix);
    };
    
    S.contains = function(str, substr) {
        return str.includes(substr);
    };
    
    S.replaceAll = function(str, search, replace) {
        return str.split(search).join(replace);
    };

    // ========================
    // ФУНКЦИИ ДЛЯ РАБОТЫ С ДАТАМИ
    // ========================
    S.now = function() {
        return new Date();
    };
    
    S.formatDate = function(date, format = 'dd.MM.yyyy') {
        return S.formatDate(date, format);
    };
    
    S.dateAdd = function(date, amount, unit) {
        const result = new Date(date);
        switch(unit) {
            case 'days': result.setDate(result.getDate() + amount); break;
            case 'months': result.setMonth(result.getMonth() + amount); break;
            case 'years': result.setFullYear(result.getFullYear() + amount); break;
            case 'hours': result.setHours(result.getHours() + amount); break;
            case 'minutes': result.setMinutes(result.getMinutes() + amount); break;
            case 'seconds': result.setSeconds(result.getSeconds() + amount); break;
        }
        return result;
    };
    
    S.diffDates = function(date1, date2, unit = 'days') {
        const diff = Math.abs(date1 - date2);
        switch(unit) {
            case 'days': return Math.floor(diff / (1000 * 60 * 60 * 24));
            case 'hours': return Math.floor(diff / (1000 * 60 * 60));
            case 'minutes': return Math.floor(diff / (1000 * 60));
            case 'seconds': return Math.floor(diff / 1000);
            default: return diff;
        }
    };

    // ========================
    // АЛГОРИТМЫ ДЛЯ РАБОТЫ С КОЛЛЕКЦИЯМИ
    // ========================
    S.binarySearch = function(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    };
    
    S.quickSort = function(arr) {
        if (arr.length <= 1) return arr;
        
        const pivot = arr[0];
        const left = [];
        const right = [];
        
        for (let i = 1; i < arr.length; i++) {
            arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
        }
        
        return [...S.quickSort(left), pivot, ...S.quickSort(right)];
    };
    
    S.mergeSort = function(arr) {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = S.mergeSort(arr.slice(0, mid));
        const right = S.mergeSort(arr.slice(mid));
        
        return S.merge(left, right);
    };
    
    S.merge = function(left, right) {
        const result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            left[i] < right[j] 
                ? result.push(left[i++]) 
                : result.push(right[j++]);
        }
        
        return result.concat(left.slice(i), right.slice(j));
    };
    
    S.filterMap = function(arr, filterFn, mapFn) {
        return arr.reduce((acc, item) => {
            if (filterFn(item)) acc.push(mapFn(item));
            return acc;
        }, []);
    };

    // ========================
    // ФУНКЦИИ ДЛЯ ФУНКЦИОНАЛЬНОГО ПРОГРАММИРОВАНИЯ
    // ========================
    S.pipe = function(...fns) {
        return (x) => fns.reduce((v, f) => f(v), x);
    };
    
    S.compose = function(...fns) {
        return (x) => fns.reduceRight((v, f) => f(v), x);
    };
    
    S.curry = function(fn) {
        return function curried(...args) {
            return args.length >= fn.length 
                ? fn(...args) 
                : (...more) => curried(...args, ...more);
        };
    };
    
    S.memoize = function(fn) {
        const cache = new Map();
        return (...args) => {
            const key = JSON.stringify(args);
            return cache.has(key) 
                ? cache.get(key) 
                : (cache.set(key, fn(...args)), cache.get(key));
        };
    };

    // ========================
    // UI КОМПОНЕНТЫ
    // ========================
    S.alert = function(message, title = 'Уведомление') {
        const alertBox = S.create('div', {
            class: 'stamina-alert',
            styles: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 10000,
                minWidth: '300px'
            },
            html: `<h3 style="margin-top:0">${title}</h3>
                   <p>${message}</p>
                   <button class="stamina-alert-close" 
                           style="margin-top:10px;padding:5px 10px;cursor:pointer">
                       OK
                   </button>`
        });
        
        document.body.appendChild(alertBox);
        
        S.bind('.stamina-alert-close', 'click', () => {
            alertBox.remove();
        });
        
        return S;
    };
    
    S.confirm = function(question, callback, title = 'Подтверждение') {
        const confirmBox = S.create('div', {
            class: 'stamina-confirm',
            styles: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                zIndex: 10000,
                minWidth: '300px',
                textAlign: 'center'
            },
            html: `<h3 style="margin-top:0">${title}</h3>
                   <p>${question}</p>
                   <div style="margin-top:20px">
                       <button class="stamina-confirm-yes" 
                               style="margin-right:10px;padding:8px 15px;cursor:pointer">
                           Да
                       </button>
                       <button class="stamina-confirm-no" 
                               style="padding:8px 15px;cursor:pointer">
                           Нет
                       </button>
                   </div>`
        });
        
        document.body.appendChild(confirmBox);
        
        S.bind('.stamina-confirm-yes', 'click', () => {
            confirmBox.remove();
            callback(true);
        });
        
        S.bind('.stamina-confirm-no', 'click', () => {
            confirmBox.remove();
            callback(false);
        });
        
        return S;
    };

    // ========================
    // ИНИЦИАЛИЗАЦИЯ ПЛАГИНА
    // ========================
    return {
        init: function() {
            if (S.debugMode) {
                console.log('StaMina.js v2.0.0 успешно загружен!');
            }
        }
    };
});
