import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

// Example S&P 500 Tickers (just a subset for brevity, expand as needed)
const sp500Tickers = [
  { ticker: "AAPL", name: "Apple" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "AMZN", name: "Amazon" },
  { ticker: "GOOGL", name: "Alphabet" },
  { ticker: "TSLA", name: "Tesla" },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "JPM", name: "JPMorgan Chase" },
  { ticker: "META", name: "Meta Platforms" },
  { ticker: "XOM", name: "ExxonMobil" },
  { ticker: "V", name: "Visa" }
];

const tickerMapping = sp500Tickers.reduce((acc, curr) => {
  acc[curr.ticker] = curr.name;
  return acc;
}, {});

const Sp500CandlestickChart = () => {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/stockdata/?ticker=${selectedTicker}`)
      .then((response) => {
        const data = response.data.map((item) => ({
          x: item.date,
          open: item.open_price,
          high: item.high_price,
          low: item.low_price,
          close: item.close_price
        }));
        setChartData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedTicker]);

  const handleTickerChange = (event) => {
    setSelectedTicker(event.target.value);
  };

  return (
    <div>
      <Plot
        data={[
          {
            x: chartData.map((d) => d.x),
            open: chartData.map((d) => d.open),
            high: chartData.map((d) => d.high),
            low: chartData.map((d) => d.low),
            close: chartData.map((d) => d.close),
            type: "candlestick",
            name: "Stock Prices",
            increasing: { line: { color: "green" } },
            decreasing: { line: { color: "red" } }
          }
        ]}
        layout={{
          title: {
            text: `<b>${tickerMapping[selectedTicker]} (${selectedTicker}) 1 Year Candlestick Chart</b>`,
            x: 0.5,
            xanchor: "center"
          },
          xaxis: { type: "date" },
          yaxis: { title: "Stock Price" },
          autosize: true
        }}
        style={{ width: "90%", height: "600px" }}
      />
      <div className="mt-4">
        <label htmlFor="tickerSelect" className="mr-2 font-bold">
          Select Stock:
        </label>
        <select
          id="tickerSelect"
          value={selectedTicker}
          onChange={handleTickerChange}
          className="p-2 border rounded"
        >
          {sp500Tickers.map((stock) => (
            <option key={stock.ticker} value={stock.ticker}>
              {stock.name} ({stock.ticker})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sp500CandlestickChart;


