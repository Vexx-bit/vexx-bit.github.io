document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.loader');
    const content = document.querySelector('.content');

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Hide the loader and show the content
        loader.classList.add('hidden');
        content.style.filter = 'none';
    });
});
