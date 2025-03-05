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
```
- **事件相位控制**：使用捕获阶段（capturing phase）确保优先处理
- **目标判定**：通过`relatedTarget === null`识别窗口边界事件
- **事件阻断**：双重阻断策略（传播终止+默认行为阻止）

### 2. 日志系统实现
```javascript
const logs = []; // 环形缓冲区
function log(message) {
    logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
    if(logs.length > 200) logs.pop(); // 内存保护
}
```
- **逆向存储**：`unshift()`实现时间倒序排列
- **缓存控制**：固定200条记录防止内存泄漏
- **渲染优化**：使用`requestAnimationFrame`节流更新

## 安装方法
（仅支持）手动安装：
1. 复制完整脚本代码
2. 打开Tampermonkey仪表盘
3. 点击「+ 新建脚本」
4. 粘贴代码并保存
