import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponent";
import ScatterPlot3DComponent from "./ScatterPlot3DComponent";
import HeatmapComponent from "./HeatmapComponent";

const DEFAULT_TICKERS = ["KO", "PG", "PEP", "MSFT", "BRK-B", "GS"];

const CreatePortfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [showDescription, setShowDescription] = useState(false); // 🆕 Description toggle

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stocks/`).then((response) => {
      const stocksData = response.data.map((stock) => ({
        value: stock.ticker,
        label: `${stock.ticker} - ${stock.name}`,
        sector: stock.sector,
      }));
      setStocks(stocksData);

      // Set default selected stocks
      const defaultSelected = stocksData.filter(stock =>
        DEFAULT_TICKERS.includes(stock.value)
      );
      setSelectedStocks(defaultSelected);
    });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main menu above charts */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <Select
          isMulti
          options={stocks}
          value={selectedStocks}
          onChange={setSelectedStocks}
          placeholder="Search for S&P 500 stocks"
          className="w-1/2"
        />
      </div>

      {/* Pie and Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="transition-transform hover:scale-125 border p-2 rounded-xl shadow">
          <PieChartComponent selectedStocks={selectedStocks} />
        </div>
        <div className="transition-transform hover:scale-125 border p-2 rounded-xl shadow">
          <BarChartComponent selectedStocks={selectedStocks} />
        </div>
      </div>

      {/* Scatter Plot and Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="transition-transform hover:scale-125 border p-2 rounded-xl shadow">
          <ScatterPlot3DComponent selectedStocks={selectedStocks} />
        </div>
        <div className="transition-transform hover:scale-125 border p-2 rounded-xl shadow">
          <HeatmapComponent selectedStocks={selectedStocks} />
        </div>
      </div>

      {/* How to use description */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showDescription ? "Hide description" : "How to use this page"}
        </button>

        {showDescription && (
          <div className="mt-4 p-4 text-sm text-gray-800 leading-relaxed space-y-4">
            <p>
              <strong>📈 How to use this page</strong>
            </p>

            <p>
              This section is intended to guide users in effectively creating and analyzing their stock portfolios. Here, you can select various S&P 500 stocks and explore their sector distributions, correlations, and other financial insights through interactive charts.
            </p>

            <p>
              <strong>1. Selecting Stocks</strong><br />
              Use the search bar above to find and add stocks to your portfolio. You can type a company's name or ticker symbol directly into the selection menu.
            </p>

            <p>
              <strong>2. Portfolio Visualization</strong><br />
              The page provides four different types of visualizations:
            </p>

            <ul className="list-disc list-inside ml-4">
              <li><strong>Pie Chart:</strong> Shows the sector proportions of your selected stocks.</li>
              <li><strong>Bar Chart:</strong> Represents the same sector data visually with bars.</li>
              <li><strong>3D Scatter Plot:</strong> Displays three-dimensional relationships and correlations between your selected stocks based on key financial metrics.</li>
              <li><strong>Heatmap:</strong> Highlights correlation strength between selected stocks, helping you see potential diversification or concentration issues.</li>
            </ul>

            <p>
              <strong>3. Interactive Features</strong><br />
              Hovering over each chart will enlarge it, allowing you to examine details more clearly.
            </p>

            <p>
              Use these tools to make informed decisions about your investment strategy and portfolio management.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePortfolio;


