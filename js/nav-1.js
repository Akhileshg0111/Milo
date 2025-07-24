(function() {
    'use strict';
    
    const TOOLS_CONFIG = {
        menuItems: [
            { name: 'Reminders', action: 'reminder', icon: 'bell' },
            { name: 'Game Generation', url: 'tools/games.html', icon: 'gamepad' },
            { name: 'NLP Sql', url: 'tools/sql-cmd.html', icon: 'sql' },
            { name: 'Videos Blog', url: 'tools/blog.html', icon: 'target' }, 
            { name: 'Reading Analysis', url: 'tools/oral.html', icon: 'reading' }, 
            { name: 'File-sharing', url: 'tools/file-sharing.html', icon: 'share' },
            { name: 'Image generation', url: 'tools/text-to-image.html', icon: 'tools' }, 
            { name: 'Algorithm Visualiser', url: 'tools/search-algo.html', icon: 'flowchart' },
            { name: 'Screen-Sharing', url: 'tools/screen-share.html', icon: 'monitor' },
            { name: 'Code-Compiler', url: 'tools/code-editor.html', icon: 'code' },
        ]
    };
    
    const MILO_REMINDER_CONFIG = {
        NOTIFICATION_TYPES: {
            EXAM: '📝 Exam',
            ASSIGNMENT: '📋 Assignment',
            MEETING: '👥 Meeting',
            DEADLINE: '⏰ Deadline',
            EVENT: '🎉 Event',
            GENERAL: '📌 Reminder'
        },
        REMINDER_KEYWORDS: [
            'remind', 'reminder', 'exam', 'test', 'assignment', 'meeting', 
            'deadline', 'due', 'schedule', 'appointment', 'event', 'class',
            'submission', 'presentation', 'conference', 'workshop'
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
        sql: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
  <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path>
  <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path>
  <path d="M8 9h2v6H8zM14 9h2v6h-2z"></path>
</svg>`,
        reading: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7v13a1 1 0 0 0 1 1h6a1 1 0 0 1 1 1V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zm20 0v13a1 1 0 0 1-1 1h-6a1 1 0 0 0-1 1V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></svg>',
        flowchart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="6" height="6"></rect>
  <rect x="15" y="3" width="6" height="6"></rect>
  <rect x="9" y="15" width="6" height="6"></rect>
  <path d="M6 9v6h3"></path>
  <path d="M18 9v6h-3"></path>
</svg>`,
        bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>'
    };
    

    class MiloReminderSystem {
        constructor() {
            this.reminders = [];
            this.notificationPermission = false;
            this.checkIntervals = [];
            this.audioContext = null;
            this.customSound = new Audio('js/notify.mp3');
            this.init();
        }

        async init() {
            await this.loadReminders();
            this.setupReminderDetection();
            this.startReminderCheck();
            this.createNotificationSound();
            console.log('🎯 Milo Reminder System initialized!');
        }

        async requestNotificationPermission() {
            if ('Notification' in window && Notification.permission === 'default') {
                try {
                    const permission = await Notification.requestPermission();
                    this.notificationPermission = permission === 'granted';
                    
                    if (this.notificationPermission) {
                        this.showNotification('✅ Reminder System Active', 
                            'Milo will now remind you of important dates and events!', 'success');
                    }
                } catch (error) {
                    console.log('Notification permission denied');
                }
            } else if (Notification.permission === 'granted') {
                this.notificationPermission = true;
            }
        }

        createNotificationSound() {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                console.log('Audio context not available');
            }
        }

        playNotificationSound() {
            try {
                this.customSound.currentTime = 0;
                this.customSound.volume = 0.5;
                this.customSound.play().catch(() => {
                    this.playDefaultSound();
                });
            } catch (error) {
                this.playDefaultSound();
            }
        }
        
        playDefaultSound() {
            if (!this.audioContext) return;
            
            try {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
                
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
            } catch (error) {
                console.log('Could not play notification sound');
            }
        }

        showReminderPanel() {
            const reminderPanel = document.createElement('div');
            reminderPanel.id = 'milo-reminder-panel';
            reminderPanel.className = 'milo-reminder-panel';
            reminderPanel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 450px;
                max-height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                z-index: 1001;
                overflow: hidden;
                border: 2px solid #3b82f6;
                animation: miloReminderPopupIn 0.3s ease;
            `;

            reminderPanel.innerHTML = `
                <div class="milo-reminder-header" style="background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: white; padding: 20px; font-weight: 600; position: relative;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        ${ICONS.bell}
                        <span style="font-size: 18px;">Reminders</span>
                    </div>
                    <span id="milo-close-reminder-panel" style="position: absolute; top: 15px; right: 20px; cursor: pointer; font-size: 24px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.2);">&times;</span>
                </div>
                <div class="milo-reminder-content" style="padding: 20px; max-height: 500px; overflow-y: auto;">
                    <div class="milo-add-reminder-form" style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 15px; border: 1px solid #bae6fd;">
                        <h4 style="margin: 0 0 15px 0; color: #1e40af; display: flex; align-items: center; gap: 8px;">
                            <span>📝</span> Quick Add Reminder
                        </h4>
                        <input type="text" id="milo-reminder-title" placeholder="What should I remind you about?" style="width: 100%; padding: 12px; border: 2px solid #bfdbfe; border-radius: 10px; margin-bottom: 15px; background: white; box-sizing: border-box; font-size: 14px;">
                        <input type="datetime-local" id="milo-reminder-datetime" style="width: 100%; padding: 12px; border: 2px solid #bfdbfe; border-radius: 10px; margin-bottom: 15px; background: white; box-sizing: border-box; font-size: 14px;">
                        <select id="milo-reminder-type" style="width: 100%; padding: 12px; border: 2px solid #bfdbfe; border-radius: 10px; margin-bottom: 15px; background: white; box-sizing: border-box; font-size: 14px;">
                            <option value="EXAM">📝 Exam</option>
                            <option value="ASSIGNMENT">📋 Assignment</option>
                            <option value="MEETING">👥 Meeting</option>
                            <option value="DEADLINE">⏰ Deadline</option>
                            <option value="EVENT">🎉 Event</option>
                            <option value="GENERAL">📌 General</option>
                        </select>
                        <button id="milo-add-reminder-btn" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 16px; margin-bottom: 10px;">Add Reminder</button>
                        <button id="milo-enable-notifications-btn" style="width: 100%; padding: 10px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; display: none;">Enable Notifications</button>
                    </div>
                    <div id="milo-reminders-list" style="max-height: 300px; overflow-y: auto;"></div>
                </div>
            `;

            // Remove existing panel if any
            const existingPanel = document.getElementById('milo-reminder-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            document.body.appendChild(reminderPanel);

            // Add event listeners
            document.getElementById('milo-close-reminder-panel').addEventListener('click', () => {
                reminderPanel.style.animation = 'miloReminderPopupOut 0.3s ease';
                setTimeout(() => {
                    if (reminderPanel.parentNode) reminderPanel.remove();
                }, 300);
            });

            document.getElementById('milo-add-reminder-btn').addEventListener('click', () => {
                this.addReminderFromForm();
            });

            document.getElementById('milo-enable-notifications-btn').addEventListener('click', async () => {
                await this.requestNotificationPermission();
                this.checkNotificationStatus();
            });

            this.updateRemindersDisplay();
            this.checkNotificationStatus();
        }

        checkNotificationStatus() {
            const enableBtn = document.getElementById('milo-enable-notifications-btn');
            if (enableBtn) {
                if (Notification.permission === 'default' || Notification.permission === 'denied') {
                    enableBtn.style.display = 'block';
                    enableBtn.textContent = Notification.permission === 'denied' ? 
                        'Notifications Blocked (Check Browser Settings)' : 'Enable Notifications';
                    enableBtn.disabled = Notification.permission === 'denied';
                } else {
                    enableBtn.style.display = 'none';
                }
            }
        }

        setupReminderDetection() {
            const originalHandleSendMessage = window.handleSendMessage;
            
            window.handleSendMessage = async () => {
                const userInput = document.getElementById('user-input');
                if (userInput) {
                    const message = userInput.value.trim().toLowerCase();
                    this.detectAndCreateReminder(message, userInput.value.trim());
                }
                
                if (originalHandleSendMessage) {
                    return originalHandleSendMessage();
                }
            };
        }

        detectAndCreateReminder(message, originalMessage) {
            const hasReminderKeyword = MILO_REMINDER_CONFIG.REMINDER_KEYWORDS.some(keyword => 
                message.includes(keyword));
            
            if (hasReminderKeyword) {
                const datePatterns = [
                    /tomorrow/i,
                    /next week/i,
                    /next month/i,
                    /on (\w+day)/i,
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
                    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
                    /at (\d{1,2}):(\d{2})/i,
                    /(\d{1,2})\s*pm|am/i
                ];

                const foundDate = datePatterns.some(pattern => pattern.test(message));
                
                if (foundDate || message.includes('remind')) {
                    this.showReminderSuggestion(originalMessage);
                }
            }
        }

        showReminderSuggestion(message) {
            if (message.toLowerCase().includes('ai') || message.toLowerCase().includes('artificial intelligence')) {
                return;
            }

            const suggestion = document.createElement('div');
            suggestion.className = 'milo-reminder-suggestion';
            suggestion.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 25px;
                border-radius: 20px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                z-index: 1002;
                max-width: 450px;
                text-align: center;
                border: 2px solid #3b82f6;
                animation: miloReminderPopupIn 0.3s ease;
            `;

            suggestion.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 15px;">🔔</div>
                <h3 style="color: #3b82f6; margin: 0 0 15px 0;">Create Smart Reminder?</h3>
                <p style="margin: 10px 0; color: #64748b;">I noticed you mentioned something that might need a reminder:</p>
                <div style="background: #f0f9ff; padding: 15px; border-radius: 12px; margin: 20px 0; font-style: italic; border: 1px solid #e0f2fe; color: #1e40af;">"${message}"</div>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                    <button id="milo-create-reminder-yes" style="padding: 12px 25px; background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">Yes, Create Reminder</button>
                    <button id="milo-create-reminder-no" style="padding: 12px 25px; background: #e2e8f0; color: #64748b; border: none; border-radius: 10px; cursor: pointer;">No, Thanks</button>
                </div>
            `;

            document.body.appendChild(suggestion);

            document.getElementById('milo-create-reminder-yes').addEventListener('click', () => {
                this.openReminderFormWithSuggestion(message);
                suggestion.remove();
            });

            document.getElementById('milo-create-reminder-no').addEventListener('click', () => {
                suggestion.remove();
            });

            setTimeout(() => {
                if (suggestion.parentNode) {
                    suggestion.remove();
                }
            }, 10000);
        }

        openReminderFormWithSuggestion(message) {
            this.showReminderPanel();
            
            setTimeout(() => {
                document.getElementById('milo-reminder-title').value = message;
                
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                
                const datetimeInput = document.getElementById('milo-reminder-datetime');
                datetimeInput.value = tomorrow.toISOString().slice(0, 16);
            }, 100);
        }

        addReminderFromForm() {
            const title = document.getElementById('milo-reminder-title').value.trim();
            const datetime = document.getElementById('milo-reminder-datetime').value;
            const type = document.getElementById('milo-reminder-type').value;

            if (!title || !datetime) {
                this.showNotification('⚠️ Missing Information', 'Please fill in both title and date/time', 'warning');
                return;
            }

            const reminderTime = new Date(datetime);
            const now = new Date();
            
            if (reminderTime <= now) {
                this.showNotification('⚠️ Invalid Time', 'Please select a future date and time', 'warning');
                return;
            }

            const reminder = {
                id: Date.now().toString(),
                title,
                datetime: reminderTime,
                type,
                created: new Date(),
                notified: false
            };

            this.addReminder(reminder);
            
            document.getElementById('milo-reminder-title').value = '';
            document.getElementById('milo-reminder-datetime').value = '';
            document.getElementById('milo-reminder-type').value = 'GENERAL';
        }

        addReminder(reminder) {
            this.reminders.push(reminder);
            this.saveReminders();
            this.updateRemindersDisplay();
            
            const typeIcon = MILO_REMINDER_CONFIG.NOTIFICATION_TYPES[reminder.type] || '📌';
            this.showNotification('✅ Reminder Created', 
                `${typeIcon} "${reminder.title}" set for ${reminder.datetime.toLocaleString()}`, 'success');
        }

        updateRemindersDisplay() {
            const remindersList = document.getElementById('milo-reminders-list');
            if (!remindersList) return;

            const sortedReminders = [...this.reminders].sort((a, b) => 
                new Date(a.datetime) - new Date(b.datetime));

            remindersList.innerHTML = '';

            if (sortedReminders.length === 0) {
                remindersList.innerHTML = '<div style="text-align: center; color: #64748b; padding: 30px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;"><div style="font-size: 48px; margin-bottom: 15px;">📝</div><p style="margin: 0; font-size: 16px;">No reminders set yet</p><p style="margin: 5px 0 0 0; font-size: 14px;">Add your first reminder above!</p></div>';
                return;
            }

            sortedReminders.forEach(reminder => {
                const reminderElement = document.createElement('div');
                reminderElement.className = 'milo-reminder-item';
                reminderElement.style.cssText = `
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 12px;
                    position: relative;
                    transition: all 0.2s ease;
                `;

                const isOverdue = new Date(reminder.datetime) < new Date();
                const typeIcon = MILO_REMINDER_CONFIG.NOTIFICATION_TYPES[reminder.type] || '📌';

                reminderElement.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: ${isOverdue ? '#dc2626' : '#1e40af'}; margin-bottom: 8px; font-size: 15px;">
                                ${typeIcon} ${reminder.title}
                            </div>
                            <div style="font-size: 13px; color: ${isOverdue ? '#dc2626' : '#64748b'}; display: flex; align-items: center; gap: 5px;">
                                📅 ${new Date(reminder.datetime).toLocaleString()}
                                ${isOverdue ? '<span style="background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">OVERDUE</span>' : ''}
                            </div>
                        </div>
                        <button onclick="window.miloReminder.deleteReminder('${reminder.id}')" style="background: #fee2e2; color: #dc2626; border: none; border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s ease;">Delete</button>
                    </div>
                `;

                remindersList.appendChild(reminderElement);
            });
        }

        deleteReminder(id) {
            this.reminders = this.reminders.filter(r => r.id !== id);
            this.saveReminders();
            this.updateRemindersDisplay();
            this.showNotification('🗑️ Reminder Deleted', 'Reminder has been removed', 'info');
        }

        startReminderCheck() {
            const checkInterval = setInterval(() => {
                this.checkDueReminders();
            }, 30000);

            this.checkIntervals.push(checkInterval);
            setTimeout(() => this.checkDueReminders(), 5000);
        }

        checkDueReminders() {
            const now = new Date();
            const dueReminders = this.reminders.filter(reminder => {
                const reminderTime = new Date(reminder.datetime);
                const timeDiff = reminderTime.getTime() - now.getTime();
                
                return timeDiff <= 60000 && timeDiff >= -60000 && !reminder.notified;
            });

            dueReminders.forEach(reminder => {
                this.triggerReminderNotification(reminder);
                reminder.notified = true;
            });

            if (dueReminders.length > 0) {
                this.saveReminders();
            }
        }

        triggerReminderNotification(reminder) {
            const typeIcon = MILO_REMINDER_CONFIG.NOTIFICATION_TYPES[reminder.type] || '📌';
            
            if (this.notificationPermission && Notification.permission === 'granted') {
                try {
                    const notification = new Notification(`${typeIcon} Reminder: ${reminder.title}`, {
                        body: `Scheduled for: ${new Date(reminder.datetime).toLocaleString()}`,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔔</text></svg>',
                        requireInteraction: true,
                        tag: 'milo-reminder-' + reminder.id
                    });

                    notification.onclick = () => {
                        window.focus();
                        this.showReminderPanel();
                        notification.close();
                    };

                    setTimeout(() => {
                        notification.close();
                    }, 10000);
                } catch (error) {
                    console.log('Could not show browser notification');
                }
            }

            this.playNotificationSound();
            this.showPopupReminder(reminder);
            this.showNotification(`${typeIcon} Reminder`, reminder.title, 'reminder');
        }

        showPopupReminder(reminder) {
            const existingPopup = document.querySelector('.milo-reminder-popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            const popup = document.createElement('div');
            popup.className = 'milo-reminder-popup';
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 1004;
                max-width: 450px;
                text-align: center;
                border: 3px solid #3b82f6;
                animation: miloReminderPopupIn 0.5s ease;
            `;

            const typeIcon = MILO_REMINDER_CONFIG.NOTIFICATION_TYPES[reminder.type] || '📌';
            
            popup.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 15px;">🔔</div>
                <h2 style="color: #3b82f6; margin: 0 0 15px 0; font-size: 24px;">Reminder Alert!</h2>
                <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e0f2fe;">
                    <div style="font-size: 18px; font-weight: 600; color: #1e40af; margin-bottom: 10px;">
                        ${typeIcon} ${reminder.title}
                    </div>
                    <div style="color: #64748b; font-size: 14px;">
                        📅 Scheduled for: ${new Date(reminder.datetime).toLocaleString()}
                    </div>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                    <button id="milo-dismiss-popup" style="padding: 12px 25px; background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 16px;">Got It!</button>
                    <button id="milo-snooze-popup" style="padding: 12px 25px; background: #e2e8f0; color: #64748b; border: none; border-radius: 10px; cursor: pointer; font-size: 16px;">Snooze 5min</button>
                </div>
            `;

            document.body.appendChild(popup);

            const dismissBtn = document.getElementById('milo-dismiss-popup');
            const snoozeBtn = document.getElementById('milo-snooze-popup');

            if (dismissBtn) {
                dismissBtn.addEventListener('click', () => {
                    popup.style.animation = 'miloReminderPopupOut 0.3s ease';
                    setTimeout(() => {
                        if (popup.parentNode) popup.remove();
                    }, 300);
                });
            }

            if (snoozeBtn) {
                snoozeBtn.addEventListener('click', () => {
                    this.snoozeReminder(reminder);
                    popup.style.animation = 'miloReminderPopupOut 0.3s ease';
                    setTimeout(() => {
                        if (popup.parentNode) popup.remove();
                    }, 300);
                });
            }

            setTimeout(() => {
                if (popup.parentNode) {
                    popup.style.animation = 'miloReminderPopupOut 0.3s ease';
                    setTimeout(() => {
                        if (popup.parentNode) popup.remove();
                    }, 300);
                }
            }, 15000);
        }

        snoozeReminder(reminder) {
            const snoozeTime = new Date();
            snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
            
            const newReminder = {
                ...reminder,
                id: Date.now().toString(),
                datetime: snoozeTime,
                notified: false,
                title: reminder.title + ' (Snoozed)'
            };

            this.addReminder(newReminder);
            this.showNotification('⏰ Reminder Snoozed', 'Will remind you again in 5 minutes', 'info');
        }

        showNotification(title, message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = 'milo-notification';
            
            const colors = {
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',
                reminder: '#3b82f6'
            };

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-left: 4px solid ${colors[type]};
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                z-index: 1003;
                max-width: 300px;
                animation: miloSlideInRight 0.3s ease;
                border: 1px solid #e2e8f0;
            `;

            notification.innerHTML = `
                <div style="font-weight: 600; color: #1e40af; margin-bottom: 5px;">${title}</div>
                <div style="color: #64748b; font-size: 14px;">${message}</div>
                <div style="position: absolute; top: 5px; right: 10px; cursor: pointer; color: #94a3b8;" onclick="this.parentElement.remove()">×</div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'miloSlideOutRight 0.3s ease';
                    setTimeout(() => {
                        if (notification.parentNode) notification.remove();
                    }, 300);
                }
            }, 5000);
        }

        saveReminders() {
            try {
                const reminderData = this.reminders.map(r => ({
                    ...r,
                    datetime: r.datetime.toISOString(),
                    created: r.created.toISOString()
                }));
                sessionStorage.setItem('miloRemindersList', JSON.stringify(reminderData));
            } catch (error) {
                console.error('Failed to save reminders:', error);
            }
        }

        async loadReminders() {
            try {
                const saved = sessionStorage.getItem('miloRemindersList');
                if (saved) {
                    this.reminders = JSON.parse(saved).map(r => ({
                        ...r,
                        datetime: new Date(r.datetime),
                        created: new Date(r.created)
                    }));
                }
            } catch (error) {
                console.error('Failed to load reminders:', error);
                this.reminders = [];
            }
        }
    }
    
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
        .tools-dropdown.show .tools-menu-item:nth-child(9) { animation-delay: 0.45s; }
        .tools-dropdown.show .tools-menu-item:nth-child(10) { animation-delay: 0.5s; }
        
        @keyframes slideInRight {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes miloSlideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes miloSlideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes miloReminderPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes miloReminderPopupIn {
            from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        @keyframes miloReminderPopupOut {
            from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            to { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
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
            
            if (item.action === 'reminder') {
                menuItem.href = '#';
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
                        if (window.miloReminder) {
                            window.miloReminder.showReminderPanel();
                        }
                        menuItem.style.opacity = '';
                        menuItem.style.pointerEvents = '';
                    }, 150);
                });
            } else {
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
            }
            
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

    let miloReminder;

    function initializeReminderSystem() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeReminderSystem);
            return;
        }
        
        miloReminder = new MiloReminderSystem();
        window.miloReminder = miloReminder;
    }


    initializeToolsMenu();
    initializeReminderSystem();
})();
