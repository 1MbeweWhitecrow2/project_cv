import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const ScatterPlot3DComponent = ({ selectedStocks }) => {
  const [stockDetails, setStockDetails] = useState([]);

  useEffect(() => {
    if (selectedStocks.length > 0) {
      const fetchDetails = async () => {
        const responses = await Promise.all(
          selectedStocks.map(stock =>
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stockdata/?ticker=${stock.value}`)
              .then(res => ({
                ticker: stock.value,
                name: stock.label.split(" - ")[1],
                sector: stock.sector || "Unknown",
                data: res.data,
              }))
          )
        );

        // Process and average data for 3D scatter plot using EPS, Close Price, Volume
        const processed = responses.map(stock => {
          const avgEPS = stock.data.reduce((sum, d) => sum + parseFloat(d.eps), 0) / stock.data.length;
          const avgClose = stock.data.reduce((sum, d) => sum + d.close_price, 0) / stock.data.length;
          const avgVolume = stock.data.reduce((sum, d) => sum + d.volume, 0) / stock.data.length;

          return {
            ticker: stock.ticker,
            name: stock.name,
            sector: stock.sector,
            avgEPS,
            avgClose,
            avgVolume,
          };
        });

        setStockDetails(processed);
      };

      fetchDetails();
    }
  }, [selectedStocks]);

  return (
    <div className="transition-transform duration-300 hover:scale-110 border p-2 rounded-xl shadow-xl">
      <h3 className="text-center font-semibold mb-2">3D Scatter Plot (Avg EPS, Close, Volume)</h3>
      <Plot
        data={[
          {
            x: stockDetails.map(d => d.avgEPS),
            y: stockDetails.map(d => d.avgClose),
            z: stockDetails.map(d => d.avgVolume),
            text: stockDetails.map(d => `${d.name} (${d.sector})`),
            mode: "markers",
            marker: {
              size: 8,
              color: stockDetails.map((_, i) => i),
              colorscale: "Viridis",
            },
            type: "scatter3d",
          },
        ]}
        layout={{
          autosize: true,
          scene: {
            xaxis: { title: "Avg EPS" },
            yaxis: { title: "Avg Close Price" },
            zaxis: { title: "Avg Volume" },
          },
          margin: { l: 0, r: 0, b: 0, t: 20 },
        }}
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
};

export default ScatterPlot3DComponent;
