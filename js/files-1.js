const IMAGE_CONFIG = {
    VISION_API_KEY: 'AIzaSyCNEiD-Qt3YP6-Yp5DNqt1PAyaTW7hB3_4', 
    VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
    MAX_FILE_SIZE: 10 * 1024 * 1024, 
    SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

const imageState = {
    currentImage: null,
    isProcessing: false,
    extractedText: null,
    imageAnalysis: null
};

const imageUploadCSS = `
.input-wrapper {
    position: relative;
}

.image-upload-button {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: var(--gradient-primary);
    border: none;
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: white;
    width: 44px;
    height: 44px;
    z-index: 10;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    overflow: hidden;
}

.image-upload-button:hover {
    background: rgba(37, 99, 235, 0.08);
    color: var(--primary);
    transform: translateY(-50%) translateY(-2px);
}

.image-upload-button:hover svg {
    stroke: var(--primary);
    transform: scale(1.1);
}

.image-upload-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: translateY(-50%);
}

.image-upload-button svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-upload-button.processing {
    animation: spin 1s linear infinite;
}

.image-upload-button.processing svg {
    stroke: #3b82f6;
}

textarea {
    padding-left: 4rem !important;
}

@keyframes spin {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
}

.analysis-completed {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 8px 16px;
    margin: 1rem 0;
    color: #0369a1;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

#image-upload-input {
    display: none;
}

.upload-status {
    position: absolute;
    top: -45px;
    left: 50%;
    transform: translateX(-50%);
    background: #f0f9ff;
    color: #0369a1;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: 1000;
    border: 1px solid #0ea5e9;
    backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
    .image-upload-button {
        left: 0.5rem;
        width: 32px;
        height: 32px;
        padding: 0.5rem;
    }
    
    .image-upload-button svg {
        width: 16px;
        height: 16px;
    }
    
    textarea {
        padding-left: 3.5rem !important;
    }
}
`;

function injectImageUploadCSS() {
    const style = document.createElement('style');
    style.textContent = imageUploadCSS;
    document.head.appendChild(style);
}

function createUploadIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    
    svg.innerHTML = `
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
<polyline points="7,14 12,9 17,14"/>
<line x1="12" y1="9" x2="12" y2="21"/>

    `;
    
    return svg;
}

function createProcessingIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    
    svg.innerHTML = `
        <circle cx="12" cy="12" r="3"/>
        <path d="m12 1 0 6"/>
        <path d="m12 17 0 6"/>
        <path d="m4.2 4.2 4.2 4.2"/>
        <path d="m15.6 15.6 4.2 4.2"/>
        <path d="m1 12 6 0"/>
        <path d="m17 12 6 0"/>
        <path d="m4.2 19.8 4.2-4.2"/>
        <path d="m15.6 8.4 4.2-4.2"/>
    `;
    
    return svg;
}

function createImageUploadButton() {
    const uploadButton = document.createElement('button');
    uploadButton.className = 'image-upload-button';
    uploadButton.title = 'Upload image for AI analysis';
    uploadButton.setAttribute('aria-label', 'Upload image for AI analysis');
    
    const uploadIcon = createUploadIcon();
    uploadButton.appendChild(uploadIcon);
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'image-upload-input';
    fileInput.accept = IMAGE_CONFIG.SUPPORTED_FORMATS.join(',');
    
    uploadButton.addEventListener('click', () => {
        if (!imageState.isProcessing) {
            fileInput.click();
        }
    });
    
    fileInput.addEventListener('change', handleImageUpload);
    
    uploadButton.appendChild(fileInput);
    
    return uploadButton;
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!IMAGE_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
        showUploadStatus('Please upload a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
        return;
    }
    
    if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
        showUploadStatus('Image file is too large. Please upload an image smaller than 10MB.', 'error');
        return;
    }
    
    try {
        imageState.isProcessing = true;
        updateUploadButton();
        showUploadStatus('Analyzing image...', 'processing');
        
        const base64Image = await fileToBase64(file);
        const imageAnalysis = await analyzeImage(base64Image);
        
        imageState.extractedText = imageAnalysis.summary;
        imageState.imageAnalysis = imageAnalysis;
        imageState.currentImage = {
            file: file,
            base64: base64Image,
            analysis: imageAnalysis
        };
        
        showAnalysisCompleted();
        
    } catch (error) {
        console.error('Error processing image:', error);
        showUploadStatus('Error processing image. Please try again.', 'error');
    } finally {
        imageState.isProcessing = false;
        updateUploadButton();
        hideUploadStatus();
        event.target.value = '';
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function analyzeImage(base64Image) {
    const requestBody = {
        requests: [
            {
                image: {
                    content: base64Image
                },
                features: [
                    {
                        type: 'TEXT_DETECTION',
                        maxResults: 1
                    },
                    {
                        type: 'OBJECT_LOCALIZATION',
                        maxResults: 10
                    },
                    {
                        type: 'LABEL_DETECTION',
                        maxResults: 10
                    },
                    {
                        type: 'FACE_DETECTION',
                        maxResults: 10
                    },
                    {
                        type: 'LANDMARK_DETECTION',
                        maxResults: 10
                    },
                    {
                        type: 'LOGO_DETECTION',
                        maxResults: 10
                    },
                    {
                        type: 'IMAGE_PROPERTIES'
                    }
                ]
            }
        ]
    };
    
    const response = await fetch(`${IMAGE_CONFIG.VISION_API_URL}?key=${IMAGE_CONFIG.VISION_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Vision API error: ${response.status}`);
    }
    
    const result = await response.json();
    const analysisResult = result.responses[0];
    
    const analysis = {
        text: '',
        objects: [],
        labels: [],
        faces: [],
        landmarks: [],
        logos: [],
        colors: null,
        summary: ''
    };
    
    if (analysisResult.textAnnotations && analysisResult.textAnnotations.length > 0) {
        analysis.text = analysisResult.textAnnotations[0].description;
    }
    
    if (analysisResult.localizedObjectAnnotations) {
        analysis.objects = analysisResult.localizedObjectAnnotations.map(obj => ({
            name: obj.name,
            confidence: obj.score
        }));
    }
    
    if (analysisResult.labelAnnotations) {
        analysis.labels = analysisResult.labelAnnotations.map(label => ({
            description: label.description,
            confidence: label.score
        }));
    }
    
    if (analysisResult.faceAnnotations) {
        analysis.faces = analysisResult.faceAnnotations.map(face => ({
            joy: face.joyLikelihood,
            sorrow: face.sorrowLikelihood,
            anger: face.angerLikelihood,
            surprise: face.surpriseLikelihood
        }));
    }
    
    if (analysisResult.landmarkAnnotations) {
        analysis.landmarks = analysisResult.landmarkAnnotations.map(landmark => ({
            description: landmark.description,
            confidence: landmark.score
        }));
    }
    
    if (analysisResult.logoAnnotations) {
        analysis.logos = analysisResult.logoAnnotations.map(logo => ({
            description: logo.description,
            confidence: logo.score
        }));
    }
    
    if (analysisResult.imagePropertiesAnnotation) {
        analysis.colors = analysisResult.imagePropertiesAnnotation.dominantColors;
    }
    
    analysis.summary = createImageSummary(analysis);
    
    return analysis;
}

function createImageSummary(analysis) {
    let summary = "Image Analysis:\n\n";
    
    if (analysis.text) {
        summary += `📝 Text found: "${analysis.text.substring(0, 100)}${analysis.text.length > 100 ? '...' : ''}"\n\n`;
    }
    
    if (analysis.objects.length > 0) {
        summary += `🎯 Objects detected: ${analysis.objects.map(obj => obj.name).join(', ')}\n\n`;
    }
    
    if (analysis.labels.length > 0) {
        const topLabels = analysis.labels.slice(0, 5);
        summary += `🏷️ Content: ${topLabels.map(label => label.description).join(', ')}\n\n`;
    }
    
    if (analysis.faces.length > 0) {
        summary += `👥 ${analysis.faces.length} face(s) detected\n\n`;
    }
    
    if (analysis.landmarks.length > 0) {
        summary += `🏛️ Landmarks: ${analysis.landmarks.map(l => l.description).join(', ')}\n\n`;
    }
    
    if (analysis.logos.length > 0) {
        summary += `🔖 Logos: ${analysis.logos.map(l => l.description).join(', ')}\n\n`;
    }
    
    if (analysis.colors && analysis.colors.colors) {
        const dominantColor = analysis.colors.colors[0];
        if (dominantColor) {
            const rgb = dominantColor.color;
            summary += `🎨 Dominant color: RGB(${Math.round(rgb.red || 0)}, ${Math.round(rgb.green || 0)}, ${Math.round(rgb.blue || 0)})\n\n`;
        }
    }
    
    return summary;
}

function showUploadStatus(message, type = 'info') {
    const existingStatus = document.querySelector('.upload-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'upload-status';
    statusDiv.textContent = message;
    
    if (type === 'error') {
        statusDiv.style.background = '#fef2f2';
        statusDiv.style.color = '#dc2626';
        statusDiv.style.borderColor = '#f87171';
    } else if (type === 'processing') {
        statusDiv.style.background = '#f0f9ff';
        statusDiv.style.color = '#0369a1';
        statusDiv.style.borderColor = '#0ea5e9';
    }
    
    const inputWrapper = document.querySelector('.input-wrapper');
    if (inputWrapper) {
        inputWrapper.appendChild(statusDiv);
        
        if (type !== 'processing') {
            setTimeout(() => {
                if (statusDiv.parentElement) {
                    statusDiv.remove();
                }
            }, 3000);
        }
    }
}

function hideUploadStatus() {
    const statusDiv = document.querySelector('.upload-status');
    if (statusDiv) {
        statusDiv.remove();
    }
}

function showAnalysisCompleted() {
    const existingCompletion = document.querySelector('.analysis-completed');
    if (existingCompletion) {
        existingCompletion.remove();
    }
    
    const completionMessage = document.createElement('div');
    completionMessage.className = 'analysis-completed';
    completionMessage.innerHTML = '✅ Done! You can ask questions';
    
    const inputWrapper = document.querySelector('.input-wrapper');
    if (inputWrapper) {
        inputWrapper.appendChild(completionMessage);
        
        setTimeout(() => {
            if (completionMessage.parentElement) {
                completionMessage.remove();
            }
        }, 5000);
    }
}

function updateUploadButton() {
    const uploadButton = document.querySelector('.image-upload-button');
    if (uploadButton) {
        const existingIcon = uploadButton.querySelector('svg');
        if (existingIcon) {
            existingIcon.remove();
        }
        
        if (imageState.isProcessing) {
            uploadButton.classList.add('processing');
            uploadButton.disabled = true;
            uploadButton.title = 'Analyzing image...';
            
            const processingIcon = createProcessingIcon();
            uploadButton.insertBefore(processingIcon, uploadButton.firstChild);
        } else {
            uploadButton.classList.remove('processing');
            uploadButton.disabled = false;
            uploadButton.title = 'Upload image for AI analysis';
            
            const uploadIcon = createUploadIcon();
            uploadButton.insertBefore(uploadIcon, uploadButton.firstChild);
        }
    }
}

function enhancedGetMiloResponse(query) {
    return new Promise(async (resolve, reject) => {
        try {
            if (imageState.imageAnalysis) {
                const analysis = imageState.imageAnalysis;
                
                let contextMessage = `Based on the following image analysis:\n\n`;
                
                if (analysis.text) {
                    contextMessage += `Text in image: "${analysis.text}"\n\n`;
                }
                
                if (analysis.objects.length > 0) {
                    contextMessage += `Objects detected: ${analysis.objects.map(obj => `${obj.name} (${(obj.confidence * 100).toFixed(1)}%)`).join(', ')}\n\n`;
                }
                
                if (analysis.labels.length > 0) {
                    contextMessage += `Image content: ${analysis.labels.map(label => `${label.description} (${(label.confidence * 100).toFixed(1)}%)`).join(', ')}\n\n`;
                }
                
                if (analysis.faces.length > 0) {
                    contextMessage += `${analysis.faces.length} face(s) detected in the image\n\n`;
                }
                
                if (analysis.landmarks.length > 0) {
                    contextMessage += `Landmarks: ${analysis.landmarks.map(l => l.description).join(', ')}\n\n`;
                }
                
                if (analysis.logos.length > 0) {
                    contextMessage += `Logos/Brands: ${analysis.logos.map(l => l.description).join(', ')}\n\n`;
                }
                
                contextMessage += `User question: ${query}`;
                
                const response = await window.originalGetMiloResponse(contextMessage);
                resolve(response);
            } else {
                const response = await window.originalGetMiloResponse(query);
                resolve(response);
            }
        } catch (error) {
            reject(error);
        }
    });
}

function setupEnhancedTextHandling() {
    if (window.getMiloResponse) {
        window.originalGetMiloResponse = window.getMiloResponse;
        window.getMiloResponse = enhancedGetMiloResponse;
    }
}

function initializeImageTextExtraction() {
    injectImageUploadCSS();
    
    const inputWrapper = document.querySelector('.input-wrapper');
    
    if (inputWrapper) {
        const uploadButton = createImageUploadButton();
        inputWrapper.appendChild(uploadButton);
    } else {
        console.warn('Input wrapper not found. Upload button not added.');
    }
    
    setupEnhancedTextHandling();
    
    console.log('Image text extraction functionality initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImageTextExtraction);
} else {
    setTimeout(initializeImageTextExtraction, 1000);
}