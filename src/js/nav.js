const boton = document.getElementById('boton');
const menu = document.getElementById('menu');

boton.addEventListener('click', () => {
    menu.classList.toggle('hidden');
})