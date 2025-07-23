(function() {
    'use strict';
    
    const TOOLS_CONFIG = {
        menuItems: [
            { name: 'Game Generation', url: 'tools/games.html', icon: 'gamepad' },
            { name: 'Videos Blog', url: 'tools/blog.html', icon: 'target' }, 
            { name: 'Reading Analysis', url: 'tools/oral.html', icon: 'reading' }, 
            { name: 'File-sharing', url: 'tools/file-sharing.html', icon: 'share' },
            { name: 'Image generation', url: 'tools/text-to-image.html', icon: 'tools' }, 
            { name: 'Algorithm Visualiser', url: 'tools/search-algo.html', icon: 'flowchart' },
            { name: 'Screen-Sharing', url: 'tools/screen-sharing.html', icon: 'monitor' },
            { name: 'Code-Compiler', url: 'tools/code-editor.html', icon: 'code' }
        ]
    };
    
    
    // SVG Icons
    const ICONS = {
        gamepad: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="11" x2="10" y2="11"></line><line x1="8" y1="9" x2="8" y2="13"></line><line x1="15" y1="12" x2="15.01" y2="12"></line><line x1="18" y1="10" x2="18.01" y2="10"></line><path d="M17.32 5H6.68a4 4 0 0 0-4.157 5.104l2.598 7.794a1 1 0 0 0 .95.69h2.364a1 1 0 0 0 .95-.69l2.598-7.794A4 4 0 0 0 17.32 5z"></path></svg>',
        share: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16,6 12,2 8,6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>',
        monitor: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
        code: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>',
        tools: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
        target: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
        arrow: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"></polyline></svg>',
        reading: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7v13a1 1 0 0 0 1 1h6a1 1 0 0 1 1 1V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zm20 0v13a1 1 0 0 1-1 1h-6a1 1 0 0 0-1 1V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></svg>',
        flowchart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="6" height="6"></rect>
  <rect x="15" y="3" width="6" height="6"></rect>
  <rect x="9" y="15" width="6" height="6"></rect>
  <path d="M6 9v6h3"></path>
  <path d="M18 9v6h-3"></path>
</svg>`
    };
    
    const toolsCSS = `
        .tools-menu-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
        }
        
        @media (min-width: 769px) {
            .tools-menu-container {
                display: block;
            }
        }
        
        .tools-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            outline: none;
            user-select: none;
        }
        
        .tools-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }
        
        .tools-button:active {
            transform: translateY(0);
        }
        
        .tools-button-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .tools-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            min-width: 250px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid #e2e8f0;
            overflow: hidden;
            margin-top: 8px;
        }
        
        .tools-dropdown.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .tools-dropdown::before {
            content: '';
            position: absolute;
            top: -8px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid white;
        }
        
        .tools-dropdown-header {
            padding: 16px 20px 12px;
            border-bottom: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        .tools-dropdown-title {
            font-size: 14px;
            font-weight: 600;
            color: #1a202c;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .tools-dropdown-subtitle {
            font-size: 12px;
            color: #64748b;
            margin: 4px 0 0;
        }
        
        .tools-menu-items {
            padding: 8px 0;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .tools-menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            text-decoration: none;
            color: #374151;
            transition: all 0.2s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            font-size: 14px;
        }
        
        .tools-menu-item:hover {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            color: #1e40af;
            transform: translateX(4px);
        }
        
        .tools-menu-item-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
            transition: color 0.2s ease;
        }
        
        .tools-menu-item:hover .tools-menu-item-icon {
            color: #1e40af;
        }
        
        .tools-menu-item-text {
            flex: 1;
            font-weight: 500;
        }
        
        .tools-menu-item-arrow {
            opacity: 0.5;
            transition: opacity 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .tools-menu-item:hover .tools-menu-item-arrow {
            opacity: 1;
        }
        
        .tools-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: transparent;
            z-index: 999;
            display: none;
        }
        
        .tools-overlay.show {
            display: block;
        }
        
        .tools-menu-item {
            animation: slideInRight 0.3s ease forwards;
            opacity: 0;
            transform: translateX(20px);
        }
        
        .tools-dropdown.show .tools-menu-item:nth-child(1) { animation-delay: 0.05s; }
        .tools-dropdown.show .tools-menu-item:nth-child(2) { animation-delay: 0.1s; }
        .tools-dropdown.show .tools-menu-item:nth-child(3) { animation-delay: 0.15s; }
        .tools-dropdown.show .tools-menu-item:nth-child(4) { animation-delay: 0.2s; }
        .tools-dropdown.show .tools-menu-item:nth-child(5) { animation-delay: 0.25s; }
        .tools-dropdown.show .tools-menu-item:nth-child(6) { animation-delay: 0.3s; }
        .tools-dropdown.show .tools-menu-item:nth-child(7) { animation-delay: 0.35s; }
        .tools-dropdown.show .tools-menu-item:nth-child(8) { animation-delay: 0.4s; }
        
        @keyframes slideInRight {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .tools-menu-items::-webkit-scrollbar {
            width: 6px;
        }
        
        .tools-menu-items::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
        }
        
        .tools-menu-items::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
        
        .tools-menu-items::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    `;
    
    function injectToolsCSS() {
        const style = document.createElement('style');
        style.textContent = toolsCSS;
        document.head.appendChild(style);
    }
    
    function createToolsMenu() {
        const container = document.createElement('div');
        container.className = 'tools-menu-container';
        
        const button = document.createElement('button');
        button.className = 'tools-button';
        button.innerHTML = `
            <span class="tools-button-icon">${ICONS.tools}</span>
            <span>Tools</span>
        `;
        button.setAttribute('aria-label', 'Open tools menu');
        
        const dropdown = document.createElement('div');
        dropdown.className = 'tools-dropdown';
        
        const header = document.createElement('div');
        header.className = 'tools-dropdown-header';
        header.innerHTML = `
            <div class="tools-dropdown-title">
                <span>${ICONS.target}</span>
                <span>Optimize Workflow</span>
            </div>
            <div class="tools-dropdown-subtitle">
                Select a tool to enhance your productivity
            </div>
        `;
        
        const menuItems = document.createElement('div');
        menuItems.className = 'tools-menu-items';
        
        TOOLS_CONFIG.menuItems.forEach(item => {
            const menuItem = document.createElement('a');
            menuItem.className = 'tools-menu-item';
            menuItem.href = item.url;
            menuItem.innerHTML = `
                <span class="tools-menu-item-icon">${ICONS[item.icon]}</span>
                <span class="tools-menu-item-text">${item.name}</span>
                <span class="tools-menu-item-arrow">${ICONS.arrow}</span>
            `;
            
            menuItem.addEventListener('click', function(e) {
                e.preventDefault();
            
                menuItem.style.opacity = '0.7';
                menuItem.style.pointerEvents = 'none';
            
                setTimeout(() => {
                    window.open(item.url, '_blank');
                    menuItem.style.opacity = '';
                    menuItem.style.pointerEvents = '';
                }, 150);
            });            
            menuItems.appendChild(menuItem);
        });
        
        const overlay = document.createElement('div');
        overlay.className = 'tools-overlay';
        
        dropdown.appendChild(header);
        dropdown.appendChild(menuItems);
        container.appendChild(button);
        container.appendChild(dropdown);
        document.body.appendChild(overlay);
        
        return { container, button, dropdown, overlay };
    }
    
    function initializeToolsMenu() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeToolsMenu);
            return;
        }
        
        injectToolsCSS();
        
        const { container, button, dropdown, overlay } = createToolsMenu();
        
        document.body.appendChild(container);
        
        let isMenuOpen = false;
        
        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                dropdown.classList.add('show');
                overlay.classList.add('show');
                button.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                button.setAttribute('aria-expanded', 'true');
            } else {
                dropdown.classList.remove('show');
                overlay.classList.remove('show');
                button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                button.setAttribute('aria-expanded', 'false');
            }
        }
        
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        overlay.addEventListener('click', function() {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
            }
        });
        
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !container.contains(e.target)) {
                toggleMenu();
            }
        });
        
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768 && isMenuOpen) {
                toggleMenu();
            }
        });
        
        console.log('Tools menu initialized successfully!');
    }

    initializeToolsMenu();
})();