window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const darkModeToggles = document.querySelectorAll('#darkModeToggle');
    const keyFeaturesBtn = document.getElementById('keyFeaturesBtn');
    const flipContainer = document.querySelector('.flip-container');
    const introParagraph = document.getElementById('intro-paragraph');
    const keyFeaturesList = document.getElementById('key-features-list');

function toggleDarkMode() {
document.body.classList.toggle('light-mode');
setInitialButtonText();
}

darkModeToggles.forEach(button => {
button.addEventListener('click', toggleDarkMode);
});

const setInitialButtonText = () => {
const isLightMode = document.body.classList.contains('light-mode');
darkModeToggles.forEach(button => {
 button.innerHTML = isLightMode 
 ? '<span>🌙 Dark Mode</span>' :'<span>☀️ Light Mode</span>';
});
};

    const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!isSystemDarkMode) {
        document.body.classList.add('light-mode');
    }
    setInitialButtonText();
    
    if (keyFeaturesBtn) {
        keyFeaturesBtn.addEventListener('click', () => {
            const isFlipped = flipContainer.classList.contains('flipped');
            if (!isFlipped) {
                flipContainer.classList.add('flipped');
                flipContainer.style.height = `${keyFeaturesList.offsetHeight}px`;
                keyFeaturesBtn.textContent = 'Back';
            } else {
                flipContainer.classList.remove('flipped');
                flipContainer.style.height = `${introParagraph.offsetHeight}px`;
                keyFeaturesBtn.textContent = 'Key Features';
            }
        });
    }

    if (introParagraph) {
        const initialHeight = introParagraph.offsetHeight;
        flipContainer.style.height = `${initialHeight}px`;
    }
});