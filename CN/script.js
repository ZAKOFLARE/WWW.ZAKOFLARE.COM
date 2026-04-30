// 纯原生 JS，无依赖
(function() {
    'use strict';

    // ===== 语言切换下拉菜单 =====
    const langToggle = document.querySelector('.lang-toggle');
    const langMenu = document.querySelector('.lang-menu');

    if (langToggle && langMenu) {
        // 点击按钮切换下拉显示
        langToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });

        // 点击菜单项执行跳转
        langMenu.addEventListener('click', function(e) {
            const target = e.target;
            if (target.tagName === 'LI') {
                const langPath = target.dataset.lang;
                if (langPath) {
                    window.location.href = langPath;
                }
            }
        });

        // 点击页面其他区域关闭下拉
        document.addEventListener('click', function() {
            langMenu.classList.remove('show');
        });

        // 防止点击菜单内部时关闭（由菜单项处理跳转，且阻止冒泡）
        langMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    const qqLinks = document.querySelectorAll('.qq-link');
    qqLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('https://qm.qq.com/q/3AKpE8fwxy');
        });
    });

    // ===== 软件使用量数据显示 =====
    class DateStatsDisplay {
        constructor() {
            this.apiUrl = 'https://api.2409178.xyz/date/zakoflate/web?=all';
            this.displayElement = document.getElementById('usageCount');
            this.updateInterval = null;
            this.currentValue = null;
            
            if (this.displayElement) {
                this.init();
            }
        }
        
        init() {
            // 立即加载一次数据
            this.fetchUsageData();
            
            // 设置3秒刷新间隔
            this.updateInterval = setInterval(() => {
                this.fetchUsageData();
            }, 3000);
            
            // 清理定时器
            window.addEventListener('beforeunload', () => {
                if (this.updateInterval) {
                    clearInterval(this.updateInterval);
                }
            });
        }
        
        async fetchUsageData() {
            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`API响应错误: ${response.status}`);
                }
                
                const data = await response.json();
                
                // API返回格式为: [114514]
                if (Array.isArray(data) && data.length > 0) {
                    this.updateDisplay(data[0]);
                } else {
                    console.error('API返回数据格式异常:', data);
                    this.displayError();
                }
            } catch (error) {
                console.error('获取使用量数据失败:', error);
                this.displayError();
            }
        }
        
        updateDisplay(value) {
            this.currentValue = value;
            
            // 格式化数字显示
            let displayText = '';
            
            if (value >= 10000) {
                // 超过1万时显示为w+格式
                const wValue = (value / 10000).toFixed(1);
                displayText = `${wValue}w+`;
                
                // 添加完整数字的悬停提示
                this.displayElement.innerHTML = `
                    ${displayText}
                    <span class="full-number">实际值: ${this.formatNumber(value)}</span>
                `;
                this.displayElement.classList.add('compact');
            } else {
                displayText = this.formatNumber(value);
                this.displayElement.textContent = displayText;
                this.displayElement.classList.remove('compact');
            }
            
            // 设置标题属性用于悬停提示
            this.displayElement.title = `实际值: ${this.formatNumber(value)}`;
            
            // 添加更新动画
            this.displayElement.style.opacity = '0.7';
            setTimeout(() => {
                this.displayElement.style.opacity = '1';
            }, 150);
        }
        
        formatNumber(num) {
            // 添加千分位分隔符
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        displayError() {
            this.displayElement.textContent = '--';
            this.displayElement.title = '数据加载失败，3秒后重试...';
            this.displayElement.classList.remove('compact');
        }
    }

    // 初始化软件使用量显示
    document.addEventListener('DOMContentLoaded', function() {
        new DateStatsDisplay();
    });
// ===== Cookie 授权弹窗功能 =====
const cookieConsentModal = document.getElementById('cookie-consent-modal');
const cookieConsentAccept = document.getElementById('cookie-consent-accept');
const cookieConsentReject = document.getElementById('cookie-consent-reject');

// 检查是否已同意
function hasConsented() {
    return localStorage.getItem('cookie_consent') === 'accepted';
}

// 检查是否已拒绝（或未做决定）
function hasDecided() {
    return localStorage.getItem('cookie_consent') !== null;
}

// 显示弹窗
function showCookieConsentModal() {
    if (cookieConsentModal) {
        cookieConsentModal.style.display = 'block';
    }
}

// 隐藏弹窗
function hideCookieConsentModal() {
    if (cookieConsentModal) {
        cookieConsentModal.style.display = 'none';
    }
}

// 同意
function acceptCookieConsent() {
    localStorage.setItem('cookie_consent', 'accepted');
    hideCookieConsentModal();
    // 同意后，立即存储当前主题偏好（如果已有）
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

// 拒绝
function rejectCookieConsent() {
    localStorage.setItem('cookie_consent', 'rejected');
    hideCookieConsentModal();
    // 拒绝后，清除之前存储的主题偏好，使用系统偏好但不存储
    localStorage.removeItem('theme');
}

// 绑定事件
if (cookieConsentAccept) {
    cookieConsentAccept.addEventListener('click', acceptCookieConsent);
}
if (cookieConsentReject) {
    cookieConsentReject.addEventListener('click', rejectCookieConsent);
}

// ===== 主题切换功能（修改版） =====
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
    } else {
        document.documentElement.classList.remove('dark');
        sunIcon.style.display = 'inline';
        moonIcon.style.display = 'none';
    }
    // 仅在用户同意cookie后存储主题偏好
    if (hasConsented()) {
        localStorage.setItem('theme', theme);
    }
}

// 初始化主题
function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 如果用户已同意cookie，则使用存储的主题
    if (hasConsented()) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            return;
        }
    }
    
    // 否则，使用系统偏好但不存储
    if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

// 切换事件
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
}

// 在 DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // ... 你原来的 DateStatsDisplay 初始化代码 ...
    
    // 初始化主题
    initTheme();
    
    // 如果用户尚未做出决定，显示cookie授权弹窗
    if (!hasDecided()) {
        showCookieConsentModal();
    }
});})();