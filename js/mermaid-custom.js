// 文件路径： 您的Hugo项目根目录/static/js/mermaid-custom.js

// 这是一个健壮的脚本，它会确保 Mermaid.js 库被加载并且初始化。

(function () { // 使用立即执行函数表达式来封装代码
    // 检查 Mermaid 库是否已经加载
    if (typeof mermaid === 'undefined') {
        console.log("Mermaid.js 库未找到，正在尝试动态加载...");

        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"; // 使用最新的稳定版本 CDN
        script.onload = () => {
            // Mermaid.js 加载完成后，才进行初始化
            console.log("Mermaid.js CDN 文件加载成功，正在初始化...");
            mermaid.initialize({
                startOnLoad: true, // 确保页面加载时自动查找并渲染 Mermaid 代码块
                theme: 'default', // 默认主题，Stack 主题可能会根据网站的亮/暗模式调整，这里是基础设置
                securityLevel: 'loose' // 如果某些复杂图表渲染有问题，可以尝试设置为 'loose'
            });
            console.log("Mermaid.js 已成功初始化。");
        };
        script.onerror = (error) => {
            console.error("动态加载 mermaid.js CDN 文件失败:", error); // 错误信息
        };
        document.head.appendChild(script); // 将 script 标签添加到 <head>

    } else {
        // 如果 Mermaid 库已经存在，确保它被正确初始化（以防万一）
        console.log("Mermaid.js 库已存在，进行初始化检查。");
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose'
        });
    }
})(); // 立即执行函数表达式结束