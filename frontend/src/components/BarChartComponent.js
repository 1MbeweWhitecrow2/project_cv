import React from "react";
import Plot from "react-plotly.js";

// Helper function to generate random pastel colors
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};

const BarChartComponent = ({ selectedStocks }) => {
  if (!selectedStocks || selectedStocks.length === 0) {
    return <div className="text-center p-4">No stocks selected.</div>;
  }

  // Count occurrences of each sector
  const sectorCounts = selectedStocks.reduce((acc, stock) => {
    acc[stock.sector] = (acc[stock.sector] || 0) + 1;
    return acc;
  }, {});

  const sectors = Object.keys(sectorCounts);
  const counts = Object.values(sectorCounts);

  // Generate a unique color for each sector
  const sectorColors = sectors.map(() => generateRandomColor());

  return (
    <div className="border rounded-xl p-4 transition-transform hover:scale-110">
      <Plot
        data={[
          {
            x: sectors,
            y: counts,
            type: "bar",
            marker: { color: sectorColors },
          },
        ]}
        layout={{
          title: "Stock Sectors (Bar Chart)",
          xaxis: { title: "Sector" },
          yaxis: { title: "Number of Stocks" },
          autosize: true,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default BarChartComponent;




