# 学习通 Mouseout 事件拦截器

## 核心代码逻辑

### 1. 事件监听机制
```javascript
// 在捕获阶段拦截 mouseout 事件
document.addEventListener('mouseout', function(e) {
    if (e.relatedTarget === null) {
        e.stopImmediatePropagation(); // 终止事件传播
        e.preventDefault();          // 阻止默认行为
        // 记录拦截日志...
    }
}, true);  // 关键参数：useCapture=true

## 安装方法
（仅支持）手动安装：
1. 复制完整脚本代码
2. 打开Tampermonkey仪表盘
3. 点击「+ 新建脚本」
4. 粘贴代码并保存
