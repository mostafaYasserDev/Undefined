---
category: programming
category_en: Programming
category_ar: برمجة
title_en: Terminal OS
title_ar: نظام الواجهة النصية
desc_en: A web-based retro terminal interface.
desc_ar: واجهة نصية كلاسيكية.
img: https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop
tools: React, TypeScript, Tailwind
images: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop, https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop
link: https://github.com/example/terminal-os
---
# Welcome to the Terminal
This project is an exploration of retro computing aesthetics using modern web technologies. 

## The Concept
The goal was to create a fully functional command-line interface in the browser that feels like a real operating system from the 80s.

### Example Code
Here is how we handle the command parsing in the core engine:

```javascript
function executeCommand(input) {
    const [cmd, ...args] = input.trim().split(' ');
    
    if (commands[cmd]) {
        return commands[cmd](args);
    } else {
        return `Command not found: ${cmd}`;
    }
}
```

---ar---
# مرحباً بك في واجهة الـ Terminal
هذا المشروع هو استكشاف لجماليات الحوسبة القديمة باستخدام تقنيات الويب الحديثة.

## المفهوم الأساسي
كان الهدف هو إنشاء واجهة سطر أوامر كاملة الوظائف في المتصفح، تشعر وكأنها نظام تشغيل حقيقي من الثمانينات.

### مثال على الكود
إليك كيف نقوم بمعالجة الأوامر في المحرك الأساسي:

```javascript
function executeCommand(input) {
    const [cmd, ...args] = input.trim().split(' ');
    
    if (commands[cmd]) {
        return commands[cmd](args);
    } else {
        return `Command not found: ${cmd}`;
    }
}
```
