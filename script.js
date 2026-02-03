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
let allCountries = [];

function filterResults(countryData, region) {
	if (!region) return countryData;
	return countryData.filter((country) => country.region.toLowerCase().includes(region.toLowerCase().trim()));
}

function searchResults(countryData, searchQuery) {
	return countryData.filter((country) => country.name.common.toLowerCase().includes(searchQuery.toLowerCase().trim()));
}

// update list if any input is given
searchInput.addEventListener("input", updateFullResults);
filterInput.addEventListener("change", updateFullResults);

function updateFullResults() {
	const searchTerm = searchInput.value.toLowerCase().trim();
	const regionInput = filterInput.value;

	// 1) Start with all countries, 2) use filter, then 3) apply search term
	const filteredResults = filterResults(allCountries, regionInput);
	const fullResults = searchResults(filteredResults, searchTerm);

	displayCountries(fullResults);
}

// API fetch
async function fetchCountries() {
	const response = await fetch("https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags");
	const data = await response.json();

	allCountries = data;
	displayCountries(data);
}

function displayCountries(countriesData) {
	countryList.innerHTML = "";

	countriesData.forEach((country) => {
		const li = document.createElement("li");
		li.classList.add("country-item");

		li.innerHTML = `
        <img class="country-flag" src="${country.flags.png}">
        <div class="country-info">
            <h2>${country.name.common}</h2>
			<p><strong>Population</strong>: ${country.population}<p>
			<p><strong>Region</strong>: ${country.region}<p>
			<p><strong>Capital</strong>: ${country.capital?.[0] ?? "N/A"}<p>
        </div>`;

		countryList.appendChild(li);
	});
}

fetchCountries();
