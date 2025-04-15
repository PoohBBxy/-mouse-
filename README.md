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
## 安装方法
（仅支持）手动安装：
1. 复制完整脚本代码
2. 打开Tampermonkey仪表盘
3. 点击「+ 新建脚本」
4. 粘贴代码并保存

---

## 🚫 严正声明

本项目仅供学习与交流使用，禁止：

- 任何形式的第三方平台**转载、镜像、二次分发**
- **商业用途、牟利套壳、挂链接引流**
- **抹除作者信息、冒充原作**

未经本人书面许可者，视为恶意使用。  
**除了法律层面你可能要赔钱道歉，精神层面也不会放过你。**

---

## ⚠️ 民间制裁警告

男的：鸡鸡短 10 厘米。  
女的：月经提前 15 天，连来 9 周期。  
偷我项目的人，愿你一生写不出 Hello World！

*一切后果由使用者自负，勿谓言之不预也。*

---