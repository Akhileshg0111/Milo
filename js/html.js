


function isHTMLCode(code, lang) {
    const htmlIndicators = [
        '<html>', '<head>', '<body>', '<!DOCTYPE', '<style>', '<script>',
        '<div>', '<p>', '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>',
        '<span>', '<section>', '<article>', '<nav>', '<header>', '<footer>'
    ];
    
    const codeUpper = code.toUpperCase();
    const langLower = (lang || '').toLowerCase();
    

    if (langLower === 'html' || langLower === 'htm') {
        return true;
    }
    

    return htmlIndicators.some(indicator => codeUpper.includes(indicator.toUpperCase()));
}


function openHTMLInPopup(htmlCode) {

    const popup = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,status=no');
    
    if (popup) {

        let completeHTML = htmlCode.trim();
        

        if (!completeHTML.toUpperCase().includes('<!DOCTYPE') && !completeHTML.toUpperCase().startsWith('<HTML')) {
            completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Preview</title>
</head>
<body>
    ${completeHTML}
</body>
</html>`;
        }
        

        popup.document.open();
        popup.document.write(completeHTML);
        popup.document.close();
        

        popup.addEventListener('load', () => {
            console.log('HTML popup loaded successfully');
        });
        

        popup.focus();
        
        return "HTML code opened in new window! Check your popup window.";
    } else {
        throw new Error("Popup blocked! Please allow popups for this site and try again.");
    }
}


async function runCodeWithPiston(code, lang) {

    if (isHTMLCode(code, lang)) {
        return openHTMLInPopup(code);
    }
    

    const langMap = {
        javascript: "javascript",
        python: "python3",
        cpp: "cpp",
        java: "java",
        c: "c",
        ruby: "ruby",
        php: "php",
        go: "go",
        rust: "rust",
        typescript: "typescript"
    };

    const pistonLang = langMap[lang.toLowerCase()] || lang.toLowerCase();

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            language: pistonLang,
            version: "*",
            files: [{ name: "main", content: code }],
            stdin: "",
            args: [],
            compile_timeout: 10000,
            run_timeout: 3000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Piston API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const output = result.run?.output || result.compile?.output || "No output.";
    return output;
}


setTimeout(() => {
    document.querySelectorAll('.run-code-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const code = decodeURIComponent(button.dataset.code);
            const lang = button.dataset.lang;

            const outputDiv = button.nextElementSibling;
            outputDiv.style.display = 'block';
            

            if (isHTMLCode(code, lang)) {
                outputDiv.innerHTML = '🌐 Opening HTML in new window...';
            } else {
                outputDiv.innerHTML = '⏳ Running...';
            }

            try {
                const result = await runCodeWithPiston(code, lang);
                
                if (isHTMLCode(code, lang)) {
                    outputDiv.innerHTML = `<div style="color: #28a745; font-weight: bold;">✅ ${result}</div>`;
                } else {
                    outputDiv.innerHTML = `<pre><strong>Output:</strong>\n${escapeHtml(result)}</pre>`;
                }
            } catch (err) {
                outputDiv.innerHTML = `<pre><strong>Error:</strong> ${escapeHtml(err.message)}</pre>`;
            }
        });
    });
}, 300);