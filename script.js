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

// light/dark and back buttons
function updateThemeButton(isDark) {
	themeBtn.textContent = "";

	const icon = document.createElement("span");
	icon.className = "material-symbols-outlined";
	icon.innerText = isDark ? "wb_sunny" : "bedtime";

	themeBtn.append(icon, isDark ? " Light Mode" : " Dark Mode");
	themeBtn.setAttribute("aria-checked", isDark);
}

backBtn.addEventListener("click", () => {
	inputSection.style.display = "flex";
	countryList.style.display = "grid";
	countryContainer.style.display = "none";
});

themeBtn.addEventListener("click", () => {
	const nowDark = root.classList.toggle("dark-mode");
	updateThemeButton(nowDark);
	localStorage.setItem("theme", nowDark ? "dark" : "light");
});

themeBtn.setAttribute("aria-checked", isDark);
updateThemeButton(isDark);

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
	try {
		const response = await fetch("https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,subregion,languages,tld,currencies,borders");

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data = await response.json();
		allCountries = data;
		displayCountries(data);
	} catch (error) {
		console.error("Failed to fetch countries:", error);

		countryList.textContent = "";
		const errorMsg = document.createElement("p");
		errorMsg.className = "error-message";
		errorMsg.innerText = "Unable to load country data.";

		countryList.appendChild(errorMsg);
	}
}

// DOM utility helpers
function createTextElement(tag, text, className) {
	const element = document.createElement(tag);
	element.innerText = text;
	if (className) element.className = className;
	return element;
}

function createLabel(labelText, valueText) {
	const li = document.createElement("li");
	const strong = document.createElement("strong");
	strong.innerText = labelText;

	li.append(strong, `: ${valueText}`);
	return li;
}

// home page
function displayCountries(countryData) {
	countryList.textContent = "";

	countryData.forEach((country) => {
		const li = document.createElement("li");
		li.className = "country-item";

		const img = document.createElement("img");
		img.className = "country-flag";
		img.src = country.flags.png;
		img.alt = country.flags.alt || `${country.name.common} flag`;

		const info = document.createElement("div");
		info.className = "country-info";

		info.append(createTextElement("h2", country.name.common), createTextElement("p", `Population: ${country.population.toLocaleString()}`), createTextElement("p", `Region: ${country.region}`), createTextElement("p", `Capital: ${country.capital?.[0] ?? "N/A"}`));

		li.append(img, info);

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
	countryDetail.textContent = "";

	const img = document.createElement("img");
	img.className = "country-flag";
	img.src = country.flags.png;
	img.alt = country.flags.alt || `${country.name.common} flag`;

	const info = document.createElement("div");
	info.className = "country-info";

	const title = createTextElement("h2", country.name.common);

	const list = document.createElement("ul");

	list.append(
		createLabel("Native Name", Object.values(country.name.nativeName ?? {})[0]?.common || "N/A"),
		createLabel("Population", country.population.toLocaleString()),
		createLabel("Region", country.region || "N/A"),
		createLabel("Sub Region", country.subregion || "N/A"),
		createLabel("Capital", country.capital?.[0] || "N/A"),
		createLabel("Top Level Domain", country.tld?.[0] || "N/A"),
		createLabel(
			"Currencies",
			Object.values(country.currencies ?? {})
				.map((c) => c.name)
				.join(", ") || "N/A",
		),
		createLabel("Languages", Object.values(country.languages ?? {}).join(", ") || "N/A"),
	);

	// border countries
	const bordersContainer = document.createElement("div");
	bordersContainer.className = "border-countries";

	const borderLabel = document.createElement("strong");
	borderLabel.innerText = "Border Countries: ";
	bordersContainer.appendChild(borderLabel);

	if (country.borders?.length) {
		country.borders.forEach((border) => {
			const span = document.createElement("span");
			span.className = "bordering-country";
			span.innerText = border;
			bordersContainer.appendChild(span);
		});
	} else {
		const none = document.createElement("span");
		none.innerText = " N/A";
		bordersContainer.appendChild(none);
	}

	info.append(title, list, bordersContainer);
	countryDetail.append(img, info);
}

// show all countries on start
fetchCountries();
