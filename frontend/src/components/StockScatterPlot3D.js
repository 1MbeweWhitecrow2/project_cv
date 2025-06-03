import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

// Lista stocków z Dow Jones (ticker i nazwa)
const dowStocks = [
  { ticker: "AAPL", name: "Apple" },
  { ticker: "AMGN", name: "Amgen" },
  { ticker: "AXP", name: "American Express" },
  { ticker: "BA", name: "Boeing" },
  { ticker: "CAT", name: "Caterpillar" },
  { ticker: "CRM", name: "Salesforce" },
  { ticker: "CSCO", name: "Cisco" },
  { ticker: "CVX", name: "Chevron" },
  { ticker: "DIS", name: "Disney" },
  { ticker: "DOW", name: "Dow" },
  { ticker: "GS", name: "Goldman Sachs" },
  { ticker: "HD", name: "Home Depot" },
  { ticker: "HON", name: "Honeywell" },
  { ticker: "IBM", name: "IBM" },
  { ticker: "INTC", name: "Intel" },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "JPM", name: "JPMorgan Chase" },
  { ticker: "KO", name: "Coca-Cola" },
  { ticker: "MCD", name: "McDonald's" },
  { ticker: "MMM", name: "3M" },
  { ticker: "MRK", name: "Merck" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "NKE", name: "Nike" },
  { ticker: "PG", name: "Procter & Gamble" },
  { ticker: "TRV", name: "Travelers" },
  { ticker: "UNH", name: "UnitedHealth Group" },
  { ticker: "V", name: "Visa" },
  { ticker: "VZ", name: "Verizon" },
  { ticker: "WBA", name: "Walgreens Boots Alliance" },
  { ticker: "WMT", name: "Walmart" }
];

// Funkcja generująca kolor dla danego stocka na podstawie sektora oraz tickera
function getColorForCompany(sector, ticker) {
  let hue;
  const sectorLower = sector ? sector.toLowerCase() : "";
  if (sectorLower.includes("technology")) {
    hue = 0; // czerwony
  } else if (sectorLower.includes("consumer staples")) {
    hue = 240; // niebieski
  } else if (sectorLower.includes("industrials")) {
    hue = 120; // zielony
  } else if (sectorLower.includes("financial")) {
    hue = 300; // purpurowy
  } else if (sectorLower.includes("health")) {
    hue = 60; // żółty
  } else {
    hue = 0; // domyślnie czerwony
  }
  // Prosty hash tickera, by uzyskać różne odcienie
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash += ticker.charCodeAt(i);
  }
  const lightness = 40 + (hash % 40); // wartość między 40% a 79%
  return `hsl(${hue}, 70%, ${lightness}%)`;
}

const StockScatterPlot3D = () => {
  // Domyślnie wybrane tickery: Coca-Cola, Microsoft, Boeing, 3M i IBM
  const [selectedStocks, setSelectedStocks] = useState(["KO", "MSFT", "BA", "MMM", "IBM"]);
  const [scatterData, setScatterData] = useState([]);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const tickersParam = selectedStocks.join(",");
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/scatterplot/?tickers=${tickersParam}`)
      .then((response) => {
        setScatterData(response.data);
      })
      .catch((error) => console.error("Error fetching scatterplot data:", error));
  }, [selectedStocks]);

  // Generujemy tablicę kolorów oraz tekstów do hover dla każdego punktu
  const colors = scatterData.map((d) => getColorForCompany(d.sector, d.ticker));
  const hoverTexts = scatterData.map(
    (d) => `${d.name}<br>Sector: ${d.sector}`
  );

  const handleSelectionChange = (event) => {
    const selected = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    if (selected.length <= 30) {
      setSelectedStocks(selected);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Stock 3D Scatterplot</h2>
      <Plot
        data={[
          {
            x: scatterData.map((d) => d.x),
            y: scatterData.map((d) => d.y),
            z: scatterData.map((d) => d.z),
            mode: "markers",
            type: "scatter3d",
            marker: {
              size: 16, // Zwiększony rozmiar punktów (dwukrotnie większy)
              color: colors
            },
            text: hoverTexts,
            hoverinfo: "text"
          }
        ]}
        layout={{
          title: "Stock Market Clusters (3D)",
          scene: {
            xaxis: { title: "Avg Close Price" },
            yaxis: { title: "Avg Price Range" },
            zaxis: { title: "Avg Volume" }
          }
        }}
        style={{ width: "110%", height: "550px" }}
      />
      <div className="mt-4">
        <label htmlFor="stockSelect" className="mr-2 font-semibold">
          Select Stocks (1 to 30):
        </label>
        <select
          id="stockSelect"
          multiple
          value={selectedStocks}
          onChange={handleSelectionChange}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          {dowStocks.map((stock) => (
            <option
              key={stock.ticker}
              value={stock.ticker}
              style={
                selectedStocks.includes(stock.ticker)
                  ? { color: "red" }
                  : {}
              }
            >
              {stock.name} ({stock.ticker})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showDescription ? "Hide Description" : "How to use/read this plot"}
        </button>

        {showDescription && (
          <div className="p-4 text-sm text-gray-800 leading-relaxed space-y-4 mt-4">
            <p>
              <strong>📌 About This 3D Scatter Plot</strong>
            </p>
            <p>
              This interactive 3D scatter plot visualizes stock market data for selected companies from the Dow Jones index. Each point represents a company and is plotted based on:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li><strong>X-axis:</strong> Average Closing Price</li>
              <li><strong>Y-axis:</strong> Average Daily Price Range (difference between daily high and low)</li>
              <li><strong>Z-axis:</strong> Average Daily Trading Volume</li>
            </ul>
            <p>
              Points are color-coded based on the company's market sector, providing quick visual insight into market clustering by industry.
            </p>
            <p>
              Use the dropdown menu below the plot to select up to 30 stocks from the Dow Jones index. Hover over individual points in the plot to see detailed company information such as the company name and sector.
            </p>
            <p>
              <strong>🔎 Difference From "CreatePortfolio" Scatter Plot:</strong><br />
              This scatter plot differs slightly from the one found in the "Create Portfolio" component. While both visualizations offer insights into stock relationships, this chart uses average price, price volatility, and volume to depict market dynamics, whereas the other scatter plot uses Earnings Per Share (EPS) and other financial metrics. Comparing both can provide deeper insights into stock correlations and market behavior.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockScatterPlot3D;
