class ColorPaletteGenerator {
    constructor() {
        this.paletteDisplay = document.getElementById('paletteDisplay');
        this.imagePaletteDisplay = document.getElementById('imagePaletteDisplay');
        this.generateBtn = document.getElementById('generateBtn');
        this.paletteType = document.getElementById('paletteType');
        this.colorCount = document.getElementById('colorCount');
        this.colorCountValue = document.getElementById('colorCountValue');
        this.saveBtn = document.getElementById('saveBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.savedGrid = document.getElementById('savedGrid');
        this.dropZone = document.getElementById('dropZone');
        this.imageInput = document.getElementById('imageInput');
        this.previewImage = document.getElementById('previewImage');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.currentPalette = [];
        this.savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.renderSavedPalettes();
        this.generatePalette();
        this.setupTabs();
    }
    
    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
            });
        });
    }
    
    addEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        
        this.colorCount.addEventListener('input', () => {
            this.colorCountValue.textContent = this.colorCount.value;
        });
        
        this.saveBtn.addEventListener('click', () => this.savePalette());
        this.exportBtn.addEventListener('click', () => this.showExportModal());
        this.shareBtn?.addEventListener('click', () => this.sharePalette());
        
        this.dropZone.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.style.borderColor = '#ff6b6b';
        });
        
        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.style.borderColor = 'rgba(255,255,255,0.2)';
        });
        
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.style.borderColor = 'rgba(255,255,255,0.2)';
            if (e.dataTransfer.files.length) {
                this.processImage(e.dataTransfer.files[0]);
            }
        });
    }
    
    generateRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
    
    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    
    hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }
    
    generatePalette() {
        const type = this.paletteType.value;
        const count = parseInt(this.colorCount.value);
        const baseColor = this.generateRandomColor();
        const baseHsl = this.hexToHsl(baseColor);
        
        this.currentPalette = [];
        
        switch(type) {
            case 'analogous':
                for (let i = 0; i < count; i++) {
                    const h = (baseHsl.h + (i - Math.floor(count/2)) * 30 + 360) % 360;
                    this.currentPalette.push(this.hslToHex(h, baseHsl.s, baseHsl.l));
                }
                break;
            case 'complementary':
                const compH = (baseHsl.h + 180) % 360;
                this.currentPalette.push(baseColor);
                this.currentPalette.push(this.hslToHex(compH, baseHsl.s, baseHsl.l));
                for (let i = 2; i < count; i++) {
                    this.currentPalette.push(this.generateRandomColor());
                }
                break;
            case 'triadic':
                this.currentPalette.push(baseColor);
                this.currentPalette.push(this.hslToHex((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l));
                this.currentPalette.push(this.hslToHex((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l));
                for (let i = 3; i < count; i++) {
                    this.currentPalette.push(this.generateRandomColor());
                }
                break;
            case 'monochromatic':
                for (let i = 0; i < count; i++) {
                    const l = Math.max(10, Math.min(90, 20 + (i * 70 / (count - 1))));
                    this.currentPalette.push(this.hslToHex(baseHsl.h, baseHsl.s, l));
                }
                break;
            default:
                for (let i = 0; i < count; i++) {
                    this.currentPalette.push(this.generateRandomColor());
                }
        }
        
        this.renderPalette(this.paletteDisplay, this.currentPalette);
    }
    
    renderPalette(container, colors) {
        container.innerHTML = '';
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.innerHTML = `
                <div class="color-info">
                    <div>${color.toUpperCase()}</div>
                    <div>Click to copy</div>
                </div>
            `;
            colorDiv.addEventListener('click', () => this.copyColor(color));
            container.appendChild(colorDiv);
        });
    }
    
    copyColor(color) {
        navigator.clipboard.writeText(color);
        this.showToast(`Copied ${color.toUpperCase()}`);
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
    
    handleImageUpload(e) {
        if (e.target.files.length) {
            this.processImage(e.target.files[0]);
        }
    }
    
    processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.previewImage.src = img.src;
                this.previewImage.style.display = 'block';
                this.extractColors(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    extractColors(img) {
        this.canvas.width = 100;
        this.canvas.height = 100;
        this.ctx.drawImage(img, 0, 0, 100, 100);
        
        const imageData = this.ctx.getImageData(0, 0, 100, 100).data;
        const colors = [];
        const colorMap = {};
        
        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
            colorMap[hex] = (colorMap[hex] || 0) + 1;
        }
        
        const sortedColors = Object.entries(colorMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
        
        this.currentPalette = sortedColors;
        this.renderPalette(this.imagePaletteDisplay, this.currentPalette);
    }
    
    savePalette() {
        if (this.currentPalette.length === 0) return;
        
        const palette = {
            id: Date.now(),
            colors: [...this.currentPalette],
            date: new Date().toLocaleString()
        };
        
        this.savedPalettes.unshift(palette);
        localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));
        this.renderSavedPalettes();
        this.showToast('Palette saved!');
    }
    
    renderSavedPalettes() {
        this.savedGrid.innerHTML = '';
        
        if (this.savedPalettes.length === 0) {
            this.savedGrid.innerHTML = '<p class="empty-state">No saved palettes yet</p>';
            return;
        }
        
        this.savedPalettes.forEach(palette => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            
            const colorsHtml = palette.colors.map(c => 
                `<div class="saved-color" style="background: ${c}"></div>`
            ).join('');
            
            item.innerHTML = `
                <div class="saved-colors">${colorsHtml}</div>
                <div class="saved-info">${palette.date}</div>
            `;
            
            item.addEventListener('click', () => {
                this.currentPalette = [...palette.colors];
                this.renderPalette(this.paletteDisplay, this.currentPalette);
                document.querySelector('[data-tab="random"]').click();
            });
            
            this.savedGrid.appendChild(item);
        });
    }
    
    showExportModal() {
        if (this.currentPalette.length === 0) return;
        
        // Remove existing modal
        const existingModal = document.getElementById('exportModal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.id = 'exportModal';
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📤 Export Palette</h3>
                    <button class="modal-close" id="closeModal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="export-options">
                        <button class="export-option" data-format="css">
                            <span class="option-icon">🎨</span>
                            <span class="option-label">CSS Variables</span>
                            <span class="option-desc">:root { --color-1: #xxx }</span>
                        </button>
                        <button class="export-option" data-format="scss">
                            <span class="option-icon">💅</span>
                            <span class="option-label">SCSS Variables</span>
                            <span class="option-desc">$color-1: #xxx;</span>
                        </button>
                        <button class="export-option" data-format="tailwind">
                            <span class="option-icon">🌊</span>
                            <span class="option-label">Tailwind Config</span>
                            <span class="option-desc">colors: { primary: '#xxx' }</span>
                        </button>
                        <button class="export-option" data-format="json">
                            <span class="option-icon">📋</span>
                            <span class="option-label">JSON Array</span>
                            <span class="option-desc">["#xxx", "#xxx", ...]</span>
                        </button>
                        <button class="export-option" data-format="svg">
                            <span class="option-icon">🖼️</span>
                            <span class="option-label">SVG Swatch</span>
                            <span class="option-desc">Export as SVG image</span>
                        </button>
                        <button class="export-option" data-format="png">
                            <span class="option-icon">📷</span>
                            <span class="option-label">PNG Image</span>
                            <span class="option-desc">Download palette as PNG</span>
                        </button>
                    </div>
                    <div class="export-preview" id="exportPreview"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        // Close on backdrop click
        modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeExportModal());
        modal.querySelector('#closeModal').addEventListener('click', () => this.closeExportModal());
        
        // Export options
        modal.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                this.exportToFormat(format);
            });
        });
        
        // Escape to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeExportModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    closeExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    exportToFormat(format) {
        const palette = this.currentPalette;
        let content, filename, mimeType;
        
        switch(format) {
            case 'css':
                content = `/* Color Palette Generated on ${new Date().toLocaleDateString()} */\n:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
                filename = 'palette.css';
                mimeType = 'text/css';
                break;
                
            case 'scss':
                content = `// Color Palette Generated on ${new Date().toLocaleDateString()}\n${palette.map((c, i) => `$color-${i + 1}: ${c};`).join('\n')}\n`;
                filename = 'palette.scss';
                mimeType = 'text/scss';
                break;
                
            case 'tailwind':
                const names = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'neutral'];
                const config = palette.map((c, i) => `    ${names[i] || `color${i + 1}`}: '${c}'`).join(',\n');
                content = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${config}\n      }\n    }\n  }\n}`;
                filename = 'tailwind.config.js';
                mimeType = 'application/javascript';
                break;
                
            case 'json':
                content = JSON.stringify({
                    name: 'Generated Palette',
                    created: new Date().toISOString(),
                    colors: palette
                }, null, 2);
                filename = 'palette.json';
                mimeType = 'application/json';
                break;
                
            case 'svg':
                const svgColors = palette.map((c, i) => 
                    `<rect x="${i * 100}" y="0" width="100" height="100" fill="${c}" />`
                ).join('');
                content = `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="${palette.length * 100}" height="100" xmlns="http://www.w3.org/2000/svg">\n${svgColors}\n</svg>`;
                filename = 'palette.svg';
                mimeType = 'image/svg+xml';
                break;
                
            case 'png':
                this.exportPNG(palette);
                this.closeExportModal();
                this.showToast('PNG downloading...');
                return;
                
            default:
                return;
        }
        
        // Create download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        this.closeExportModal();
        this.showToast(`${format.toUpperCase()} exported!`);
    }
    
    exportPNG(palette) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = palette.length * 200;
        const height = 200;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw color swatches
        palette.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.fillRect(i * 200, 0, 200, height);
            
            // Draw hex label
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(color.toUpperCase(), i * 200 + 100, height / 2);
        });
        
        // Download
        const link = document.createElement('a');
        link.download = 'palette.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    exportPalette() {
        // Legacy method, now replaced by modal
        this.showExportModal();
    }
    
    sharePalette() {
        if (this.currentPalette.length === 0) return;
        
        const paletteText = `Color Palette: ${this.currentPalette.join(', ')}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Color Palette',
                text: paletteText,
                url: window.location.href
            }).catch(() => {
                // Fallback to clipboard
                navigator.clipboard.writeText(window.location.href);
                this.showToast('Link copied to clipboard!');
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard!');
        }
    }
}

new ColorPaletteGenerator();
