
/* =====================================================
   DOM 元素获取
   获取页面中需要操作的所有DOM元素
   ===================================================== */
const cursor = document.querySelector('.custom-cursor');             // 自定义光标外圈
const cursorDot = document.querySelector('.cursor-dot');            // 自定义光标内点
const navbar = document.getElementById('navbar');                    // 顶部导航栏
const menuToggle = document.getElementById('menuToggle');           // 移动端菜单按钮
const mobileMenu = document.getElementById('mobileMenu');           // 移动端菜单
const scrollProgress = document.querySelector('.scroll-progress');  // 滚动进度条
const detailView = document.getElementById('detail-view');          // 项目详情视图容器
const detailContainer = document.getElementById('detail-container'); // 项目详情内容容器
const detailNavbar = document.getElementById('detailNavbar');       // 详情页导航栏
const detailNavTitle = document.getElementById('detailNavTitle');   // 详情页标题
const backBtn = document.getElementById('backBtn');                  // 返回按钮
const prevProjectBtn = document.getElementById('prevProjectBtn');   // 上一个项目按钮
const nextProjectBtn = document.getElementById('nextProjectBtn');   // 下一个项目按钮

/* =====================================================
   彩色光晕效果
   3个彩色光晕跟随鼠标移动（紫色、粉色、青色）
   ===================================================== */
const glowOrbs = document.querySelectorAll('.glow-orb');
let orbPositions = [
    { x: 0, y: 0, targetX: 0, targetY: 0 },  // 紫色光晕
    { x: 0, y: 0, targetX: 0, targetY: 0 },  // 粉色光晕
    { x: 0, y: 0, targetX: 0, targetY: 0 }   // 青色光晕
];

// 光晕跟随速度（不同速度产生层次感）
const orbSpeeds = [0.03, 0.02, 0.015];
// 光晕偏移量（让光晕不完全重叠）
const orbOffsets = [
    { x: 0, y: 0 },
    { x: 100, y: -50 },
    { x: -80, y: 80 }
];

/**
 * 更新光晕位置
 * 使用缓动效果让光晕平滑跟随鼠标
 */
function animateGlowOrbs() {
    glowOrbs.forEach((orb, index) => {
        // 计算目标位置（加上偏移量）
        const targetX = orbPositions[index].targetX + orbOffsets[index].x;
        const targetY = orbPositions[index].targetY + orbOffsets[index].y;
        
        // 缓动跟随
        orbPositions[index].x += (targetX - orbPositions[index].x) * orbSpeeds[index];
        orbPositions[index].y += (targetY - orbPositions[index].y) * orbSpeeds[index];
        
        // 应用变换
        orb.style.transform = `translate(${orbPositions[index].x - 200}px, ${orbPositions[index].y - 200}px)`;
    });
    
    requestAnimationFrame(animateGlowOrbs);
}

// 监听鼠标移动，更新光晕目标位置
document.addEventListener('mousemove', (e) => {
    orbPositions.forEach(pos => {
        pos.targetX = e.clientX;
        pos.targetY = e.clientY;
    });
});

// 启动光晕动画
animateGlowOrbs();

/* =====================================================
   自定义光标系统
   使用GSAP实现跟随鼠标的双层光标效果
   外圈有平滑延迟，内点即时跟随
   ===================================================== */

/**
 * 光标移动事件
 * 使用GSAP实现平滑的光标跟随动画
 */
document.addEventListener('mousemove', (e) => {
    // 外圈光标 - 使用GSAP缓动跟随，有0.15秒延迟
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
    });
    
    // 内点光标 - 即时跟随，无延迟
    gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0
    });
});

/**
 * 更新光标悬停效果的元素
 * 为所有可交互元素添加悬停事件
 */
function updateCursorHoverElements() {
    // 选择所有需要光标效果的元素（添加 .hoverable 类的元素也会响应）
    const hoverElements = document.querySelectorAll('a, button, .project-card, .magnetic-btn, .bottom-nav-btn, .hoverable');
    hoverElements.forEach(el => {
        // 先移除旧事件，避免重复绑定
        el.removeEventListener('mouseenter', cursorHoverEnter);
        el.removeEventListener('mouseleave', cursorHoverLeave);
        // 添加新事件
        el.addEventListener('mouseenter', cursorHoverEnter);
        el.addEventListener('mouseleave', cursorHoverLeave);
    });
}

// 鼠标进入可交互元素时放大光标并填充
function cursorHoverEnter() {
    cursor.classList.add('hovered');
}

// 鼠标离开可交互元素时恢复光标
function cursorHoverLeave() {
    cursor.classList.remove('hovered');
}

/* =====================================================
   磁吸按钮效果
   按钮会轻微跟随鼠标移动，产生磁吸感
   ===================================================== */
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            // 计算鼠标相对于按钮中心的偏移
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // 按钮跟随鼠标移动，系数0.3控制跟随程度
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            // 鼠标离开时重置位置
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* =====================================================
   Canvas 背景粒子动画
   创建可交互的粒子背景效果
   ===================================================== */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height;      // 画布尺寸
let particles = [];     // 粒子数组

/**
 * 调整画布尺寸以匹配窗口
 */
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

/**
 * 粒子类
 * 定义单个粒子的属性和行为
 */
class Particle {
    constructor() {
        this.reset();
    }
    
    // 重置/初始化粒子属性
    reset() {
        this.x = Math.random() * width;              // 随机X位置
        this.y = Math.random() * height;             // 随机Y位置
        this.vx = (Math.random() - 0.5) * 0.4;       // X方向速度
        this.vy = (Math.random() - 0.5) * 0.4;       // Y方向速度
        this.size = Math.random() * 2.3 + 0.1;         // 粒子大小
        this.alpha = Math.random() * 0.6 + 0.4;      // 透明度
        // 粒子颜色，使用紫色系HSL
        this.color = `hsl(${260 + Math.random() * 60}, 80%, 70%)`;
    }
    
    // 更新粒子位置
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // 边界检测，实现循环效果
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    
    // 绘制粒子
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 创建150个粒子
for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
}

// 记录鼠标位置用于粒子交互
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/**
 * Canvas动画主循环
 * 每帧更新并绘制所有粒子
 */
function animateCanvas() {
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        
        // 鼠标交互效果
        if (mouse.x) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 鼠标附近的粒子会被推开
            if (distance < 150) {
                const force = (150 - distance) / 150;
                p.x -= dx * force * 0.02;
                p.y -= dy * force * 0.02;
            }
            
            // 绘制粒子与鼠标之间的连线
            if (distance < 120) {
                ctx.strokeStyle = `rgba(167, 139, 250, ${0 - distance/120 * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
        
        // 绘制粒子之间的连线
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 距离小于100的粒子之间画线
            if (distance < 100) {
                ctx.strokeStyle = `rgba(167, 139, 250, ${0.35 - distance/100 * 0.1})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });
    
    // 循环调用
    requestAnimationFrame(animateCanvas);
}
// 启动Canvas动画
animateCanvas();

/* =====================================================
   页面初始化逻辑
   DOM加载完成后执行
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 注册GSAP ScrollTrigger插件
    gsap.registerPlugin(ScrollTrigger);

    /* -------------------------------------------------
       加载动画
       显示进度条和百分比
       ------------------------------------------------- */
    let progress = 0;
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderPercent = document.querySelector('.loader-percent');
    const loader = document.querySelector('.loader');
    
    // 检查是否从历史记录返回（如果是则直接隐藏加载器）
    if (performance.navigation.type === 2 || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
        loader.style.display = 'none';
        startApp();  // 直接启动应用
    } else {
        // 首次加载或刷新时显示加载动画
        const loadInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadInterval);
                startApp();  // 加载完成后启动应用
            }
            loaderProgress.style.width = progress + '%';
            loaderPercent.textContent = Math.floor(progress) + '%';
        }, 100);
    }
    }, 100);

    /**
     * 启动应用
     * 加载完成后播放入场动画并初始化交互
     */
    function startApp() {
        const timeline = gsap.timeline();
        
        // 隐藏加载器
        timeline.to('.loader', {
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            display: 'none',
            ease: 'power2.inOut'
        })
        // Hero区域文字动画
        .from('.hero-line', {
            y: 150,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,  // 依次出现
            ease: 'power3.out'
        }, "-=0.3")
        // 其他元素淡入
        .from('.reveal-text', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out'
        }, "-=0.8")
        // 导航栏滑入
        .from('.navbar-inner', {
            y: -100,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, "-=0.5");

        // 初始化各种交互效果
        updateCursorHoverElements();
        initMagneticButtons();
    }

    /* -------------------------------------------------
       滚动进度条
       页面顶部显示滚动进度
       ------------------------------------------------- */
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        scrollProgress.style.transform = `scaleX(${scrollPercent})`;
    });

    /* -------------------------------------------------
       导航栏滚动行为
       滚动时改变样式，向下滚动时隐藏
       ------------------------------------------------- */
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // 滚动超过50px时添加背景
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 向下滚动且超过500px时隐藏导航栏
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });

    /* -------------------------------------------------
       移动端菜单切换
       ------------------------------------------------- */
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        // 菜单打开时禁止页面滚动
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // 点击菜单链接后关闭菜单
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    /* -------------------------------------------------
       导航栏活动状态
       根据滚动位置高亮当前区域的导航链接
       ------------------------------------------------- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.top-navbar .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        // 更新活动链接样式
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    /* -------------------------------------------------
       平滑滚动
       点击锚点链接时平滑滚动到目标位置
       ------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                // 关闭移动端菜单
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // 平滑滚动到目标位置
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* -------------------------------------------------
       技能条动画
       滚动到技能区域时触发进度条动画
       ------------------------------------------------- */
    document.querySelectorAll('.skill-progress').forEach(bar => {
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            scaleX: bar.dataset.width / 100,
            duration: 1.5,
            ease: "power3.out"
        });
    });



/**
 * 生成项目详情内容（带动画类）
 * 用于首次打开项目时，带有 .detail-content 类用于入场动画
 */
function generateDetailContent(id) {
    const data = projects[id];
    
    
    // 为底部导航按钮添加事件监听
    document.getElementById('bottomPrevBtn').addEventListener('click', () => navigateProject('prev'));
    document.getElementById('bottomNextBtn').addEventListener('click', () => navigateProject('next'));
}


function generateDetailContentSimple(id) {
    const data = projects[id];
    
    
    // 为底部导航按钮添加事件监听
    document.getElementById('bottomPrevBtn').addEventListener('click', () => navigateProject('prev'));
    document.getElementById('bottomNextBtn').addEventListener('click', () => navigateProject('next'));
}


/**
 * 获取上一个项目的标题
 * 用于底部导航按钮显示
 */
function getPrevProjectTitle() {
    const prevId = currentProjectId > 1 ? currentProjectId - 1 : totalProjects;
    // 尝试提取括号内的英文名，否则返回完整标题
    return projects[prevId].title.split('(')[1]?.replace(')', '') || projects[prevId].title;
}

/**
 * 获取下一个项目的标题
 * 用于底部导航按钮显示
 */
function getNextProjectTitle() {
    const nextId = currentProjectId < totalProjects ? currentProjectId + 1 : 1;
    return projects[nextId].title.split('(')[1]?.replace(')', '') || projects[nextId].title;
}

// 全局图片预览层
if (!document.getElementById('imgPreview')) {
    const preview = document.createElement('div');
    preview.id = 'imgPreview';
    preview.style.cssText = `
        position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; z-index: 99999;
        background: rgba(0,0,0,0.85); display: none; align-items: center; justify-content: center; cursor: zoom-out; transition: opacity 0.3s;`;
    preview.innerHTML = '<img id="imgPreviewImg" style="max-width:90vw;max-height:90vh;border-radius:24px;box-shadow:0 8px 32px #0008;" />';
    document.body.appendChild(preview);
    preview.addEventListener('click', () => {
        preview.style.display = 'none';
    });
}

function enableImagePreview() {
    setTimeout(() => {
        document.querySelectorAll('.detail-content img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.onclick = function(e) {
                e.stopPropagation();
                const preview = document.getElementById('imgPreview');
                const previewImg = document.getElementById('imgPreviewImg');
                previewImg.src = img.src;
                preview.style.display = 'flex';
                preview.style.opacity = '1';
            };
        });
    }, 300);
}
