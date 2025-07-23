const GraphCreator = {
    graphWindow: null,

    enhancedPrompt: `You are "Milo" - an AI assistant for teachers with advanced graph and chart creation capabilities.

When a teacher asks for graphs, charts, flowcharts, diagrams, or data visualizations, follow these steps:

IMPORTANT: You MUST create actual functional and interactive outputs, not just descriptions or images.

Main Points:
- If it's a **graph/chart**, use Chart.js from CDN: https://cdn.jsdelivr.net/npm/chart.js
- If it's a **flowchart, architecture diagram, system design, or data flow**, use Mermaid.js from CDN: https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js
- Create a COMPLETE, SELF-CONTAINED HTML page with:
   - Full HTML structure (<!DOCTYPE html>, <html>, <head>, <body>)
   - All CSS in <style> tags
   - All JS in <script> tags (not type="module" for Mermaid)
   - Real example data
   - Interactive and responsive design
   - Clean educational visuals
   - Print/export functionality if possible

For Chart.js graphs, use this exact structure with FIXED SIZING:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Educational Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #f5f5f5;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            height: 400px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        canvas {
            max-width: 100% !important;
            max-height: 100% !important;
        }
        h1 { text-align: center; color: #333; }
        .print-btn { 
            display: block; 
            margin: 20px auto; 
            padding: 10px 20px; 
            background: #007bff; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
        }
    </style>
</head>
<body>
    <h1>Chart Title</h1>
    <div class="chart-container">
        <canvas id="myChart"></canvas>
    </div>
    <button class="print-btn" onclick="window.print()">Print Chart</button>
    
    <script>
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar', // or 'pie', 'line', etc.
            data: {
                labels: ['Label1', 'Label2', 'Label3'],
                datasets: [{
                    label: 'Dataset Name',
                    data: [12, 19, 3],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Chart Description'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>
\`\`\`

For Mermaid diagrams, use this exact structure:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Architecture Diagram</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .mermaid { text-align: center; margin: 20px auto; }
    </style>
</head>
<body>
    <h1>Title</h1>
    <div class="mermaid">
        graph TD
            A[Start] --> B[Process]
            B --> C[End]
    </div>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                htmlLabels: true,
                curve: 'basis'
            }
        });
    </script>
</body>
</html>
\`\`\`

CRITICAL: For Chart.js, ALWAYS use the fixed container structure above to prevent charts from expanding uncontrollably.

Please provide the HTML code in a code block as shown above, along with a brief explanation of what you've created.

1. Ask:
   - Graph/chart OR flowchart/diagram?
   - Topic and level
   - Type (bar, pie, flowchart, DFD, architecture, etc.)
   - Sample or real data?
   - Any color or layout preference?

2. Then generate full self-contained HTML based on type with explanation.

3. Mark your response with: [MILO_GRAPH_OUTPUT] at the end`,

    isGraphResponse(response) {
        return response.includes('[MILO_GRAPH_OUTPUT]') || 
               response.includes('[INTERACTIVE_GRAPH_READY]') || 
               response.includes('[INTERACTIVE_FLOWCHART_READY]') || 
               (response.includes('<!DOCTYPE html>') && 
                (response.includes('Chart.js') || response.includes('mermaid') ||
                 response.includes('new Chart') || response.includes('<canvas') ||
                 response.includes('class="mermaid"')));
    },

    extractGraphHTML(response) {
        let htmlContent = '';
        
        // First try to extract from markdown code block
        const htmlBlockMatch = response.match(/```html\s*([\s\S]*?)\s*```/);
        if (htmlBlockMatch) {
            htmlContent = htmlBlockMatch[1];
        } else {
            // Try to find HTML without code block markers
            const htmlMatch = response.match(/(<!DOCTYPE html>[\s\S]*?<\/html>)/);
            if (htmlMatch) {
                htmlContent = htmlMatch[1];
            } else {
                // Try to find HTML starting with <html>
                const htmlMatch2 = response.match(/(<html[\s\S]*?<\/html>)/);
                if (htmlMatch2) {
                    htmlContent = '<!DOCTYPE html>\n' + htmlMatch2[1];
                }
            }
        }
        
        // If we found HTML content, ensure it's complete and functional
        if (htmlContent) {
            // Fix common issues with Mermaid
            if (htmlContent.includes('mermaid')) {
                htmlContent = this.fixMermaidHTML(htmlContent);
            }
            
            // Ensure Chart.js is properly included
            if (htmlContent.includes('Chart') && !htmlContent.includes('chart.js')) {
                htmlContent = this.fixChartJSHTML(htmlContent);
            }
        }
        
        return htmlContent.trim();
    },

    fixMermaidHTML(htmlContent) {
        // Ensure Mermaid script is included
        if (!htmlContent.includes('mermaid@10/dist/mermaid.min.js') && !htmlContent.includes('mermaid.min.js')) {
            const headEndIndex = htmlContent.indexOf('</head>');
            if (headEndIndex !== -1) {
                const mermaidScript = `    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>\n`;
                htmlContent = htmlContent.substring(0, headEndIndex) + mermaidScript + htmlContent.substring(headEndIndex);
            }
        }

        // Ensure Mermaid is initialized
        if (!htmlContent.includes('mermaid.initialize')) {
            const bodyEndIndex = htmlContent.lastIndexOf('</body>');
            if (bodyEndIndex !== -1) {
                const initScript = `
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'default',
                flowchart: {
                    htmlLabels: true,
                    curve: 'basis'
                },
                securityLevel: 'loose'
            });
        });
    </script>`;
                htmlContent = htmlContent.substring(0, bodyEndIndex) + initScript + htmlContent.substring(bodyEndIndex);
            }
        }

        // Remove any module type from scripts
        htmlContent = htmlContent.replace(/type="module"/g, '');
        
        return htmlContent;
    },

    fixChartJSHTML(htmlContent) {
        // Ensure Chart.js is included
        if (!htmlContent.includes('chart.js')) {
            const headEndIndex = htmlContent.indexOf('</head>');
            if (headEndIndex !== -1) {
                const chartScript = `    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n`;
                htmlContent = htmlContent.substring(0, headEndIndex) + chartScript + htmlContent.substring(headEndIndex);
            }
        }

        // Fix Chart.js responsive issues by adding proper CSS and configuration
        if (!htmlContent.includes('chart-container') && htmlContent.includes('<canvas')) {
            // Add proper CSS for chart sizing
            const styleEndIndex = htmlContent.indexOf('</style>');
            if (styleEndIndex !== -1) {
                const chartCSS = `
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            height: 400px;
            margin: 20px auto;
            padding: 20px;
        }
        canvas {
            max-width: 100% !important;
            max-height: 100% !important;
        }
        `;
                htmlContent = htmlContent.substring(0, styleEndIndex) + chartCSS + htmlContent.substring(styleEndIndex);
            }

            // Wrap canvas in container div
            htmlContent = htmlContent.replace(/<canvas([^>]*)>/g, '<div class="chart-container"><canvas$1>');
            htmlContent = htmlContent.replace(/<\/canvas>/g, '</canvas></div>');

            // Fix Chart.js configuration to prevent expanding
            const chartConfigPattern = /new Chart\(([^,]+),\s*{([^}]+(?:{[^}]*}[^}]*)*[^}]*)}\)/g;
            htmlContent = htmlContent.replace(chartConfigPattern, (match, canvasRef, config) => {
                // Check if responsive and maintainAspectRatio are already set
                if (!config.includes('responsive') || !config.includes('maintainAspectRatio')) {
                    // Add responsive configuration
                    const optionsMatch = config.match(/options:\s*{([^}]+(?:{[^}]*}[^}]*)*[^}]*)}/);
                    if (optionsMatch) {
                        const existingOptions = optionsMatch[1];
                        const newOptions = existingOptions + `,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        }`;
                        config = config.replace(existingOptions, newOptions);
                    } else {
                        // Add options if not present
                        config += `,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top'
                                }
                            }
                        }`;
                    }
                }
                return `new Chart(${canvasRef}, {${config}})`;
            });
        }

        return htmlContent;
    },

    createViewButton(graphHTML) {
        const viewButton = document.createElement('button');
        viewButton.className = 'graph-view-button';
        viewButton.innerHTML = '📊 View Interactive Graph/Flowchart';
        viewButton.addEventListener('click', () => {
            this.openGraphWindow(graphHTML);
        });
        return viewButton;
    },

    openGraphWindow(graphHTML) {
        if (this.graphWindow && !this.graphWindow.closed) {
            this.graphWindow.close();
        }

        this.graphWindow = window.open('', 'MiloGraph', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        if (this.graphWindow) {
            this.graphWindow.document.write(graphHTML);
            this.graphWindow.document.close();
            this.graphWindow.focus();
        } else {
            alert('Please allow popups for this site to view the interactive output!');
        }
    },

    formatGraphMessage(message) {
        if (this.isGraphResponse(message)) {
            const graphHTML = this.extractGraphHTML(message);
            
            console.log('Graph HTML extracted:', graphHTML ? 'Found' : 'Not found'); // Debug log
            
            if (graphHTML) {
                // Clean the message by removing HTML code blocks and markers
                let cleanMessage = message
                    .replace(/```html\s*[\s\S]*?\s*```/, '')
                    .replace(/(<!DOCTYPE html>[\s\S]*?<\/html>)/, '')
                    .replace(/\[MILO_GRAPH_OUTPUT\]/, '')
                    .replace(/\[INTERACTIVE_GRAPH_READY\]/, '')
                    .replace(/\[INTERACTIVE_FLOWCHART_READY\]/, '');

                // Remove common patterns
                const metadataPattern = /1\..+?5\..+?\*\*\)/s;
                cleanMessage = cleanMessage.replace(metadataPattern, '');
                cleanMessage = cleanMessage.replace(/Here's.*?(HTML|code).*?:/i, '');
                const introPattern = /^I can create.*?(Instead, I will create|Here's)/is;
                cleanMessage = cleanMessage.replace(introPattern, '');

                // If message is too short after cleaning, provide a default
                if (cleanMessage.trim().length < 20) {
                    cleanMessage = 'I\'ve created an interactive visualization for you. Click below to view it in a new window.';
                }

                const container = document.createElement('div');
                container.className = 'graph-message-container';

                const indicator = document.createElement('div');
                indicator.className = 'graph-indicator';
                indicator.textContent = '📊 Interactive Output Ready';
                container.appendChild(indicator);

                const messageDiv = document.createElement('div');
                messageDiv.innerHTML = cleanMessage.trim();
                container.appendChild(messageDiv);

                const viewButton = this.createViewButton(graphHTML);
                container.appendChild(viewButton);

                return container;
            } else {
                console.log('No valid HTML found in response:', message.substring(0, 200)); // Debug log
            }
        }

        return null;
    }
};

const PPTGenerator = {
    pptWindow: null,

    enhancedPPTPrompt: `You are "Milo" - an AI assistant for teachers with advanced PowerPoint presentation creation capabilities.

When a teacher asks for presentations, PPT, slides, or PowerPoint, follow these steps:

IMPORTANT: You MUST create actual functional HTML-based presentation, not just descriptions.

Main Points:
- Create a COMPLETE, SELF-CONTAINED HTML presentation using:
   - reveal.js from CDN: https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/reveal.js
   - CSS from CDN: https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/reveal.css
   - Theme CSS: https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/theme/white.css
- Create a full HTML structure with:
   - Full HTML structure (<!DOCTYPE html>, <html>, <head>, <body>)
   - Multiple slides with educational content
   - Navigation controls
   - Professional styling
   - Download/print functionality
   - Responsive design
   - Use online image links if needed

Use this exact structure and provide in a code block:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Educational Presentation</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/theme/white.css">
    <style>
        .reveal .slides section { text-align: center; }
        .reveal h1, .reveal h2, .reveal h3 { color: #2c3e50; }
        .download-btn { position: fixed; top: 20px; right: 20px; z-index: 1000; 
                       background: #3498db; color: white; border: none; padding: 10px 20px; 
                       border-radius: 5px; cursor: pointer; font-size: 14px; }
        .download-btn:hover { background: #2980b9; }
    </style>
</head>
<body>
    <button class="download-btn" onclick="downloadPresentation()">📥 Download PPT</button>
    <div class="reveal">
        <div class="slides">
            <section>
                <h1>Presentation Title</h1>
                <p>Subtitle or Description</p>
            </section>
            <section>
                <h2>Slide 2 Title</h2>
                <p>Content here</p>
            </section>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/reveal.js"></script>
    <script>
        Reveal.initialize({
            hash: true,
            transition: 'slide',
            controls: true,
            progress: true,
            center: true,
            touch: true
        });
        
        function downloadPresentation() {
            const title = document.querySelector('h1').textContent || 'Presentation';
            const filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.html';
            const content = document.documentElement.outerHTML;
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
        });
    </script>
</body>
</html>
\`\`\`

Please provide the HTML code in a code block as shown above, along with a brief explanation.

1. Ask teacher about:
   - Topic and subject
   - Target grade level
   - Number of slides needed
   - Specific content requirements
   - Visual preferences

2. Generate complete HTML presentation with multiple slides and explanation

3. Mark your response with: [MILO_PPT_OUTPUT] at the end`,

    isPPTResponse(response) {
        return response.includes('[MILO_PPT_OUTPUT]') ||
               response.includes('[INTERACTIVE_PPT_READY]') || 
               (response.includes('<!DOCTYPE html>') && 
                (response.includes('reveal.js') || response.includes('class="reveal"') ||
                 response.includes('slides section') || response.includes('downloadPresentation')));
    },

    extractPPTHTML(response) {
        let htmlContent = '';
        
        // First try to extract from markdown code block
        const htmlBlockMatch = response.match(/```html\s*([\s\S]*?)\s*```/);
        if (htmlBlockMatch) {
            htmlContent = htmlBlockMatch[1];
        } else {
            // Try to find HTML without code block markers
            const htmlMatch = response.match(/(<!DOCTYPE html>[\s\S]*?<\/html>)/);
            if (htmlMatch) {
                htmlContent = htmlMatch[1];
            } else {
                // Try to find HTML starting with <html>
                const htmlMatch2 = response.match(/(<html[\s\S]*?<\/html>)/);
                if (htmlMatch2) {
                    htmlContent = '<!DOCTYPE html>\n' + htmlMatch2[1];
                }
            }
        }
        
        return htmlContent.trim();
    },

    createPPTViewButton(pptHTML) {
        const viewButton = document.createElement('button');
        viewButton.className = 'ppt-view-button';
        viewButton.innerHTML = '🎯 View Interactive Presentation';
        viewButton.addEventListener('click', () => {
            this.openPPTWindow(pptHTML);
        });
        return viewButton;
    },

    openPPTWindow(pptHTML) {
        if (this.pptWindow && !this.pptWindow.closed) {
            this.pptWindow.close();
        }

        this.pptWindow = window.open('', 'MiloPPT', 'width=1400,height=900,scrollbars=yes,resizable=yes');
        if (this.pptWindow) {
            this.pptWindow.document.write(pptHTML);
            this.pptWindow.document.close();
            this.pptWindow.focus();
        } else {
            alert('Please allow popups for this site to view the interactive presentation!');
        }
    },

    formatPPTMessage(message) {
        if (this.isPPTResponse(message)) {
            const pptHTML = this.extractPPTHTML(message);
            
            console.log('PPT HTML extracted:', pptHTML ? 'Found' : 'Not found'); // Debug log
            
            if (pptHTML) {
                let cleanMessage = message
                    .replace(/```html\s*[\s\S]*?\s*```/, '')
                    .replace(/(<!DOCTYPE html>[\s\S]*?<\/html>)/, '')
                    .replace(/\[MILO_PPT_OUTPUT\]/, '')
                    .replace(/\[INTERACTIVE_PPT_READY\]/, '');

                const metadataPattern = /1\..+?5\..+?\*\*\)/s;
                cleanMessage = cleanMessage.replace(metadataPattern, '');
                cleanMessage = cleanMessage.replace(/Here's.*?(HTML|code|presentation).*?:/i, '');
                const introPattern = /^I can create.*?(Instead, I will create|Here's)/is;
                cleanMessage = cleanMessage.replace(introPattern, '');

                if (cleanMessage.trim().length < 20) {
                    cleanMessage = 'I\'ve created an interactive presentation for you. Click below to view and download it.';
                }

                const container = document.createElement('div');
                container.className = 'ppt-message-container';

                const indicator = document.createElement('div');
                indicator.className = 'ppt-indicator';
                indicator.textContent = '🎯 Interactive Presentation Ready';
                container.appendChild(indicator);

                const messageDiv = document.createElement('div');
                messageDiv.innerHTML = cleanMessage.trim();
                container.appendChild(messageDiv);

                const viewButton = this.createPPTViewButton(pptHTML);
                container.appendChild(viewButton);

                return container;
            } else {
                console.log('No valid HTML found in PPT response:', message.substring(0, 200)); // Debug log
            }
        }

        return null;
    }
};

// Rest of your TeacherAssistant code remains the same
const TeacherAssistant = {
    init() {
        this.injectCSS();
        this.setupEnhancedResponseHandler();
        this.setupMessageHandler();
    },

    setupEnhancedResponseHandler() {
        const originalGetMiloResponse = window.getMiloResponse;

        window.getMiloResponse = async function(query) {
            const lowerQuery = query.toLowerCase();

            // PPT keywords
            const pptKeywords = [
                'create presentation', 'make presentation', 'generate presentation',
                'create ppt', 'make ppt', 'generate ppt', 'powerpoint',
                'create slides', 'make slides', 'generate slides',
                'presentation slides', 'slide deck', 'slideshow',
                'educational presentation', 'lesson presentation',
                'interactive presentation', 'classroom presentation'
            ];

            // Flow and graph keywords
            const flowKeywords = ['flowchart', 'flow chart', 'data flow', 'dfd', 'process diagram', 'architecture diagram', 'system design', 'component diagram', 'uml', 'structure', 'network diagram', 'database schema', 'er diagram', 'class diagram', 'sequence diagram', 'use case diagram', 'activity diagram', 'state diagram', 'deployment diagram', 'system architecture', 'software architecture', 'microservices', 'distributed system'];
            const graphKeywords = [
                'create chart', 'make chart', 'generate chart', 'draw chart',
                'create graph', 'make graph', 'generate graph', 'draw graph', 'plot graph',
                'bar chart', 'line chart', 'pie chart', 'scatter plot', 'line graph',
                'histogram', 'bubble chart', 'area chart', 'doughnut chart',
                'data visualization', 'visualize data', 'plot data', 'chart data',
                'interactive chart', 'interactive graph', 'statistical chart',
                'mathematical graph', 'function graph', 'equation graph'
            ];

            const isWorksheetRequest = lowerQuery.includes('worksheet') || 
                                       lowerQuery.includes('work sheet') ||
                                       lowerQuery.includes('exercise sheet');

            const isPPTRequest = !isWorksheetRequest && pptKeywords.some(k => lowerQuery.includes(k));
            const isVisualRequest = !isWorksheetRequest && !isPPTRequest && (
                flowKeywords.some(k => lowerQuery.includes(k)) || 
                graphKeywords.some(k => lowerQuery.includes(k))
            );

            if (isPPTRequest) {
                const originalPrompt = CONFIG.TEACHER_PROMPT;
                CONFIG.TEACHER_PROMPT = PPTGenerator.enhancedPPTPrompt;

                try {
                    const response = await originalGetMiloResponse.call(this, query);
                    return response;
                } finally {
                    CONFIG.TEACHER_PROMPT = originalPrompt;
                }
            }

            if (isVisualRequest) {
                const originalPrompt = CONFIG.TEACHER_PROMPT;
                CONFIG.TEACHER_PROMPT = GraphCreator.enhancedPrompt;

                try {
                    const response = await originalGetMiloResponse.call(this, query);
                    return response;
                } finally {
                    CONFIG.TEACHER_PROMPT = originalPrompt;
                }
            }

            return originalGetMiloResponse.call(this, query);
        };
    },

    setupMessageHandler() {
        const originalAppendMessage = window.appendMessage;

        window.appendMessage = function(sender, message, isTyping = false) {
            if (sender === 'bot' && !isTyping) {
                // Check for PPT response first
                const pptContainer = PPTGenerator.formatPPTMessage(message);
                if (pptContainer) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message bot-message';

                    const avatar = document.createElement('div');
                    avatar.className = 'avatar bot-avatar';
                    avatar.textContent = '🤖';

                    const content = document.createElement('div');
                    content.className = 'message-content';
                    content.appendChild(pptContainer);

                    messageDiv.appendChild(avatar);
                    messageDiv.appendChild(content);

                    chatBox.appendChild(messageDiv);
                    chatBox.scrollTop = chatBox.scrollHeight;

                    return messageDiv;
                }

                // Check for graph response
                const graphContainer = GraphCreator.formatGraphMessage(message);
                if (graphContainer) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message bot-message';

                    const avatar = document.createElement('div');
                    avatar.className = 'avatar bot-avatar';
                    avatar.textContent = '🤖';

                    const content = document.createElement('div');
                    content.className = 'message-content';
                    content.appendChild(graphContainer);

                    messageDiv.appendChild(avatar);
                    messageDiv.appendChild(content);

                    chatBox.appendChild(messageDiv);
                    chatBox.scrollTop = chatBox.scrollHeight;

                    return messageDiv;
                }
            }

            return originalAppendMessage.call(this, sender, message, isTyping);
        };
    },

    injectCSS() {
        const css = `
            .graph-message-container {
                border-radius: 15px;
                padding: 1.5rem;
                margin: 1rem 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
                color: white;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }

            .ppt-message-container {
                border-radius: 15px;
                padding: 1.5rem;
                margin: 1rem 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }

            .graph-view-button {
                border: none;
                border-radius: 25px;
                padding: 12px 24px;
                font-size: 1.1rem;
                font-weight: 600;
                color: #333;
                cursor: pointer;
                margin-top: 1rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 200px;
                justify-content: center;
                background: linear-gradient(135deg, #a8edea, #fed6e3);
                box-shadow: 0 4px 15px rgba(168, 237, 234, 0.3);
                animation: contentReady 2s ease-in-out infinite;
            }

            .ppt-view-button {
                border: none;
                border-radius: 25px;
                padding: 12px 24px;
                font-size: 1.1rem;
                font-weight: 600;
                color: #333;
                cursor: pointer;
                margin-top: 1rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 250px;
                justify-content: center;
                background: linear-gradient(135deg, #ffecd2, #fcb69f);
                box-shadow: 0 4px 15px rgba(252, 182, 159, 0.3);
                animation: contentReady 2s ease-in-out infinite;
            }

            .graph-view-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(168, 237, 234, 0.4);
                background: linear-gradient(135deg, #96fbc4, #f9c5d1);
                animation: none;
            }

            .ppt-view-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(252, 182, 159, 0.4);
                background: linear-gradient(135deg, #ffd89b, #19547b);
                color: white;
                animation: none;
            }

            .graph-indicator {
                display: inline-block;
                background: rgba(0, 0, 0, 0.1);
                color: #333;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 500;
                margin-bottom: 1rem;
            }

            .ppt-indicator {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 500;
                margin-bottom: 1rem;
            }

            @keyframes contentReady {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => TeacherAssistant.init(), 1000);
    });
} else {
    setTimeout(() => TeacherAssistant.init(), 1000);
}