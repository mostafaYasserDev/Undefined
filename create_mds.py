import os

projects = [
    ("1-terminal.md", "programming", "Programming", "برمجة", "Terminal OS", "نظام الواجهة النصية", "A web-based retro terminal interface.", "واجهة نصية كلاسيكية.", "assets/programming_thumb.png", "React, TypeScript"),
    ("2-reel.md", "video", "Video Editing", "مونتاج فيديو", "Cinematic Reel", "مقطع سينمائي", "Dynamic showcase of motion.", "عرض ديناميكي للحركة.", "assets/video_thumb.png", "Premiere, AE"),
    ("3-brand.md", "design", "Design", "تصميم", "Brand Identity", "هوية بصرية", "Minimalist brand identity.", "تصميم هوية بصرية بسيطة.", "assets/programming_thumb.png", "Figma, Illustrator"),
    ("4-dashboard.md", "programming", "Programming", "برمجة", "Data Dashboard", "لوحة تحكم بيانات", "Complex data visualization.", "تصور بيانات معقدة.", "assets/video_thumb.png", "Vue, D3"),
    ("5-voice.md", "voice", "Voice Over", "تعليق صوتي", "Podcast Intro", "مقدمة بودكاست", "Clean and crisp voice over.", "تعليق صوتي واضح ونقي.", "assets/programming_thumb.png", "Audition, Mic"),
    ("6-photo.md", "photo", "Photography", "تصوير", "Urban Streets", "شوارع المدينة", "Street photography collection.", "مجموعة صور فوتوغرافية.", "assets/video_thumb.png", "Lightroom, Sony A7"),
    ("7-motion.md", "motion", "Motion Graphics", "موشن جرافيك", "Logo Reveal", "تحريك شعار", "Smooth logo animation.", "تحريك شعار سلس.", "assets/programming_thumb.png", "After Effects"),
    ("8-web.md", "programming", "Programming", "برمجة", "E-Commerce", "متجر إلكتروني", "Modern fast e-commerce.", "متجر حديث وسريع.", "assets/video_thumb.png", "Next.js, Tailwind")
]

blogs = [
    ("1-simplicity.md", "The Art of Simplicity", "فن البساطة", "May 2, 2026", "٢ مايو ٢٠٢٦", "Simplicity is the ultimate sophistication..."),
    ("2-rhythm.md", "Finding Rhythm", "إيجاد الإيقاع", "April 15, 2026", "١٥ أبريل ٢٠٢٦", "Editing is all about rhythm..."),
    ("3-typography.md", "Why Typography Matters", "لماذا الطباعة مهمة", "March 28, 2026", "٢٨ مارس ٢٠٢٦", "Type is the voice of the interface..."),
    ("4-future.md", "Future of Web", "مستقبل الويب", "Feb 10, 2026", "١٠ فبراير ٢٠٢٦", "The web is evolving rapidly...")
]

for p in projects:
    content = f"""---
category: {p[1]}
category_en: {p[2]}
category_ar: {p[3]}
title_en: {p[4]}
title_ar: {p[5]}
desc_en: {p[6]}
desc_ar: {p[7]}
img: {p[8]}
tools: {p[9]}
---
Detailed project content here...
"""
    with open(f"projects/{p[0]}", "w", encoding="utf-8") as f:
        f.write(content)

for b in blogs:
    content = f"""---
title_en: {b[1]}
title_ar: {b[2]}
date_en: {b[3]}
date_ar: {b[4]}
---
{b[5]}
"""
    with open(f"blog/{b[0]}", "w", encoding="utf-8") as f:
        f.write(content)
