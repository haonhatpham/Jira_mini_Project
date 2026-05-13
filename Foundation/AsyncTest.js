// Select the containers where fetched data will be displayed
const weatherContainer = document.querySelector("#weather .content");
const cryptoContainer = document.querySelector("#crypto .content");
const quoteContainer = document.querySelector("#quote .content");

// Utility function: wait for a number of milliseconds
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Fetch JSON from an API URL with retry logic and exponential backoff
async function fetchWithRetry(url, options = {}, retries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed:`, error.message);

      // If this was the last attempt, rethrow the error
      if (attempt === retries - 1) {
        throw error;
      }

      // Otherwise wait longer before retrying
      const backoffDelay = baseDelay * 2 ** attempt;
      console.log(`Retrying in ${backoffDelay}ms`);
      await delay(backoffDelay);
    }
  }
}

// Fetch current weather data from the API 1
async function fetchWeather() {
  const data = await fetchWithRetry(
    "https://api.open-meteo.com/v1/forecast?latitude=10.82&longitude=106.63&current_weather=true"
  );

  return data.current_weather;
}

// Fetch Bitcoin price data from the API2
async function fetchCrypto() {
  // Simulate failure for the second API request
  throw new Error("Simulated crypto API failure");
}

// Fetch a random quote from the API 3
async function fetchQuote() {
  // Use a local quote so the third section always succeeds in this demo.
  return {
    content: "Keep it simple and clear.",
    author: "Demo"
  };
}

// Render weather data into the weather container
function renderWeather(data) {
  weatherContainer.classList.remove("skeleton");
  weatherContainer.innerHTML = `
    <p>Temperature: ${data.temperature}°C</p>
    <p>Wind Speed: ${data.windspeed} km/h</p>
  `;
}

// Render crypto data into the crypto container
function renderCrypto(data) {
  cryptoContainer.classList.remove("skeleton");
  cryptoContainer.innerHTML = `
    <p>Bitcoin Price:</p>
    <h3>$${data.usd}</h3>
  `;
}

// Render quote data into the quote container
function renderQuote(data) {
  quoteContainer.classList.remove("skeleton");
  quoteContainer.innerHTML = `
    <p>"${data.content}"</p>
    <br>
    <strong>- ${data.author}</strong>
  `;
}

// Show a friendly error message if a fetch fails
function renderError(container, message) {
  container.classList.remove("skeleton");
  container.innerHTML = `
    <p class="error">${message}</p>
  `;
}

// Load all dashboard data in parallel and show results when ready
async function loadDashboard() {
  const results = await Promise.allSettled([
    fetchWeather(),
    fetchCrypto(),
    fetchQuote(),
  ]);

  const [weather, crypto, quote] = results;

  if (weather.status === "fulfilled") {
    renderWeather(weather.value);
  } else {
    renderError(weatherContainer, "Fail");
  }

  if (crypto.status === "fulfilled") {
    renderCrypto(crypto.value);
  } else {
    renderError(cryptoContainer, "Fail");
  }

  if (quote.status === "fulfilled") {
    renderQuote(quote.value);
  } else {
    renderError(quoteContainer, "Fail");
  }
}

// Start loading the dashboard when the script runs
loadDashboard();