import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const HeatmapComponent = ({ selectedStocks }) => {
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      if (selectedStocks.length > 1) {
        const allData = await Promise.all(
          selectedStocks.map(stock =>
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stockdata/?ticker=${stock.value}`)
              .then(res => ({
                ticker: stock.value,
                closePrices: res.data
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(entry => entry.close_price)
              }))
          )
        );

        // Build DataFrame-like structure in JS
        const priceMatrix = {};
        allData.forEach(item => {
          priceMatrix[item.ticker] = item.closePrices.slice(-365); // Last year data
        });

        const tickers = Object.keys(priceMatrix);
        const matrix = tickers.map(rowTicker =>
          tickers.map(colTicker => {
            const rowData = priceMatrix[rowTicker];
            const colData = priceMatrix[colTicker];
            return computeCorrelation(rowData, colData);
          })
        );

        setCorrelationData({
          z: matrix,
          x: tickers,
          y: tickers
        });
      } else {
        setCorrelationData(null);
      }
    };

    fetchStockData();
  }, [selectedStocks]);

  const computeCorrelation = (x, y) => {
    const n = x.length;
    const avgX = x.reduce((a, b) => a + b, 0) / n;
    const avgY = y.reduce((a, b) => a + b, 0) / n;
    const numerator = x.reduce((sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY), 0);
    const denominator = Math.sqrt(
      x.reduce((sum, xi) => sum + (xi - avgX) ** 2, 0) *
      y.reduce((sum, yi) => sum + (yi - avgY) ** 2, 0)
    );
    return denominator === 0 ? 0 : numerator / denominator;
  };

  return (
    <div className="border p-2 rounded transition-transform hover:scale-110">
      <h3 className="text-center font-semibold mb-2">Correlation Heatmap</h3>
      {correlationData ? (
        <Plot
          data={[
            {
              z: correlationData.z,
              x: correlationData.x,
              y: correlationData.y,
              type: "heatmap",
              colorscale: "Viridis",
              zmin: -1,
              zmax: 1,
              hoverongaps: false,
            },
          ]}
          layout={{
            autosize: true,
            height: 400,
            margin: { t: 40 },
          }}
          style={{ width: "100%", height: "400px" }}
        />
      ) : (
        <p className="text-center">Select at least two stocks to see the correlation heatmap.</p>
      )}
    </div>
  );
};

export default HeatmapComponent;
