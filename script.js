/**
 * Pexels Video Wallpaper Widget
 * 符合Forward Widget开发规范的视频壁纸组件
 */

class PexelsVideoWidget {
    constructor() {
        this.apiKey = null;
        this.settings = {
            autoRefresh: true,
            refreshInterval: 5,
            videoQuality: 'hd'
        };
        this.currentVideo = null;
        this.refreshTimer = null;
        
        // DOM元素
        this.elements = {};
        
        // 初始化
        this.init();
    }

    /**
     * 初始化widget
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSettings();
        this.checkApiKey();
    }

    /**
     * 缓存DOM元素
     */
    cacheElements() {
        this.elements = {
            // 控制按钮
            refreshBtn: document.getElementById('refreshBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            
            // 搜索相关
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            clearSearchBtn: document.getElementById('clearSearchBtn'),
            
            // API密钥
            apiKeyContainer: document.getElementById('apiKeyContainer'),
            apiKeyInput: document.getElementById('apiKeyInput'),
            saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
            
            // 视频播放器
            videoContainer: document.querySelector('.video-container'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            videoPlayer: document.getElementById('videoPlayer'),
            mainVideo: document.getElementById('mainVideo'),
            errorMessage: document.getElementById('errorMessage'),
            errorDescription: document.getElementById('errorDescription'),
            retryBtn: document.getElementById('retryBtn'),
            
            // 视频信息
            videoTitle: document.getElementById('videoTitle'),
            videoAuthor: document.getElementById('videoAuthor'),
            videoTags: document.getElementById('videoTags'),
            
            // 视频控制
            playPauseBtn: document.getElementById('playPauseBtn'),
            muteBtn: document.getElementById('muteBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            
            // 状态栏
            statusText: document.getElementById('statusText'),
            
            // 设置模态框
            settingsModal: document.getElementById('settingsModal'),
            closeSettingsBtn: document.getElementById('closeSettingsBtn'),
            apiKeySetting: document.getElementById('apiKeySetting'),
            autoRefreshSetting: document.getElementById('autoRefreshSetting'),
            refreshIntervalSetting: document.getElementById('refreshIntervalSetting'),
            videoQualitySetting: document.getElementById('videoQualitySetting'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            cancelSettingsBtn: document.getElementById('cancelSettingsBtn')
        };
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 主控制按钮
        this.elements.refreshBtn.addEventListener('click', () => this.getRandomVideo());
        this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        
        // 搜索功能
        this.elements.searchBtn.addEventListener('click', () => this.searchVideos());
        this.elements.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchVideos();
            }
        });
        
        // API密钥保存
        this.elements.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        
        // 视频控制
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.elements.muteBtn.addEventListener('click', () => this.toggleMute());
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // 错误重试
        this.elements.retryBtn.addEventListener('click', () => this.getRandomVideo());
        
        // 设置模态框
        this.elements.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.elements.cancelSettingsBtn.addEventListener('click', () => this.closeSettings());
        
        // 模态框背景点击关闭
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });
        
        // 视频事件
        this.elements.mainVideo.addEventListener('loadstart', () => {
            this.updateStatus('正在加载视频...');
        });
        
        this.elements.mainVideo.addEventListener('canplay', () => {
            this.updateStatus('视频已就绪');
        });
        
        this.elements.mainVideo.addEventListener('error', () => {
            this.showError('视频加载失败', '可能是网络问题或视频格式不支持');
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.togglePlayPause();
            }
        });
    }

    /**
     * 检查API密钥
     */
    checkApiKey() {
        this.apiKey = localStorage.getItem('pexels_api_key');
        
        if (!this.apiKey) {
            this.showApiKeyInput();
        } else {
            this.hideApiKeyInput();
            this.getRandomVideo();
        }
    }

    /**
     * 显示API密钥输入
     */
    showApiKeyInput() {
        this.elements.apiKeyContainer.style.display = 'block';
        this.updateStatus('请输入Pexels API密钥');
    }

    /**
     * 隐藏API密钥输入
     */
    hideApiKeyInput() {
        this.elements.apiKeyContainer.style.display = 'none';
    }

    /**
     * 保存API密钥
     */
    saveApiKey() {
        const apiKey = this.elements.apiKeyInput.value.trim();
        
        if (!apiKey) {
            alert('请输入有效的API密钥');
            return;
        }
        
        localStorage.setItem('pexels_api_key', apiKey);
        this.apiKey = apiKey;
        
        this.hideApiKeyInput();
        this.getRandomVideo();
        
        this.updateStatus('API密钥已保存');
    }

    /**
     * 获取随机视频
     */
    async getRandomVideo() {
        if (!this.apiKey) {
            this.showApiKeyInput();
            return;
        }

        this.showLoading();
        
        try {
            // 随机选择搜索词汇以获得多样化的视频
            const randomQueries = [
                'nature', 'ocean', 'mountains', 'forest', 'sunset', 'city', 'technology',
                'abstract', 'art', 'space', 'clouds', 'fire', 'water', 'landscape',
                'urban', 'minimal', 'colors', 'motion', 'light', 'sky'
            ];
            
            const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
            const randomPage = Math.floor(Math.random() * 10) + 1; // 随机页面1-10
            
            const response = await fetch(
                `https://api.pexels.com/videos/search?query=${randomQuery}&per_page=20&page=${randomPage}`,
                {
                    headers: {
                        'Authorization': this.apiKey
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.videos || data.videos.length === 0) {
                throw new Error('没有找到视频');
            }

            // 随机选择一个视频
            const randomVideo = data.videos[Math.floor(Math.random() * data.videos.length)];
            this.displayVideo(randomVideo);
            
        } catch (error) {
            console.error('获取视频失败:', error);
            this.showError('获取视频失败', error.message);
        }
    }

    /**
     * 搜索视频
     */
    async searchVideos() {
        const query = this.elements.searchInput.value.trim();
        
        if (!query) {
            alert('请输入搜索关键词');
            return;
        }

        if (!this.apiKey) {
            this.showApiKeyInput();
            return;
        }

        this.showLoading();
        this.updateStatus(`正在搜索: ${query}`);
        
        try {
            const response = await fetch(
                `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20`,
                {
                    headers: {
                        'Authorization': this.apiKey
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`搜索失败: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.videos || data.videos.length === 0) {
                throw new Error(`没有找到关于"${query}"的视频`);
            }

            // 随机选择搜索结果中的一个视频
            const randomVideo = data.videos[Math.floor(Math.random() * data.videos.length)];
            this.displayVideo(randomVideo);
            
        } catch (error) {
            console.error('搜索视频失败:', error);
            this.showError('搜索失败', error.message);
        }
    }

    /**
     * 清空搜索
     */
    clearSearch() {
        this.elements.searchInput.value = '';
        this.getRandomVideo();
    }

    /**
     * 显示视频
     */
    displayVideo(video) {
        this.currentVideo = video;
        
        // 选择合适的视频质量
        const videoFile = this.selectVideoQuality(video.video_files);
        
        if (!videoFile) {
            this.showError('视频加载失败', '没有找到合适的视频格式');
            return;
        }

        // 设置视频源
        this.elements.mainVideo.src = videoFile.link;
        
        // 更新视频信息
        this.elements.videoTitle.textContent = video.title || '精美视频';
        this.elements.videoAuthor.textContent = `摄影师: ${video.user.name}`;
        
        // 更新标签
        this.updateVideoTags(video.tags);
        
        // 设置下载链接
        this.elements.downloadBtn.href = videoFile.link;
        this.elements.downloadBtn.download = `pexels-video-${video.id}.mp4`;
        
        // 显示视频播放器
        this.hideLoading();
        this.hideError();
        this.elements.videoPlayer.style.display = 'block';
        
        this.updateStatus('视频加载完成');
        
        // 开始自动刷新计时器
        this.startAutoRefresh();
    }

    /**
     * 选择视频质量
     */
    selectVideoQuality(videoFiles) {
        // 按质量优先级排序
        const qualityPriority = this.settings.videoQuality === 'uhd' 
            ? ['4k', '2k', 'hd', 'sd']
            : this.settings.videoQuality === 'hd'
            ? ['hd', 'sd', '2k', '4k']
            : ['sd', 'hd', '2k', '4k'];

        // 查找MP4格式的视频
        const mp4Files = videoFiles.filter(file => 
            file.file_type === 'video/mp4' && file.link
        );

        // 按质量优先级查找
        for (const quality of qualityPriority) {
            const file = mp4Files.find(f => f.quality === quality);
            if (file) return file;
        }

        // 如果没有找到指定质量，返回第一个可用的MP4文件
        return mp4Files[0] || null;
    }

    /**
     * 更新视频标签
     */
    updateVideoTags(tags) {
        this.elements.videoTags.innerHTML = '';
        
        if (tags && tags.length > 0) {
            tags.slice(0, 5).forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'video-tag';
                tagElement.textContent = tag;
                this.elements.videoTags.appendChild(tagElement);
            });
        }
    }

    /**
     * 切换播放/暂停
     */
    togglePlayPause() {
        const video = this.elements.mainVideo;
        const playIcon = this.elements.playPauseBtn.querySelector('.play-icon');
        const pauseIcon = this.elements.playPauseBtn.querySelector('.pause-icon');
        
        if (video.paused) {
            video.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            video.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    /**
     * 切换静音
     */
    toggleMute() {
        const video = this.elements.mainVideo;
        const unmuteIcon = this.elements.muteBtn.querySelector('.unmute-icon');
        const muteIcon = this.elements.muteBtn.querySelector('.mute-icon');
        
        video.muted = !video.muted;
        
        if (video.muted) {
            unmuteIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            unmuteIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }
    }

    /**
     * 切换全屏
     */
    toggleFullscreen() {
        const video = this.elements.mainVideo;
        
        if (!document.fullscreenElement) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        this.elements.loadingIndicator.style.display = 'flex';
        this.elements.videoPlayer.style.display = 'none';
        this.elements.errorMessage.style.display = 'none';
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        this.elements.loadingIndicator.style.display = 'none';
    }

    /**
     * 显示错误
     */
    showError(title, description) {
        this.hideLoading();
        this.elements.videoPlayer.style.display = 'none';
        this.elements.errorMessage.style.display = 'flex';
        this.elements.errorDescription.textContent = description;
        this.updateStatus(`错误: ${title}`);
    }

    /**
     * 隐藏错误
     */
    hideError() {
        this.elements.errorMessage.style.display = 'none';
    }

    /**
     * 更新状态文本
     */
    updateStatus(text) {
        this.elements.statusText.textContent = text;
    }

    /**
     * 开始自动刷新
     */
    startAutoRefresh() {
        this.stopAutoRefresh();
        
        if (this.settings.autoRefresh && this.settings.refreshInterval > 0) {
            this.refreshTimer = setTimeout(() => {
                this.getRandomVideo();
            }, this.settings.refreshInterval * 60 * 1000);
        }
    }

    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    /**
     * 打开设置
     */
    openSettings() {
        // 填充当前设置
        this.elements.apiKeySetting.value = this.apiKey || '';
        this.elements.autoRefreshSetting.checked = this.settings.autoRefresh;
        this.elements.refreshIntervalSetting.value = this.settings.refreshInterval;
        this.elements.videoQualitySetting.value = this.settings.videoQuality;
        
        this.elements.settingsModal.style.display = 'flex';
    }

    /**
     * 关闭设置
     */
    closeSettings() {
        this.elements.settingsModal.style.display = 'none';
    }

    /**
     * 保存设置
     */
    saveSettings() {
        // 保存API密钥
        const newApiKey = this.elements.apiKeySetting.value.trim();
        if (newApiKey && newApiKey !== this.apiKey) {
            localStorage.setItem('pexels_api_key', newApiKey);
            this.apiKey = newApiKey;
        }

        // 保存其他设置
        this.settings = {
            autoRefresh: this.elements.autoRefreshSetting.checked,
            refreshInterval: parseInt(this.elements.refreshIntervalSetting.value) || 5,
            videoQuality: this.elements.videoQualitySetting.value
        };

        this.saveSettingsToStorage();
        this.closeSettings();
        
        // 重新开始自动刷新
        this.startAutoRefresh();
        
        this.updateStatus('设置已保存');
    }

    /**
     * 加载设置
     */
    loadSettings() {
        const savedSettings = localStorage.getItem('pexels_widget_settings');
        
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (error) {
                console.warn('加载设置失败:', error);
            }
        }
    }

    /**
     * 保存设置到本地存储
     */
    saveSettingsToStorage() {
        localStorage.setItem('pexels_widget_settings', JSON.stringify(this.settings));
    }

    /**
     * 获取widget配置（用于Forward框架）
     */
    getWidgetConfig() {
        return {
            name: 'pexels-video-wallpaper',
            version: '1.0.0',
            author: 'Forward Widget Developer',
            description: 'Pexels视频壁纸组件，支持随机获取和搜索功能',
            settings: this.settings,
            currentVideo: this.currentVideo
        };
    }

    /**
     * 重置widget
     */
    reset() {
        this.stopAutoRefresh();
        this.elements.mainVideo.src = '';
        this.hideLoading();
        this.hideError();
        this.elements.videoPlayer.style.display = 'none';
        this.updateStatus('就绪');
    }

    /**
     * 销毁widget
     */
    destroy() {
        this.stopAutoRefresh();
        // 移除事件监听器等清理工作
        this.reset();
    }
}

// Forward Widget API 兼容性
window.ForwardWidget = window.ForwardWidget || {};
window.ForwardWidget.PexelsVideoWidget = PexelsVideoWidget;

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.pexelsVideoWidget = new PexelsVideoWidget();
});

// 导出用于ES6模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PexelsVideoWidget;
}