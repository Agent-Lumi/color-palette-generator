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
        
        // Color History for Undo/Redo
        this.paletteHistory = JSON.parse(localStorage.getItem('paletteHistory') || '[]');
        this.historyIndex = -1;
        this.maxHistory = 20;
        
        // Color Name Database for the new feature
        this.colorNames = this.initColorNames();
        
        this.init();
    }
    
    // 🎨 NEW FEATURE: Color Name Identifier - Returns human-readable color names
    initColorNames() {
        return {
            // Reds
            '#800000': 'Maroon', '#8b0000': 'Dark Red', '#b22222': 'Firebrick',
            '#cd5c5c': 'Indian Red', '#f08080': 'Light Coral', '#fa8072': 'Salmon',
            '#e9967a': 'Dark Salmon', '#ffa07a': 'Light Salmon', '#dc143c': 'Crimson',
            '#ff0000': 'Red', '#ff4500': 'Orange Red', '#ff6347': 'Tomato',
            '#ff7f50': 'Coral', '#ff69b4': 'Hot Pink', '#ff1493': 'Deep Pink',
            '#c71585': 'Medium Violet Red', '#db7093': 'Pale Violet Red',
            
            // Pinks & Purples
            '#ff00ff': 'Magenta', '#ee82ee': 'Violet', '#dda0dd': 'Plum',
            '#da70d6': 'Orchid', '#ba55d3': 'Medium Orchid', '#9932cc': 'Dark Orchid',
            '#9400d3': 'Dark Violet', '#8b008b': 'Dark Magenta', '#800080': 'Purple',
            '#4b0082': 'Indigo', '#483d8b': 'Dark Slate Blue', '#6a5acd': 'Slate Blue',
            '#7b68ee': 'Medium Slate Blue', '#9370db': 'Medium Purple',
            '#e6e6fa': 'Lavender', '#d8bfd8': 'Thistle', '#f0f8ff': 'Alice Blue',
            
            // Blues
            '#00008b': 'Dark Blue', '#0000cd': 'Medium Blue', '#0000ff': 'Blue',
            '#4169e1': 'Royal Blue', '#1e90ff': 'Dodger Blue', '#00bfff': 'Deep Sky Blue',
            '#87ceeb': 'Sky Blue', '#87cefa': 'Light Sky Blue', '#4682b4': 'Steel Blue',
            '#b0c4de': 'Light Steel Blue', '#add8e6': 'Light Blue', '#b0e0e6': 'Powder Blue',
            '#afeeee': 'Pale Turquoise', '#00ced1': 'Dark Turquoise',
            '#48d1cc': 'Medium Turquoise', '#40e0d0': 'Turquoise', '#00ffff': 'Cyan',
            '#5f9ea0': 'Cadet Blue', '#008b8b': 'Dark Cyan', '#008080': 'Teal',
            '#20b2aa': 'Light Sea Green', '#66cdaa': 'Medium Aquamarine',
            
            // Greens
            '#00fa9a': 'Medium Spring Green', '#00ff7f': 'Spring Green',
            '#98fb98': 'Pale Green', '#90ee90': 'Light Green', '#8fbc8f': 'Dark Sea Green',
            '#3cb371': 'Medium Sea Green', '#2e8b57': 'Sea Green', '#006400': 'Dark Green',
            '#228b22': 'Forest Green', '#008000': 'Green', '#32cd32': 'Lime Green',
            '#00ff00': 'Lime', '#7cfc00': 'Lawn Green', '#7fff00': 'Chartreuse',
            '#adff2f': 'Green Yellow', '#9acd32': 'Yellow Green',
            '#6b8e23': 'Olive Drab', '#556b2f': 'Dark Olive Green', '#808000': 'Olive',
            
            // Yellows & Oranges
            '#bdb76b': 'Dark Khaki', '#f0e68c': 'Khaki', '#eee8aa': 'Pale Goldenrod',
            '#fafad2': 'Light Goldenrod Yellow', '#ffffe0': 'Light Yellow',
            '#ffff00': 'Yellow', '#ffd700': 'Gold', '#fffacd': 'Lemon Chiffon',
            '#f5f5dc': 'Beige', '#ffe4c4': 'Bisque', '#ffebcd': 'Blanched Almond',
            '#ffdab9': 'Peach Puff', '#ffdead': 'Navajo White', '#ffe4b5': 'Moccasin',
            '#ffa500': 'Orange', '#ff8c00': 'Dark Orange', '#ff7f00': 'Dark Orange',
            '#f4a460': 'Sandy Brown', '#daa520': 'Goldenrod', '#b8860b': 'Dark Goldenrod',
            '#cd853f': 'Peru', '#d2691e': 'Chocolate', '#8b4513': 'Saddle Brown',
            '#a0522d': 'Sienna', '#bc8f8f': 'Rosy Brown', '#deb887': 'Burlywood',
            '#f5deb3': 'Wheat', '#fff8dc': 'Cornsilk',
            
            // Browns & Grays
            '#fff5ee': 'Seashell', '#a0522d': 'Sienna', '#c0c0c0': 'Silver',
            '#808080': 'Gray', '#696969': 'Dim Gray', '#778899': 'Light Slate Gray',
            '#708090': 'Slate Gray', '#2f4f4f': 'Dark Slate Gray', '#000000': 'Black',
            '#ffffff': 'White', '#fffafa': 'Snow', '#f8f8ff': 'Ghost White',
            '#f0f8ff': 'Alice Blue', '#f5f5f5': 'White Smoke', '#dcdcdc': 'Gainsboro',
            '#d3d3d3': 'Light Gray', '#a9a9a9': 'Dark Gray', '#c0c0c0': 'Silver',
            '#d2691e': 'Chocolate', '#8b4513': 'Saddle Brown', '#800000': 'Maroon',
            '#8b0000': 'Dark Red', '#a52a2a': 'Brown', '#cd853f': 'Peru',
            '#deb887': 'Burlywood', '#d2b48c': 'Tan', '#f4a460': 'Sandy Brown'
        };
    }
    
    // 🎨 NEW FEATURE: Get the closest named color for any hex code
    getColorName(hex) {
        hex = hex.toLowerCase();
        
        // Check exact match first
        if (this.colorNames[hex]) {
            return this.colorNames[hex];
        }
        
        // Find closest named color by RGB distance
        const rgb = this.hexToRgb(hex);
        let closestName = 'Unknown';
        let minDistance = Infinity;
        
        for (const [namedHex, name] of Object.entries(this.colorNames)) {
            const namedRgb = this.hexToRgb(namedHex);
            const distance = Math.sqrt(
                Math.pow(rgb.r - namedRgb.r, 2) +
                Math.pow(rgb.g - namedRgb.g, 2) +
                Math.pow(rgb.b - namedRgb.b, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestName = name;
            }
        }
        
        // Only return close name if it's reasonably similar (within 50 units)
        if (minDistance < 50) {
            return `${closestName}`;
        }
        
        return 'Custom';
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    init() {
        this.addEventListeners();
        this.renderSavedPalettes();
        this.setupTabs();
        this.setupKeyboardShortcuts();
        this.initContrastChecker();
        
        // Load from history or generate new
        if (this.paletteHistory.length > 0) {
            this.historyIndex = this.paletteHistory.length - 1;
            this.currentPalette = [...this.paletteHistory[this.historyIndex]];
            this.renderPalette(this.paletteDisplay, this.currentPalette);
        } else {
            this.generatePalette();
        }
    }
    
    // Save current palette to history
    addToHistory(palette) {
        // Remove any future history if we're not at the end
        if (this.historyIndex < this.paletteHistory.length - 1) {
            this.paletteHistory = this.paletteHistory.slice(0, this.historyIndex + 1);
        }
        
        // Add new state
        this.paletteHistory.push([...palette]);
        
        // Trim to max size
        if (this.paletteHistory.length > this.maxHistory) {
            this.paletteHistory.shift();
        } else {
            this.historyIndex++;
        }
        
        // Save to localStorage
        localStorage.setItem('paletteHistory', JSON.stringify(this.paletteHistory));
        this.updateHistoryButtons();
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentPalette = [...this.paletteHistory[this.historyIndex]];
            this.renderPalette(this.paletteDisplay, this.currentPalette);
            this.updateHistoryButtons();
            this.showToast('↩️ Undone');
        }
    }
    
    redo() {
        if (this.historyIndex < this.paletteHistory.length - 1) {
            this.historyIndex++;
            this.currentPalette = [...this.paletteHistory[this.historyIndex]];
            this.renderPalette(this.paletteDisplay, this.currentPalette);
            this.updateHistoryButtons();
            this.showToast('↪️ Redone');
        }
    }
    
    updateHistoryButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        if (undoBtn) {
            undoBtn.disabled = this.historyIndex <= 0;
            undoBtn.style.opacity = this.historyIndex <= 0 ? '0.5' : '1';
        }
        if (redoBtn) {
            redoBtn.disabled = this.historyIndex >= this.paletteHistory.length - 1;
            redoBtn.style.opacity = this.historyIndex >= this.paletteHistory.length - 1 ? '0.5' : '1';
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
            if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'y')) {
                e.preventDefault();
                this.redo();
            }
        });
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
        
        // Undo/Redo buttons
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        if (undoBtn) undoBtn.addEventListener('click', () => this.undo());
        if (redoBtn) redoBtn.addEventListener('click', () => this.redo());
        
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
        this.addToHistory(this.currentPalette);
    }
    
    renderPalette(container, colors) {
        container.innerHTML = '';
        colors.forEach((color, index) => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.backgroundColor = color;
            
            // 🎨 NEW FEATURE: Get color name
            const colorName = this.getColorName(color);
            
            colorDiv.innerHTML = `
                <div class="color-info">
                    <div class="color-hex">${color.toUpperCase()}</div>
                    <div class="color-name">${colorName}</div>
                    <div>Click to copy</div>
                </div>
            `;
            colorDiv.addEventListener('click', () => this.copyColor(color));
            
            // 🎨 NEW FEATURE: Add color name badge
            const nameBadge = document.createElement('span');
            nameBadge.className = 'color-name-badge';
            nameBadge.textContent = colorName;
            colorDiv.appendChild(nameBadge);
            
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
        this.addToHistory(this.currentPalette);
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
    
    // Contrast Checker Methods
    initContrastChecker() {
        this.contrastFgPicker = document.getElementById('contrastFgPicker');
        this.contrastBgPicker = document.getElementById('contrastBgPicker');
        this.contrastFgHex = document.getElementById('contrastFgHex');
        this.contrastBgHex = document.getElementById('contrastBgHex');
        this.contrastSwap = document.getElementById('contrastSwap');
        this.contrastPreview = document.getElementById('contrastPreview');
        this.previewText = document.getElementById('previewText');
        this.ratioValue = document.getElementById('ratioValue');
        this.wcagAA = document.getElementById('wcagAA');
        this.wcagAAA = document.getElementById('wcagAAA');
        this.wcagAALarge = document.getElementById('wcagAALarge');
        this.quickColors = document.getElementById('quickColors');
        
        if (!this.contrastFgPicker) return;
        
        // Event listeners
        this.contrastFgPicker.addEventListener('input', (e) => {
            this.contrastFgHex.value = e.target.value;
            this.updateContrastPreview();
        });
        
        this.contrastBgPicker.addEventListener('input', (e) => {
            this.contrastBgHex.value = e.target.value;
            this.updateContrastPreview();
        });
        
        this.contrastFgHex.addEventListener('change', (e) => {
            const hex = this.validateHex(e.target.value);
            if (hex) {
                this.contrastFgPicker.value = hex;
                this.contrastFgHex.value = hex;
                this.updateContrastPreview();
            }
        });
        
        this.contrastBgHex.addEventListener('change', (e) => {
            const hex = this.validateHex(e.target.value);
            if (hex) {
                this.contrastBgPicker.value = hex;
                this.contrastBgHex.value = hex;
                this.updateContrastPreview();
            }
        });
        
        this.contrastSwap.addEventListener('click', () => {
            const tempFg = this.contrastFgPicker.value;
            const tempFgHex = this.contrastFgHex.value;
            
            this.contrastFgPicker.value = this.contrastBgPicker.value;
            this.contrastFgHex.value = this.contrastBgHex.value;
            
            this.contrastBgPicker.value = tempFg;
            this.contrastBgHex.value = tempFgHex;
            
            this.updateContrastPreview();
            this.showToast('Colors swapped!');
        });
        
        // Listen for tab changes to update quick colors
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.tab === 'contrast') {
                    this.updateQuickColors();
                }
            });
        });
        
        // Initial update
        this.updateContrastPreview();
    }
    
    updateQuickColors() {
        if (!this.quickColors) return;
        
        this.quickColors.innerHTML = '';
        
        // Add colors from current palette
        const colors = [...this.currentPalette];
        
        // Add saved palette colors
        this.savedPalettes.forEach(palette => {
            colors.push(...palette.colors);
        });
        
        // Remove duplicates and limit
        const uniqueColors = [...new Set(colors)].slice(0, 16);
        
        if (uniqueColors.length === 0) {
            this.quickColors.innerHTML = '<p class="empty-state">Generate or save a palette to see quick colors</p>';
            return;
        }
        
        uniqueColors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'quick-color-btn';
            btn.style.backgroundColor = color;
            btn.title = `Use ${color}`;
            
            // Right click to set background, left click to set foreground
            btn.addEventListener('click', () => {
                this.contrastFgPicker.value = color;
                this.contrastFgHex.value = color;
                this.updateContrastPreview();
                this.showToast(`Foreground set to ${color.toUpperCase()}`);
            });
            
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.contrastBgPicker.value = color;
                this.contrastBgHex.value = color;
                this.updateContrastPreview();
                this.showToast(`Background set to ${color.toUpperCase()}`);
            });
            
            this.quickColors.appendChild(btn);
        });
    }
    
    updateContrastPreview() {
        if (!this.contrastPreview) return;
        
        const fgColor = this.contrastFgPicker.value;
        const bgColor = this.contrastBgPicker.value;
        
        this.contrastPreview.style.backgroundColor = bgColor;
        this.previewText.style.color = fgColor;
        
        // Calculate contrast ratio
        const ratio = this.calculateContrastRatio(fgColor, bgColor);
        this.ratioValue.textContent = ratio + ':1';
        
        // WCAG levels
        const aa = ratio >= 4.5;
        const aaa = ratio >= 7;
        const aaLarge = ratio >= 3;
        
        this.updateWcagStatus(this.wcagAA, aa);
        this.updateWcagStatus(this.wcagAAA, aaa);
        this.updateWcagStatus(this.wcagAALarge, aaLarge);
    }
    
    updateWcagStatus(element, pass) {
        if (!element) return;
        
        element.classList.remove('pass', 'fail');
        element.classList.add(pass ? 'pass' : 'fail');
        
        const statusSpan = element.querySelector('.level-status');
        if (statusSpan) {
            statusSpan.textContent = pass ? '✓ Pass' : '✗ Fail';
        }
    }
    
    calculateContrastRatio(fg, bg) {
        const fgLuminance = this.getLuminance(fg);
        const bgLuminance = this.getLuminance(bg);
        
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);
        
        const ratio = (lighter + 0.05) / (darker + 0.05);
        return ratio.toFixed(2);
    }
    
    getLuminance(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const [lr, lg, lb] = [r, g, b].map(c => {
            if (c <= 0.03928) return c / 12.92;
            return Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    }
    
    validateHex(hex) {
        hex = hex.trim();
        if (!hex.startsWith('#')) {
            hex = '#' + hex;
        }
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            return hex.toLowerCase();
        }
        return null;
    }
}

new ColorPaletteGenerator();
