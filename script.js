// light/dark mode
const themeBtn = document.getElementById("themeBtn");
const root = document.documentElement;
const isDark = root.classList.contains("dark-mode");

themeBtn.setAttribute("aria-checked", isDark);
themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";

themeBtn.addEventListener("click", () => {
	const nowDark = root.classList.toggle("dark-mode");

	themeBtn.setAttribute("aria-checked", nowDark);
	themeBtn.textContent = nowDark ? "Light Mode" : "Dark Mode";
	localStorage.setItem("theme", nowDark ? "dark" : "light");
});

// main functions
const searchInput = document.getElementById("search-input");
const filterInput = document.getElementById("filter-input");
const countryList = document.getElementById("country-list");

let countryArray = [];
