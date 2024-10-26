const toggle_menu_btn = document.getElementById('toggle_menu_navbar');
const menu = document.querySelector('.navbar_container');

toggle_menu_btn.addEventListener('click', function() {
    menu.classList.toggle('navbar_active');
});
