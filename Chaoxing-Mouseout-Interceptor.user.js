// ==UserScript==
// @name         学习通mouse事件终结者
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监听并终结学习通的mouseout事件。
// @match        *://*.chaoxing.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (window.__mouseEventTerminatorLoaded) return;
    window.__mouseEventTerminatorLoaded = true;

    let logPanel = null;
    let logContent = null;
    let minimized = false;
    let enabled = true;
    let filterPassedLogs = true;
    const logs = [];

    function updateLogDisplay() {
        if (!logContent) return;

        const filteredLogs = logs.slice(0, 200) // 取最新200条
           .filter(log => !(filterPassedLogs && log.includes('[PASS]')));

        logContent.innerText = filteredLogs.join('\n');
        logContent.scrollTop = 0; // 自动滚动到顶部
    }


    function log(message) {
        const time = new Date().toLocaleTimeString();
        logs.unshift(`[${time}] ${message}`); // 新日志插入开头
        updateLogDisplay();
    }

    function exportLogs() {
        if (logs.length === 0) {
            alert("日志为空，无法导出！");
            return;
        }
        const blob = new Blob([logs.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "学习通_mouse事件终结者_日志.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function hijackEvents() {
        if (window.__eventHijacked) return;
        window.__eventHijacked = true;

        document.addEventListener('mouseout', function (e) {
            if (!enabled) return;

            const targetTag = e.target.tagName;
            const relatedTag = e.relatedTarget ? e.relatedTarget.tagName : 'NULL';

            if (e.relatedTarget === null) {
                e.stopImmediatePropagation();
                e.preventDefault();
                log(`[BAN] 拦截 mouseout 事件 | 目标: ${targetTag} | 相关元素: ${relatedTag} (离开窗口)`);
            } else {
                log(`[PASS] 未拦截 mouseout 事件 | 目标: ${targetTag} | 相关元素: ${relatedTag}`);
            }
        }, true);
    }

    function createPanel() {
        if (window !== window.top) return;

        logPanel = document.createElement('div');
        logPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            height: 320px;
            z-index: 999999;
            background: white;
            color: #606266;
            font-family: system-ui, -apple-system, sans-serif;
            border-radius: 6px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            resize: both;
            overflow: hidden;
            border: 1px solid #EBEEF5;
            min-width: 380px;
            min-height: 320px;
        `;

        logPanel.innerHTML = `
            <div id="logHeader" style="
                background: #409EFF;
                padding: 8px 12px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 6px 6px 0 0;
            ">
                <span style="font-weight: 500; font-size: 14px; color: white;">📌 Mouseout 事件拦截器</span>
                <div style="display: flex; gap: 12px;">
                    <span id="minimizePanel" style="cursor: pointer; color: white;">−</span>
                    <span id="closePanel" style="cursor: pointer; color: white;">×</span>
                </div>
            </div>
            <div id="logBody" style="
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 12px;
                gap: 8px;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <label style="font-size: 13px;">拦截状态：</label>
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" id="switch" ${enabled ? 'checked' : ''}>
                        <span style="font-size: 12px;">${enabled ? '开启' : '关闭'}</span>
                    </label>
                </div>
                <div style="display: flex; gap: 6px;">
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" id="clearLog" class="btn danger" style="display: none;">
                        <span style="font-size: 12px; cursor: pointer; background: #F56C6C; color: white; padding: 6px 12px; border-radius: 4px;">清空日志</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" id="exportLog" class="btn success" style="display: none;">
                        <span style="font-size: 12px; cursor: pointer; background: #67C23A; color: white; padding: 6px 12px; border-radius: 4px;">导出日志</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" id="toggleLog" class="btn primary" style="display: none;">
                        <span style="font-size: 12px; cursor: pointer; background: #409EFF; color: white; padding: 6px 12px; border-radius: 4px;">显示日志</span>
                    </label>
                </div>
                <div id="filterLogsContainer" style="display: block;">
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" id="filterLogs" checked>
                        <span style="font-size: 12px;">过滤未拦截事件</span>
                    </label>
                </div>
                <pre id="logContent" style="
                    flex: 1;
                    max-height: calc(100% - 90px);
                    min-height: 180px;
                    margin: 0;
                    padding: 6px;
                    background: #FAFAFA;
                    border: 1px solid #EBEEF5;
                    border-radius: 4px;
                    overflow-y: auto;
                    font-size: 12px;
                    line-height: 1.4;
                    display: block;
                "></pre>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .btn {
                flex: 1;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            .btn:hover { opacity: 0.9; }
            .primary { background: #409EFF; color: white; }
            .success { background: #67C23A; color: white; }
            .danger { background: #F56C6C; color: white; }

            #logContent {
                max-height: 240px !important;
                min-height: 120px !important;
                overflow-y: auto !important;
            }

            #logContent::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            #logContent::-webkit-scrollbar-track {
                background: #F5F7FA;
            }
            #logContent::-webkit-scrollbar-thumb {
                background: #C0C4CC;
                border-radius: 3px;
            }
        `;
        logPanel.appendChild(style);
        document.body.appendChild(logPanel);

        // 元素引用
        logContent = document.getElementById('logContent');
        const toggleLog = document.getElementById('toggleLog');
        const clearLog = document.getElementById('clearLog');
        const exportLog = document.getElementById('exportLog');
        const switchButton = document.getElementById('switch');
        const filterLogsCheckbox = document.getElementById('filterLogs');
        const filterLogsContainer = document.getElementById('filterLogsContainer');
        const closePanel = document.getElementById('closePanel');
        const minimizePanel = document.getElementById('minimizePanel');
        filterLogsContainer.style.display = 'block';
        toggleLog.textContent = '隐藏日志';

        switchButton.checked = enabled;
        switchButton.dispatchEvent(new Event('change'));

        // 事件绑定
        toggleLog.onclick = () => {
            const show = logContent.style.display === 'none';
            logContent.style.display = show ? 'block' : 'none';
            filterLogsContainer.style.display = show ? 'block' : 'none';
            toggleLog.textContent = show ? '隐藏日志' : '显示日志';
        };

        clearLog.onclick = () => {
            logs.length = 0;
            updateLogDisplay();
        };

        exportLog.onclick = exportLogs;

        switchButton.onchange = () => {
            enabled = switchButton.checked;
            const statusText = switchButton.nextElementSibling;
            statusText.textContent = enabled ? '开启' : '关闭';
            log(`拦截功能已${enabled ? '开启' : '关闭'}`);
        };

        filterLogsCheckbox.onchange = () => {
            filterPassedLogs = filterLogsCheckbox.checked;
            updateLogDisplay();
        };

        closePanel.onclick = () => logPanel.remove();

        // 修改最小化逻辑
        minimizePanel.onclick = () => {
            const logBody = document.getElementById('logBody');
            if (minimized) {
                logBody.style.display = 'flex';
                minimizePanel.textContent = '−';
                logPanel.style.height = '320px'; // 恢复原始高度
                logPanel.style.minHeight = '320px'; // 恢复最小高度
            } else {
                logBody.style.display = 'none';
                minimizePanel.textContent = '+';
                const headerHeight = document.getElementById('logHeader').offsetHeight;
                logPanel.style.height = `${headerHeight}px`; // 设置高度为header的高度
                logPanel.style.minHeight = `${headerHeight}px`; // 设置最小高度为header的高度
            }
            minimized = !minimized;
        };

        // 拖拽功能
        let isDragging = false;
        let offsetX, offsetY;
        document.getElementById('logHeader').addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - logPanel.offsetLeft;
            offsetY = e.clientY - logPanel.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
            });
        });

        function onMouseMove(e) {
            if (isDragging) {
                logPanel.style.left = `${e.clientX - offsetX}px`;
                logPanel.style.top = `${e.clientY - offsetY}px`;
            }
        }
    }

    hijackEvents();
    createPanel();
    log('鼠标事件拦截器已启动 - 默认拦截已开启');
})();
