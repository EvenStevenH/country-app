// get elements
const themeBtn = document.getElementById("themeBtn");
const root = document.documentElement;
const isDark = root.classList.contains("dark-mode");
const searchInput = document.getElementById("search-input");
const filterInput = document.getElementById("filter-input");
const countryList = document.getElementById("country-list");
const inputSection = document.getElementById("input-section");
const countryContainer = document.getElementById("country-container");
const countryDetail = document.getElementById("country-detail");

// set up list and reset inputs
let allCountries = [];
searchInput.value = "";
filterInput.value = "";

// light/dark mode
themeBtn.setAttribute("aria-checked", isDark);
themeBtn.innerHTML = isDark ? `<span class="material-symbols-outlined">wb_sunny</span> Light Mode` : `<span class="material-symbols-outlined">bedtime</span> Dark Mode`;
themeBtn.addEventListener("click", () => {
	const nowDark = root.classList.toggle("dark-mode");

	themeBtn.setAttribute("aria-checked", nowDark);
	themeBtn.innerHTML = nowDark ? `<span class="material-symbols-outlined">wb_sunny</span> Light Mode` : `<span class="material-symbols-outlined">bedtime</span> Dark Mode`;
	localStorage.setItem("theme", nowDark ? "dark" : "light");
});

// update list if any input is given
searchInput.addEventListener("input", updateFullResults);
filterInput.addEventListener("change", updateFullResults);

function filterResults(countryData, region) {
	if (!region) return countryData; // shows all countries if no region is selected
	return countryData.filter((country) => country.region.toLowerCase().includes(region.toLowerCase().trim()));
}

function searchResults(countryData, searchQuery) {
	return countryData.filter((country) => country.name.common.toLowerCase().includes(searchQuery.toLowerCase().trim()));
}

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
	const response = await fetch("https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,subregion,languages,tld,currencies,borders");
	const data = await response.json();

	allCountries = data;
	displayCountries(data);
}

// home page
function displayCountries(countryData) {
	countryList.innerHTML = "";

	countryData.forEach((country) => {
		const li = document.createElement("li");
		li.classList.add("country-item");

		li.innerHTML = `

			<img class="country-flag" src="${country.flags.png}" alt="${country.flags.alt}">
			<div class="country-info">
				<h2>${country.name.common}</h2>
				<p><strong>Population</strong>: ${country.population.toLocaleString()}</p>
				<p><strong>Region</strong>: ${country.region}</p>
				<p><strong>Capital</strong>: ${country.capital?.[0] ?? "N/A"}</p>
			</div>`;

		li.addEventListener("click", () => {
			inputSection.style.display = "none";
			countryList.style.display = "none";
			countryContainer.style.display = "block";

			displayCountryInfo(country);
		});

		countryList.appendChild(li);
	});
}

// country info
function displayCountryInfo(country) {
	countryDetail.innerHTML = "";
	countryDetail.innerHTML = `
        <img class="country-flag" src="${country.flags.png}" alt="${country.flags.alt}">

        <div class="country-info">
            <h2>${country.name.common}</h2>
			
			<ul>
				<li><strong>Native Name</strong>: ${Object.values(country.name.nativeName ?? {})[0]?.common || "N/A"}</li>
				<li><strong>Population</strong>: ${country.population.toLocaleString() || "N/A"}</li>
				<li><strong>Region</strong>: ${country.region || "N/A"}</li>
				<li><strong>Sub Region</strong>: ${country.subregion || "N/A"}</li>
				<li><strong>Capital</strong>: ${country.capital?.[0] || "N/A"}</li>
				<li><strong>Top Level Domain</strong>: ${country.tld?.[0] || "N/A"}</li>
				<li><strong>Currencies</strong>: ${
					Object.values(country.currencies)
						.map((currency) => currency.name)
						.join(", ") || "N/A"
				}</li>
				<li><strong>Languages</strong>: ${Object.values(country.languages).join(", ") || "N/A"}</li>
			</ul>

        	<div class="border-countries">
				<strong>Border Countries</strong>: ${country.borders.join(", ") || "N/A"}
			</div>
        </div>`;
}

backBtn.addEventListener("click", () => {
	inputSection.style.display = "flex";
	countryList.style.display = "grid";
	countryContainer.style.display = "none";
});

fetchCountries();
