import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const CorrelationHeatmap = () => {
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/correlation/`)
            .then(response => {
                setHeatmapData(response.data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Correlation Heatmap</h2>
            <Plot
                data={[
                    {
                        z: heatmapData, 
                        type: "heatmap",
                        colorscale: "Viridis",
                    }
                ]}
                layout={{ title: "Stock Correlation Heatmap" }}
                style={{ width: "100%", height: "400px" }}
            />
        </div>
    );
};

export default CorrelationHeatmap;
