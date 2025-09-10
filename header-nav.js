document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.ep-header__menu li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove 'active' class from all items and add 'non-active'
            navItems.forEach(nav => {
                nav.classList.remove('active');
                nav.classList.add('non-active');
            });
            
            // Add 'active' class and remove 'non-active' from clicked item
            this.classList.add('active');
            this.classList.remove('non-active');
            
            // If you want to prevent the default link behavior, uncomment the next line
            // e.preventDefault();
        });
    });
});