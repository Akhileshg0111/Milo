const AUTH_CONFIG = {
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyAuOpPpLvlsfLKNF_KIm8uyW3xWWNIywgo",
        authDomain: "milo-ai-1.firebaseapp.com",
        projectId: "milo-ai-1",
        storageBucket: "milo-ai-1.firebasestorage.app",
        messagingSenderId: "269383634736",
        appId: "1:269383634736:web:1953ddca192b0ccc3942f5"
    }
};

const authState = {
    user: null,
    isAuthenticated: false,
    chatSessions: [],
    currentSessionId: null,
    sidebarOpen: false
};

let auth, db;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(AUTH_CONFIG.FIREBASE_CONFIG);
        }
        auth = firebase.auth();
        db = firebase.firestore();
        
        auth.onAuthStateChanged(handleAuthStateChange);
    } else {
        console.warn('Firebase not loaded. Please include Firebase SDK in your HTML.');
    }
}

function handleAuthStateChange(user) {
    if (user) {
        authState.user = user;
        authState.isAuthenticated = true;
        showChatInterface();
        loadUserChatHistory();
        updateUserProfile();
        
        setTimeout(() => {
            cleanupExistingChatSessions();
        }, 2000);
    } else {
        authState.user = null;
        authState.isAuthenticated = false;
        showLoginScreen();
    }
}

function createAuthElements() {
    const loginOverlay = document.createElement('div');
    loginOverlay.id = 'auth-overlay';
    loginOverlay.innerHTML = `
        <div class="floating-prompts">
            <div class="prompt-bubble prompt-1">Create lesson plans instantly</div>
            <div class="prompt-bubble prompt-2">Generate quiz questions</div>
            <div class="prompt-bubble prompt-3">Explain complex topics</div>
            <div class="prompt-bubble prompt-4">Grade assignments faster</div>
            <div class="prompt-bubble prompt-5">Get teaching ideas</div>
            <div class="prompt-bubble prompt-6">Simplify curriculum</div>
        </div>
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <div class="logo-container">
                        <div class="logo-icon">🎓</div>
                        <div class="logo-text">
                            <h1>Milo AI</h1>
                            <p>Your Intelligent Assistant</p>
                        </div>
                    </div>
                </div>
                <div class="auth-content">
                    <div class="welcome-section">
                        <h2>Welcome Back!</h2>
                        <p>Transform your teaching experience with AI-powered assistance</p>
                    </div>
                    
                    <div class="features-grid">
                        <div class="feature-item">
                            <div class="feature-icon">📚</div>
                            <span>Lesson Planning</span>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✏️</div>
                            <span>Assignment Help</span>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">💡</div>
                            <span>Creative Ideas</span>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📊</div>
                            <span>Story Creation</span>
                        </div>
                    </div>
                    
                    <button id="google-signin-btn" class="google-signin-btn">
                        <div class="btn-content">
                            <svg width="24" height="24" viewBox="0 0 24 24" class="google-icon">
                                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </div>
                        <div class="btn-glow"></div>
                    </button>
                    
                    <div class="auth-footer">
                        <p>Signin and explore wide range of tools and features</p>
                        <div class="trust-indicators">
                            <div class="trust-item">
                                <span class="trust-icon">🔒</span>
                                <span>Secure</span>
                            </div>
                            <div class="trust-item">
                                <span class="trust-icon">⚡</span>
                                <span>Fast</span>
                            </div>
                            <div class="trust-item">
                                <span class="trust-icon">🎯</span>
                                <span>Accurate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

const sidebar = document.createElement('div');
sidebar.id = 'chat-sidebar';
sidebar.innerHTML = `
    <div class="sidebar-header">
        <div class="sidebar-brand">
            <div class="brand-icon">💬</div>
            <div class="brand-text">
                <h2>Chat History</h2>
                <p>Manage your conversations</p>
            </div>
        </div>
        <button class="sidebar-close" id="sidebar-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
    
    <div class="sidebar-content">
        <div class="user-profile-section">
            <div class="user-profile-card">
                <div class="user-avatar" id="user-avatar"></div>
                <div class="user-info">
                    <div class="user-name" id="user-name">Loading...</div>
                    <div class="user-email" id="user-email">Loading...</div>
                </div>
            </div>
        </div>
   <button
  id="attendance-button"
  style="width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
         color: white; border: none; padding: 18px 24px; border-radius: 16px; font-weight: 600;
         font-size: 15px; cursor: pointer; transition: all 0.3s ease; display: flex;
         align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px;
         box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);"
  onclick="window.open('attendance.html', 'attendancePopup', 'width=1200,height=1000,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no')"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" style="flex-shrink: 0;"
       xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
  Attendance
</button>

        <div class="new-chat-section">
            <button class="new-chat-btn" id="new-chat-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Start New Chat
            </button>
        </div>
        
        <div class="chat-sessions-section">
            <div class="section-header">
                <h3>Recent Conversations</h3>
                <span class="chat-count" id="chat-count">0</span>
            </div>
            <div class="chat-sessions-container">
                <div class="chat-sessions" id="all-sessions"></div>
            </div>
        </div>
    </div>
    
    <div class="sidebar-footer">
        <button class="logout-btn" id="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
        </button>
    </div>
`;

    const sidebarToggle = document.createElement('button');
    sidebarToggle.id = 'sidebar-toggle';
    sidebarToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    `;
    sidebarToggle.className = 'sidebar-toggle';

    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.id = 'sidebar-overlay';
    sidebarOverlay.className = 'sidebar-overlay';

    document.body.appendChild(loginOverlay);
    document.body.appendChild(sidebar);
    document.body.appendChild(sidebarToggle);
    document.body.appendChild(sidebarOverlay);
}

function injectAuthStyles() {
    const authStyles = `
    * {
            box-sizing: border-box;
        }

        #auth-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #e0f2fe 70%, #bbdefb 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.6s ease;
            overflow: hidden;
        }

        #auth-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .floating-prompts {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        }

        .prompt-bubble {
            position: absolute;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 25px;
            padding: 12px 20px;
            color: #1976d2;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            animation: float 20s infinite linear;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .prompt-1 {
            top: 10%;
            left: -200px;
            animation-delay: 0s;
        }

        .prompt-2 {
            top: 25%;
            right: -250px;
            animation-delay: -3s;
            animation-direction: reverse;
        }

        .prompt-3 {
            top: 40%;
            left: -180px;
            animation-delay: -6s;
        }

        .prompt-4 {
            top: 55%;
            right: -220px;
            animation-delay: -9s;
            animation-direction: reverse;
        }

        .prompt-5 {
            top: 70%;
            left: -190px;
            animation-delay: -12s;
        }

        .prompt-6 {
            top: 85%;
            right: -210px;
            animation-delay: -15s;
            animation-direction: reverse;
        }

        @keyframes float {
            0% {
                transform: translateX(0) translateY(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateX(100vw) translateY(-20px);
                opacity: 0;
            }
        }

        .auth-container {
            max-width: 480px;
            width: 90%;
            padding: 20px;
            z-index: 2;
        }

        .auth-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 32px;
            padding: 0;
            text-align: center;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transform: translateY(30px);
            transition: all 0.6s ease;
            overflow: hidden;
        }

        #auth-overlay.show .auth-card {
            transform: translateY(0);
        }

        .auth-header {
            background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
            padding: 40px 32px;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .auth-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        }

        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            position: relative;
            z-index: 1;
        }

        .logo-icon {
            font-size: 64px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }

        .logo-text h1 {
            margin: 0;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: -1px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .logo-text p {
            margin: 8px 0 0 0;
            font-size: 16px;
            font-weight: 500;
            opacity: 0.9;
        }

        .auth-content {
            padding: 48px 32px;
        }

        .welcome-section {
            margin-bottom: 40px;
        }

        .welcome-section h2 {
            color: #1a1a1a;
            margin: 0 0 16px 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .welcome-section p {
            color: #6b7280;
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }

        .feature-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border-color: #1976d2;
        }

        .feature-icon {
            font-size: 20px;
        }

        .feature-item span {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
        }

        .google-signin-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0;
            border: none;
            border-radius: 16px;
            background: linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 100%);
            color: white;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.4s ease;
            box-shadow: 0 12px 24px rgba(66, 133, 244, 0.3);
            margin-bottom: 32px;
            overflow: hidden;
        }

        .btn-content {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px 32px;
            position: relative;
            z-index: 2;
            width: 100%;
            justify-content: center;
        }

        .btn-glow {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .google-signin-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 32px rgba(66, 133, 244, 0.2);
        }

        .google-signin-btn:hover .btn-glow {
            left: 100%;
        }

        .google-signin-btn:active {
            transform: translateY(-1px);
        }

        .google-icon {
            background: white;
            border-radius: 8px;
            padding: 4px;
        }

        .auth-footer {
            text-align: center;
        }

        .auth-footer p {
            color: #6b7280;
            margin: 0 0 24px 0;
            font-size: 14px;
        }

        .trust-indicators {
            display: flex;
            justify-content: center;
            gap: 32px;
        }

        .trust-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #374151;
            font-size: 14px;
            font-weight: 600;
        }

        .trust-icon {
            font-size: 16px;
        }

        @media (max-width: 640px) {
            .auth-container {
                width: 95%;
                padding: 15px;
            }

            .auth-card {
                border-radius: 24px;
            }

            .auth-header {
                padding: 32px 24px;
            }

            .logo-container {
                flex-direction: column;
                gap: 16px;
            }

            .logo-icon {
                font-size: 48px;
            }

            .logo-text h1 {
                font-size: 28px;
            }

            .auth-content {
                padding: 32px 24px;
            }

            .features-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .trust-indicators {
                gap: 20px;
            }

            .prompt-bubble {
                font-size: 12px;
                padding: 8px 16px;
            }
        }


#chat-sidebar {
    position: fixed;
    top: 0;
    left: -450px;
    width: 450px;
    height: 100%;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
    border-right: 1px solid #e2e8f0;
    z-index: 1000;
    transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
}

#chat-sidebar.open {
    left: 0;
}


.sidebar-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 999;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border: none;
    color: white;
    cursor: pointer;
    padding: 14px;
    border-radius: 16px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.sidebar-toggle.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.sidebar-toggle:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
}

.sidebar-toggle:active {
    transform: translateY(0);
}

.sidebar-toggle svg {
    width: 22px;
    height: 22px;
    stroke-width: 2.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .sidebar-toggle {
        top: 15px;
        left: 15px;
        padding: 12px;
    }
    
    .sidebar-toggle svg {
        width: 20px;
        height: 20px;
    }
}

@media (max-width: 480px) {
    .sidebar-toggle {
        top: 12px;
        left: 12px;
        padding: 10px;
    }
    
    .sidebar-toggle svg {
        width: 18px;
        height: 18px;
    }
}


.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
}

.sidebar-overlay.show {
    opacity: 1;
    visibility: visible;
}
.sidebar-header {
    padding: 24px 20px;
    background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 90px;
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.brand-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.brand-text h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1e40af;
    letter-spacing: -0.5px;
}

.brand-text p {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #3b82f6;
    opacity: 0.8;
}

.sidebar-close {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e8f0;
    color: #3b82f6;
    cursor: pointer;
    padding: 10px;
    border-radius: 12px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}
.sidebar-close:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #3b82f6;
    transform: scale(1.05);
}

.sidebar-content {
    flex: 1;
    padding: 24px 20px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #f8d7da transparent;
}

.sidebar-content::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
    background: #3b82f6;
}

.user-profile-section {
    margin-bottom: 24px;
}

.user-profile-card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

/* Replace the existing .user-avatar styles with this */
.user-avatar {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    color: white;
    background-size: cover;
    background-position: center;
    border: 3px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
}
.user-info {
    flex: 1;
    min-width: 0;
}

.user-name {
    font-weight: 700;
    font-size: 16px;
    color: #1e40af;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-email {
    font-size: 13px;
    color: #3b82f6;
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.new-chat-section {
    margin-bottom: 28px;
}

.new-chat-btn {
    width: 100%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 18px 24px;
    border-radius: 16px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.new-chat-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4)
}

.new-chat-btn:active {
    transform: translateY(0);
}

.chat-sessions-section {
    flex: 1;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
}

.section-header h3 {
    color: #1e40af;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.3px;
}
.chat-count {
    background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
    color: #1d4ed8;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid #bfdbfe;
}

.chat-sessions-container {
    max-height: 400px;
    overflow-y: auto;
}

.chat-sessions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chat-session {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.chat-session::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: transparent;
    transition: all 0.3s ease;
}

.chat-session:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #3b82f6;
    transform: translateX(4px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
}

.chat-session:hover::before {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.chat-session.active {
    background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
    border-color: #3b82f6;
    transform: none;
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
}

.chat-session.active::before {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.chat-session-content {
    flex: 1;
    min-width: 0;
}

.session-title {
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.session-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.session-date {
    color: #3b82f6;
    font-size: 12px;
    font-weight: 500;
}

.session-message-count {
    background: #f0f9ff;
    color: #1d4ed8;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid #bfdbfe;
}

.chat-session.active .session-message-count {
    background: rgba(255, 255, 255, 0.9);
    color: #1e40af;
    border-color: #3b82f6;
}

.session-preview {
    color: #64748b;
    font-size: 12px;
    line-height: 1.4;
    opacity: 0.9;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.session-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transition: all 0.3s ease;
}

.chat-session:hover .session-actions {
    opacity: 1;
}

.delete-session-btn {
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #dc2626;
    cursor: pointer;
    padding: 8px;
    border-radius: 10px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
}

.delete-session-btn:hover {
    background: #fca5a5;
    border-color: #f87171;
    transform: scale(1.1);
}

.delete-session-btn:active {
    transform: scale(0.95);
}

.sidebar-footer {
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-top: 1px solid #e2e8f0;
    backdrop-filter: blur(10px);
}

.logout-btn {
    width: 100%;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    padding: 16px 20px;
    border-radius: 16px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
}

.logout-btn:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.4);
}

.logout-btn:active {
    transform: translateY(0);
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #64748b;
}

.empty-state-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-state-text {
    font-size: 14px;
    font-weight: 500;
}

@media (max-width: 768px) {
    #chat-sidebar {
        width: 350px;
        left: -350px;
    }
}

@media (max-width: 480px) {
    #chat-sidebar {
        width: 100%;
        left: -100%;
    }
    
    .sidebar-header {
        padding: 20px 16px;
        min-height: 80px;
    }
    
    .brand-icon {
        width: 44px;
        height: 44px;
        font-size: 20px;
    }
    
    .brand-text h2 {
        font-size: 18px;
    }
    
    .user-profile-card {
        padding: 16px;
    }
    
    .user-avatar {
        width: 48px;
        height: 48px;
        font-size: 20px;
    }
}`;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = authStyles;
    document.head.appendChild(styleSheet);
}

function showLoginScreen() {
    const overlay = document.getElementById('auth-overlay');
    const toggle = document.getElementById('sidebar-toggle');
    
    if (overlay) overlay.classList.add('show');
    if (toggle) toggle.classList.remove('show');
}

function showChatInterface() {
    const overlay = document.getElementById('auth-overlay');
    const toggle = document.getElementById('sidebar-toggle');
    
    if (overlay) overlay.classList.remove('show');
    if (toggle) toggle.classList.add('show');
}

function updateUserProfile() {
    if (!authState.user) return;

    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');

    if (userAvatar) {
        if (authState.user.photoURL) {
            userAvatar.style.backgroundImage = `url(${authState.user.photoURL})`;
        } else {
            userAvatar.textContent = authState.user.displayName ? authState.user.displayName.charAt(0).toUpperCase() : '👤';
        }
    }

    if (userName) {
        userName.textContent = authState.user.displayName || 'Teacher';
    }

    if (userEmail) {
        userEmail.textContent = authState.user.email || '';
    }
}

async function signInWithGoogle() {
    if (!auth) {
        console.error('Firebase auth not initialized');
        return;
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await auth.signInWithPopup(provider);
        console.log('Signed in successfully:', result.user);
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Error signing in. Please try again.');
    }
}

async function signOut() {
    if (!auth) return;
    
    try {
        await auth.signOut();
        authState.chatSessions = [];
        authState.currentSessionId = null;
        clearChatHistory();
        closeSidebar();
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

function clearChatHistory() {

    window.isLoadingOldMessages = false;
    
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.innerHTML = '';
    }
    
    if (typeof state !== 'undefined') {
        state.chatHistory = [];
        state.conversationHistory = [];
        state.contextMemory = [];
        state.initialized = false;
    }
}

async function createNewChatSession() {
    const sessionId = Date.now().toString();
    const newSession = {
        id: sessionId,
        title: 'New Chat',
        date: new Date().toISOString(),
        messages: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    authState.chatSessions.unshift(newSession);
    authState.currentSessionId = sessionId;
    
    clearChatHistory();
    await saveSessionToFirestore(newSession);
    renderChatSessions();
    
    if (typeof displayWelcomeMessage === 'function') {
        setTimeout(displayWelcomeMessage, 500);
    }
}

async function loadChatSession(sessionId) {
    try {
        const session = await loadSessionFromFirestore(sessionId);
        if (!session) return;
        
        authState.currentSessionId = sessionId;
        clearChatHistory();
        
        window.isLoadingOldMessages = true;
        
        // Modified filter: Only keep worksheets and preserve their format
        const cleanMessages = session.messages.filter(msg => {
            // Keep user messages as they are
            if (msg.sender === 'user') return true;
            
            // For bot messages, only keep worksheets
            if (msg.sender === 'bot') {
                const content = msg.content.toLowerCase();
                // Check if it's a worksheet (common worksheet indicators)
                const isWorksheet = content.includes('worksheet') || 
                                  content.includes('practice sheet') ||
                                  content.includes('exercise sheet') ||
                                  content.includes('activity sheet') ||
                                  content.includes('assignment') ||
                                  content.includes('questions:') ||
                                  content.includes('problems:') ||
                                  (content.includes('name:') && content.includes('date:')) ||
                                  content.includes('fill in the blank') ||
                                  content.includes('match the following') ||
                                  content.includes('answer the questions');
                
                return isWorksheet;
            }
            return false;
        });

        cleanMessages.forEach(msg => {
            if (typeof appendMessage === 'function') {
                // Preserve original format for worksheets - no cleaning
                appendMessage(msg.sender, msg.content);
            }
        });
        
        setTimeout(() => {
            window.isLoadingOldMessages = false;
        }, 100);
        
        if (typeof state !== 'undefined') {
            state.chatHistory = cleanMessages.filter(msg => msg.sender === 'user').map(msg => ({
                message: msg.content,
                response: cleanMessages.find(m => m.sender === 'bot' && m.timestamp > msg.timestamp)?.content || '',
                responseTime: 0
            }));
            
            state.conversationHistory = cleanMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                text: msg.content
            }));
            
            state.contextMemory = [...state.conversationHistory];
        }
        
        renderChatSessions();
        closeSidebar();
    } catch (error) {
        console.error('Error loading chat session:', error);
    }
}

async function loadUserChatHistory() {
    if (!authState.user || !db) return;
    
    try {
        const sessionsSnapshot = await db.collection('users')
            .doc(authState.user.uid)
            .collection('chatSessions')
            .orderBy('updatedAt', 'desc')
            .get();
        
        authState.chatSessions = sessionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
        }));
        
        if (authState.chatSessions.length === 0) {
            await createNewChatSession();
        } else {
            authState.currentSessionId = authState.chatSessions[0].id;
        }
        
        renderChatSessions();
    } catch (error) {
        console.error('Error loading chat history:', error);
        await createNewChatSession();
    }
}

async function saveSessionToFirestore(session) {
    if (!authState.user || !db) return;
    
    try {
        await db.collection('users')
            .doc(authState.user.uid)
            .collection('chatSessions')
            .doc(session.id)
            .set({
                ...session,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
    } catch (error) {
        console.error('Error saving session:', error);
    }
}

async function loadSessionFromFirestore(sessionId) {
    if (!authState.user || !db) return null;
    
    try {
        const sessionDoc = await db.collection('users')
            .doc(authState.user.uid)
            .collection('chatSessions')
            .doc(sessionId)
            .get();
        
        if (sessionDoc.exists) {
            return {
                id: sessionDoc.id,
                ...sessionDoc.data(),
                date: sessionDoc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
            };
        }
        return null;
    } catch (error) {
        console.error('Error loading session:', error);
        return null;
    }
}

async function updateSessionInFirestore(sessionId, updates) {
    if (!authState.user || !db) return;
    
    try {
        await db.collection('users')
            .doc(authState.user.uid)
            .collection('chatSessions')
            .doc(sessionId)
            .update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Error updating session:', error);
    }
}

async function deleteSessionFromFirestore(sessionId) {
    if (!authState.user || !db) return;
    
    try {
        await db.collection('users')
            .doc(authState.user.uid)
            .collection('chatSessions')
            .doc(sessionId)
            .delete();
    } catch (error) {
        console.error('Error deleting session:', error);
    }
}

function renderChatSessions() {
    const allSessions = document.getElementById('all-sessions');
    const chatCount = document.getElementById('chat-count');
    
    if (!allSessions || !chatCount) return;
    
    chatCount.textContent = authState.chatSessions.length;
    
    if (authState.chatSessions.length === 0) {
        allSessions.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <div class="empty-state-text">No chats yet. Start a new conversation!</div>
            </div>
        `;
        return;
    }
    
    allSessions.innerHTML = authState.chatSessions.map(session => createSessionElement(session)).join('');
}
function extractBotMessageContent(botMessage) {
    const messageText = botMessage.querySelector('.message-text') || 
                      botMessage.querySelector('.bot-response') || 
                      botMessage.querySelector('.message-content') ||
                      botMessage;
    
    let content = messageText.innerHTML || messageText.innerText || messageText.textContent || '';
    

    const isWorksheet = content.toLowerCase().includes('worksheet') || 
                       content.toLowerCase().includes('practice sheet') ||
                       content.toLowerCase().includes('exercise sheet') ||
                       content.toLowerCase().includes('activity sheet') ||
                       content.toLowerCase().includes('assignment') ||
                       content.toLowerCase().includes('questions:') ||
                       content.toLowerCase().includes('problems:') ||
                       (content.toLowerCase().includes('name:') && content.toLowerCase().includes('date:')) ||
                       content.toLowerCase().includes('fill in the blank') ||
                       content.toLowerCase().includes('match the following') ||
                       content.toLowerCase().includes('answer the questions');
    
    if (isWorksheet) {
        return content;
    }
    
    return '';
}
async function cleanupExistingChatSessions() {
    if (!authState.user || !db) return;
    
    try {
        const sessionsSnapshot = await db.collection('users')
            .doc(authState.user.uid)
            .collection('chatSessions')
            .get();
        
        const cleanupPromises = sessionsSnapshot.docs.map(async (doc) => {
            const sessionData = doc.data();
            if (sessionData.messages) {

                const cleanedMessages = sessionData.messages.filter(msg => {
                    if (msg.sender === 'user') return true;
                    
                    if (msg.sender === 'bot') {
                        const content = msg.content.toLowerCase();
                        return content.includes('worksheet') || 
                               content.includes('practice sheet') ||
                               content.includes('exercise sheet') ||
                               content.includes('activity sheet') ||
                               content.includes('assignment') ||
                               content.includes('questions:') ||
                               content.includes('problems:') ||
                               (content.includes('name:') && content.includes('date:')) ||
                               content.includes('fill in the blank') ||
                               content.includes('match the following') ||
                               content.includes('answer the questions');
                    }
                    return false;
                }).map(msg => ({
                    ...msg,

                    content: msg.sender === 'bot' ? msg.content : cleanUserInput(msg.content)
                }));
                

                if (cleanedMessages.length !== sessionData.messages.length) {
                    await doc.ref.update({
                        messages: cleanedMessages,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
        });
        
        await Promise.all(cleanupPromises);
        console.log('Chat sessions cleaned up - only worksheets preserved');
    } catch (error) {
        console.error('Error cleaning up chat sessions:', error);
    }
}
function isWorksheetContent(content) {
    const lowerContent = content.toLowerCase();
    const worksheetIndicators = [
        'worksheet',
        'practice sheet',
        'exercise sheet', 
        'activity sheet',
        'assignment',
        'questions:',
        'problems:',
        'fill in the blank',
        'match the following',
        'answer the questions',
        'complete the sentences',
        'circle the correct',
        'true or false',
        'multiple choice'
    ];
    

    const hasWorksheetIndicator = worksheetIndicators.some(indicator => 
        lowerContent.includes(indicator)
    );
    
    const hasWorksheetStructure = (lowerContent.includes('name:') && lowerContent.includes('date:')) ||
                                 lowerContent.includes('grade:') ||
                                 lowerContent.includes('class:');
    
    return hasWorksheetIndicator || hasWorksheetStructure;
}
function cleanUserInput(userMessage) {
    let cleanMessage = userMessage.replace(/<[^>]*>/g, '');
    cleanMessage = cleanMessage.replace(/\s+/g, ' ').trim();
    
    return cleanMessage;
}
function createSessionElement(session) {
    const isActive = session.id === authState.currentSessionId;
    const date = new Date(session.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Count only worksheet messages
    const worksheetCount = session.messages ? 
        session.messages.filter(msg => 
            msg.sender === 'bot' && isWorksheetContent(msg.content)
        ).length : 0;
    
    const preview = session.messages && session.messages.length > 0 ? 
        session.messages.find(msg => msg.sender === 'bot' && isWorksheetContent(msg.content))?.content.substring(0, 80) + '...' || 'No worksheets yet' : 
        'No worksheets yet';
    
    return `
        <div class="chat-session ${isActive ? 'active' : ''}" data-session-id="${session.id}">
            <div class="chat-session-content" onclick="loadChatSession('${session.id}')">
                <div class="session-title">${session.title}</div>
                <div class="session-meta">
                    <span class="session-date">${date}</span>
                    <span class="session-message-count">${worksheetCount} worksheets</span>
                </div>
                <div class="session-preview">${preview}</div>
            </div>
            <div class="session-actions">
                <button class="delete-session-btn" onclick="deleteSession('${session.id}')" title="Delete conversation">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6V20a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

async function deleteSession(sessionId) {
    if (window.deletingSession) {
        return;
    }
    
    window.deletingSession = true;
    
    try {
        if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
            return;
        }
        
        authState.chatSessions = authState.chatSessions.filter(session => session.id !== sessionId);
        

        if (authState.currentSessionId === sessionId) {
            if (authState.chatSessions.length > 0) {
                authState.currentSessionId = authState.chatSessions[0].id;
                await loadChatSession(authState.currentSessionId);
            } else {
                await createNewChatSession();
            }
        }
        
        await deleteSessionFromFirestore(sessionId);
        
        renderChatSessions();
        
    } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete conversation. Please try again.');
    } finally {

        setTimeout(() => {
            window.deletingSession = false;
        }, 100);
    }
}
function toggleSidebar() {
    const sidebar = document.getElementById('chat-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        authState.sidebarOpen = !authState.sidebarOpen;
        sidebar.classList.toggle('open', authState.sidebarOpen);
        overlay.classList.toggle('show', authState.sidebarOpen);
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('chat-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        authState.sidebarOpen = false;
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }
}
function setupAuthEventListeners() {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'google-signin-btn' || e.target.closest('#google-signin-btn')) {
            signInWithGoogle();
        } else if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
            signOut();
        } else if (e.target.id === 'sidebar-toggle' || e.target.closest('#sidebar-toggle')) {
            toggleSidebar();
        } else if (e.target.id === 'sidebar-close' || e.target.closest('#sidebar-close')) {
            closeSidebar();
        } else if (e.target.id === 'new-chat-btn' || e.target.closest('#new-chat-btn')) {
            createNewChatSession();
            closeSidebar();
        } else if (e.target.id === 'sidebar-overlay') {
            closeSidebar();
        } else if (e.target.closest('.delete-session-btn')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); 
            const sessionId = e.target.closest('.chat-session').dataset.sessionId;
            deleteSession(sessionId);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authState.sidebarOpen) {
            closeSidebar();
        }
    });
}


window.deleteSession = deleteSession;



function hookIntoMessageSending() {
    if (typeof handleSendMessage === 'function') {
        const originalHandleSendMessage = handleSendMessage;
        
        window.handleSendMessage = async function() {
            const userInput = document.getElementById('user-input');
            const userMessage = userInput ? userInput.value.trim() : '';
            
            const result = await originalHandleSendMessage.apply(this, arguments);
            
            if (authState.currentSessionId && authState.user && userMessage) {
                const session = authState.chatSessions.find(s => s.id === authState.currentSessionId);
                if (session) {

                    const cleanedMessage = cleanUserInput(userMessage);
                    
                    const message = {
                        sender: 'user',
                        content: cleanedMessage,
                        timestamp: Date.now()
                    };
                    
                    session.messages.push(message);
                    
                    if (session.messages.length === 1) {
                        session.title = cleanedMessage.substring(0, 60) + (cleanedMessage.length > 60 ? '...' : '');
                        await updateSessionInFirestore(session.id, { 
                            title: session.title,
                            messages: session.messages
                        });
                    } else {
                        await updateSessionInFirestore(session.id, { 
                            messages: session.messages
                        });
                    }
                    
                    renderChatSessions();
                }
            }
            
            return result;
        };
    }

    const observer = new MutationObserver((mutations) => {
        if (window.isLoadingOldMessages) {
            return;
        }
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.classList?.contains('bot-message') || 
                         node.querySelector?.('.bot-message'))) {
                        
                        const botMessage = node.classList?.contains('bot-message') ? 
                            node : node.querySelector('.bot-message');
                        
                        if (botMessage && authState.currentSessionId && authState.user) {
                            const session = authState.chatSessions.find(s => s.id === authState.currentSessionId);
                            if (session) {

                                const messageContent = extractBotMessageContent(botMessage);
                                

                                if (messageContent.length > 0 && 
                                    !messageContent.includes('function') && 
                                    !messageContent.includes('<!DOCTYPE') &&
                                    !messageContent.includes('<html') &&
                                    messageContent.length < 5000) { 
                                    
                                    const message = {
                                        sender: 'bot',
                                        content: messageContent,
                                        timestamp: Date.now()
                                    };
                                    
                                    session.messages.push(message);
                                    updateSessionInFirestore(session.id, { 
                                        messages: session.messages
                                    });
                                    renderChatSessions();
                                }
                            }
                        }
                    }
                });
            }
        });
    });

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        observer.observe(chatBox, {
            childList: true,
            subtree: true
        });
    }
}

function initializeAuthSystem() {
    createAuthElements();
    injectAuthStyles();
    setupAuthEventListeners();
    
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
    } else {
        console.warn('Firebase not loaded. Please include Firebase SDK scripts in your HTML.');
        showLoginScreen();
    }
    
    setTimeout(hookIntoMessageSending, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthSystem);
} else {
    initializeAuthSystem();
}

window.initializeAuthSystem = initializeAuthSystem;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;