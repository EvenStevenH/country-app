addEventListener("click", toggleDarkMode)

function toggleDarkMode() {
   let element = document.body;
   element.classList.toggle("dark-mode");
}