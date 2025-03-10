class ToastManager {
    static init() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        // Add CSS if not present
        if (!document.querySelector('link[href="enhanced-toast.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'enhanced-toast.css';
            document.head.appendChild(link);
        }
    }

    static show(title, message, options = {}) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast ${options.type || 'success'}`;
        
        const content = document.createElement('div');
        content.className = 'toast-content';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'toast-title';
        titleEl.textContent = title;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        
        content.appendChild(titleEl);
        content.appendChild(messageEl);
        toast.appendChild(content);
        
        if (options.action) {
            const actionBtn = document.createElement('button');
            actionBtn.className = 'toast-action';
            actionBtn.textContent = options.action.text;
            actionBtn.onclick = options.action.onClick;
            toast.appendChild(actionBtn);
        }
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => toast.remove();
        toast.appendChild(closeBtn);
        
        document.querySelector('.toast-container').appendChild(toast);
        
        // Auto-remove after delay
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.remove();
            }
        }, options.duration || 5000);
    }
}