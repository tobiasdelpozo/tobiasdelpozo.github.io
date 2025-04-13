console.log("Website script loaded!");

// Get references to the sections (optional, but shows TS usage)
const photographySection: HTMLElement | null = document.getElementById('photography');
const portfolioSection: HTMLElement | null = document.getElementById('portfolio');

if (photographySection && portfolioSection) {
    console.log("Found both sections!");
    // You could add event listeners or other dynamic behavior here later
    // e.g., photographySection.addEventListener('click', () => console.log('Clicked Photo Section'));
}

// --- Modal Functionality ---

// Get references to the elements
const contactModal = document.getElementById('contactModal') as HTMLElement | null;
const contactBtn = document.getElementById('contactBtn') as HTMLButtonElement | null;
const closeContactModalBtn = document.getElementById('closeContactModal') as HTMLElement | null;

// Function to open the modal
function openModal(): void {
    if (contactModal) {
        // contactModal.style.display = 'flex'; // Or 'block' if not using flex for centering
        contactModal.classList.add('modal-active'); // Add class to show modal
    }
}

// Function to close the modal
function closeModal(): void {
    if (contactModal) {
        // contactModal.style.display = 'none';
         contactModal.classList.remove('modal-active'); // Remove class to hide modal
    }
}

// Event listener for the open button
if (contactBtn) {
    contactBtn.addEventListener('click', openModal);
}

// Event listener for the close button
if (closeContactModalBtn) {
    closeContactModalBtn.addEventListener('click', closeModal);
}

// Optional: Close modal if user clicks outside the modal content
if (contactModal) {
    contactModal.addEventListener('click', (event) => {
        // Check if the click was directly on the modal overlay (event.target)
        // and not on its children (the modal content box)
        if (event.target === contactModal) {
            closeModal();
        }
    });
}

// --- End of Modal Functionality ---

// Keep any other existing TypeScript code below...
console.log("Website script loaded!"); // Your existing log

// ... rest of your existing main.ts code

// Add any other TypeScript logic you need for your site here.

// --- Keep existing code for sections ---
console.log("Website script loaded!");
// ... (photographySection/portfolioSection code) ...


// --- Existing Modal Functionality ---
// const contactModal = document.getElementById('contactModal') as HTMLElement | null;
// ... (rest of contact modal code: contactBtn, closeContactModalBtn, openModal, closeModal, event listeners) ...


// --- NEW: Dropdown Functionality ---
const photographyDropdownToggle = document.getElementById('photographyDropdownToggle') as HTMLButtonElement | null;
const photographyDropdownContent = document.getElementById('photographyDropdownContent') as HTMLElement | null;

if (photographyDropdownToggle && photographyDropdownContent) {
    photographyDropdownToggle.addEventListener('click', (event) => {
        // Prevent click closing dropdown immediately if clicking outside check is active
        event.stopPropagation();
        // Toggle the active class to show/hide
        photographyDropdownContent.classList.toggle('dropdown-active');
    });
}

// Optional: Close dropdown if user clicks outside of it
window.addEventListener('click', (event) => {
    if (photographyDropdownContent && photographyDropdownToggle) {
        // Check if the click target is NOT the toggle button AND NOT inside the dropdown content
        if (event.target !== photographyDropdownToggle && !photographyDropdownContent.contains(event.target as Node)) {
            photographyDropdownContent.classList.remove('dropdown-active');
        }
    }
});

// --- End of Dropdown Functionality ---

// --- Keep existing code ---
console.log("Website script loaded!");
// ... (photographySection/portfolioSection code - might remove if not on homepage) ...
// ... (Contact modal code) ...
// ... (Dropdown code) ...

// --- NEW: Gallery and Lightbox Functionality ---

interface GalleryImage {
    src: string;
    alt: string;
    caption?: string;
}

// Modify your populateGrid function to call the callback after images are added
function populateGrid(images: GalleryImage[], callback?: () => void): void {
    const grid = document.getElementById('imageGrid');
    if (!grid) return;

    grid.innerHTML = '';

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.dataset.fullSrc = image.src;
        imgElement.dataset.alt = image.alt;
        if (image.caption) {
            imgElement.dataset.caption = image.caption;
        }

        imgElement.addEventListener('click', () => {
            openLightbox(
                imgElement.dataset.fullSrc || '',
                imgElement.dataset.alt || 'Enlarged view',
                imgElement.dataset.caption
            );
        });

        grid.appendChild(imgElement);
    });

    if (callback) {
        // Wait for images to load before initializing Masonry
        const imagesLoaded = grid.querySelectorAll('img');
        let loadedCount = 0;
        imagesLoaded.forEach(img => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === imagesLoaded.length) {
                    callback();
                }
            } else {
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === imagesLoaded.length) {
                        callback();
                    }
                };
            }
        });
        if (imagesLoaded.length === 0) {
            callback(); // Call callback even if there are no images
        }
    }
}

// Get Lightbox elements
const lightbox = document.getElementById('lightbox') as HTMLElement | null;
const lightboxImg = document.getElementById('lightboxImg') as HTMLImageElement | null;
const lightboxCaption = document.getElementById('lightboxCaption') as HTMLElement | null;
const lightboxClose = document.getElementById('lightboxClose') as HTMLElement | null;

// Function to open the lightbox
function openLightbox(src: string, alt: string, caption?: string): void {
    if (lightbox && lightboxImg && lightboxCaption) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightboxCaption.textContent = caption || ''; // Set caption text, or empty if none
        lightbox.classList.add('active'); // Show lightbox
    }
}

// Function to close the lightbox
function closeLightbox(): void {
    if (lightbox) {
        lightbox.classList.remove('active'); // Hide lightbox
    }
}

// Add event listeners for lightbox closing
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}
if (lightbox) {
    // Close if clicking on the dark overlay background
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const galleryDataElement = document.getElementById('galleryData');
    const imageGridElement = document.getElementById('imageGrid');

    if (galleryDataElement && imageGridElement) {
        try {
            const imageData: GalleryImage[] = JSON.parse(galleryDataElement.textContent || '[]');
            console.log("Parsed image data:", imageData);

            if (imageData.length > 0) {
                populateGrid(imageData, () => { // Add a callback function
                    // Initialize Masonry after images are loaded
                    const masonry = new (window as any).Masonry(imageGridElement, {
                        itemSelector: 'img',
                        // columnWidth: 300, // You might not need this for a basic setup
                        percentPosition: true,
                        isFitWidth: true,
                        gutter: 10
                    });
                    console.log("initialized masonry");
                    setTimeout(() => masonry.layout(), 100);
                });
            } else {
                 imageGridElement.innerHTML = '<p>No images found for this gallery.</p>';
            }
        } catch (error) {
            console.error("Error parsing gallery data:", error);
             imageGridElement.innerHTML = '<p>Error loading images.</p>';
        }
    }
});


// --- End of Gallery and Lightbox Functionality ---

console.log("Website script loaded! (End of script)");


console.log("Website script loaded! (End of script)"); // You have two of these logs, maybe remove one