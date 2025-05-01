import React, { useMemo } from "react";
import Plot from "react-plotly.js";

const PieChartComponent = ({ selectedStocks }) => {
  const sectorData = useMemo(() => {
    const sectorCounts = {};
    selectedStocks.forEach((stock) => {
      if (sectorCounts[stock.sector]) {
        sectorCounts[stock.sector] += 1;
      } else {
        sectorCounts[stock.sector] = 1;
      }
    });
    return {
      labels: Object.keys(sectorCounts),
      values: Object.values(sectorCounts),
    };
  }, [selectedStocks]);

  if (selectedStocks.length === 0) return <div className="text-center p-4">No stocks selected.</div>;

  return (
    <div className="transition-transform hover:scale-110 duration-300 border p-2 rounded-xl shadow-xl">
      <Plot
        data={[
          {
            type: "pie",
            labels: sectorData.labels,
            values: sectorData.values,
            textinfo: "label+percent",
            hoverinfo: "label+percent+value",
          },
        ]}
        layout={{
          title: "Sector Proportions",
          autosize: true,
          showlegend: true,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default PieChartComponent;

