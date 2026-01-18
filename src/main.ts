document.addEventListener('DOMContentLoaded', () => {
    // --- Lightbox Functionality ---
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    
    const img = document.createElement('img');
    img.className = 'lightbox-content';
    
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);

    // Event Delegation for Gallery Images
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        // Only zoom if the image is in a gallery-item AND NOT wrapped in an <a> tag
        if (target.tagName === 'IMG' && target.closest('.gallery-item') && !target.closest('a')) {
            e.preventDefault(); 
            const src = (target as HTMLImageElement).src;
            img.src = src;
            lightbox.classList.add('active');
        }
    });

    // Close Lightbox on Click
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
    
    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        }
    });

    // Cleanup: Remove legacy dark mode if any
    document.body.classList.remove('dark-mode');
    localStorage.removeItem('theme');
});