import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import Select from "react-select";

const Charts = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState({ value: "AAPL", label: "AAPL - Apple" });
  const [chartData, setChartData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("1y");
  const [chartType, setChartType] = useState("candlestick");
  const [fundamentalOptions, setFundamentalOptions] = useState([]);
  const [compareStocks, setCompareStocks] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [showDescription, setShowDescription] = useState(false); // 👈 New state for description toggle

  const fundamentalChoices = [
    { value: "dividend_per_share", label: "Dividend" },
    { value: "eps", label: "Earnings Per Share (EPS)" },
  ];

  // Load available stocks
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/stocks/").then((response) => {
      const stocksData = response.data.map((stock) => ({
        value: stock.ticker,
        label: `${stock.ticker} - ${stock.name}`,
      }));
      setStocks(stocksData);
    });
  }, []);

  // Load stock data or comparison data
  useEffect(() => {
    const fetchData = async () => {
      if (compareStocks.length === 0) {
        const response = await axios.get(`http://127.0.0.1:8000/api/stockdata/?ticker=${selectedTicker.value}`);
        setChartData(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } else {
        const responses = await Promise.all(
          compareStocks.map(stock =>
            axios.get(`http://127.0.0.1:8000/api/stockdata/?ticker=${stock.value}`).then(res => ({
              ticker: stock.label,
              data: res.data.sort((a, b) => new Date(a.date) - new Date(b.date)),
            }))
          )
        );
        setComparisonData(responses);
      }
    };
    fetchData();
  }, [selectedTicker, compareStocks]);

  // Filter by time range
  const filteredData = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - parseInt(timeFrame));
    return chartData.filter(item => new Date(item.date) >= startDate && item.close_price > 0);
  }, [chartData, timeFrame]);

  // Main chart trace
  const mainTrace = useMemo(() => {
    return chartType === "candlestick" ? {
      type: "candlestick",
      x: filteredData.map(d => d.date),
      open: filteredData.map(d => d.open_price),
      high: filteredData.map(d => d.high_price),
      low: filteredData.map(d => d.low_price),
      close: filteredData.map(d => d.close_price),
      name: selectedTicker.label,
      increasing: { line: { color: "green" } },
      decreasing: { line: { color: "red" } },
    } : {
      type: "scatter",
      mode: "lines",
      x: filteredData.map(d => d.date),
      y: filteredData.map(d => d.close_price),
      name: selectedTicker.label,
      line: { color: "black" },
    };
  }, [filteredData, chartType, selectedTicker]);

  // Fundamental overlay traces
  const fundamentalTraces = useMemo(() => fundamentalOptions.map(opt => {
    const fundamentalData = filteredData.filter(d => d[opt.value] > 0);
    return {
      type: "scatter",
      mode: "lines+markers",
      x: fundamentalData.map(d => d.date),
      y: fundamentalData.map(d => d[opt.value]),
      name: opt.label,
      yaxis: "y2",
      line: { color: opt.value === "dividend_per_share" ? "blue" : "green" },
    };
  }), [filteredData, fundamentalOptions]);

  // Multi-stock comparison traces
  const comparisonTraces = comparisonData.map(stock => {
    const validData = stock.data.filter(d => d.close_price > 0);
    return {
      type: "scatter",
      mode: "lines",
      x: validData.map(d => d.date),
      y: validData.map(d => d.close_price),
      name: stock.ticker,
    };
  });

  const chartTitle = useMemo(() => `${timeFrame} Chart of ${selectedTicker.label}`, [timeFrame, selectedTicker]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">{chartTitle}</h2>
      
      {/* Plot */}
      <Plot
        data={compareStocks.length === 0 ? [mainTrace, ...fundamentalTraces] : comparisonTraces}
        layout={{
          xaxis: { title: "Date" },
          yaxis: { title: "Price" },
          yaxis2: { overlaying: "y", side: "right", title: "Dividend/EPS" },
          autosize: true,
        }}
        style={{ width: "100%", height: "600px" }}
      />

      {/* Controls */}
      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          {['1y', '2y', '5y', '10y'].map(tf => (
            <button
              key={tf}
              className={`px-3 py-1 border rounded ${timeFrame === tf ? 'bg-gray-300' : ''}`}
              onClick={() => setTimeFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        <button
          onClick={() => setChartType(prev => prev === "candlestick" ? "line" : "candlestick")}
          className="px-3 py-1 border rounded"
        >
          {chartType === "candlestick" ? "Change to Line Chart" : "Change to Candlestick"}
        </button>

        <Select
          isMulti
          options={fundamentalChoices}
          onChange={setFundamentalOptions}
          placeholder="Add Fundamental Data"
          className="min-w-[200px]"
        />
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center gap-2">
          <Select
            options={stocks}
            onChange={setSelectedTicker}
            placeholder="Select Stock"
            className="min-w-[250px]"
          />
          <span className="font-semibold">Choose or search stock</span>
        </div>

        <Select
          isMulti
          options={stocks}
          onChange={setCompareStocks}
          placeholder="Compare Stocks"
          className="min-w-[250px]"
        />
      </div>

      {/* 🆕 Description toggle button + section */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showDescription ? "Hide description" : "How to use/read this chart"}
        </button>

        {showDescription && (
          <div className="p-4 text-sm text-gray-800 leading-relaxed space-y-4">
          <p>
            <strong>📊 How to Use and Read This Chart</strong>
          </p>
        
          <p>
            This guide is primarily intended for users who are unfamiliar with reading stock charts and interpreting company performance through financial data. Its purpose is to explain how to read the chart itself and how to use the interactive features built into this tool.
          </p>
        
          <p>
            <strong>🔍 Selecting a Company</strong><br />
            Use the <strong>"Select Stock"</strong> menu to search for a company by name or its ticker symbol — a short code representing the company on the stock market. The dropdown contains all companies currently included in the <strong>S&amp;P 500 index</strong>, which represents the 500 largest publicly traded U.S. companies.
          </p>
        
          <p>
            <strong>📅 Adjusting the Timeframe</strong><br />
            You can view the chart over different time spans by clicking one of the timeframe buttons:
          </p>
        
          <ul className="list-disc list-inside ml-4">
            <li><strong>1y</strong> – last 1 year</li>
            <li><strong>2y</strong> – last 2 years</li>
            <li><strong>5y</strong> – last 5 years</li>
            <li><strong>10y</strong> – last 10 years</li>
          </ul>
        
          <p>
            <strong>📈 Chart Types</strong><br />
            By default, the chart is displayed as a <strong>Candlestick Chart</strong>, where:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li><span className="text-green-600 font-medium">Green candles</span> indicate a price increase,</li>
            <li><span className="text-red-600 font-medium">Red candles</span> indicate a price decrease.</li>
          </ul>
        
          <p>
            You can switch to a simpler <strong>Line Chart</strong> by clicking the <strong>"Change to Line Chart"</strong> button.
          </p>
        
          <p>
            <strong>💡 Adding Fundamental Insights</strong><br />
            Use the <strong>"Add Fundamental Data"</strong> menu to overlay two critical metrics:
          </p>
        
          <ul className="list-disc list-inside ml-4">
            <li><strong>Earnings Per Share (EPS)</strong></li>
            <li><strong>Dividend Per Share</strong></li>
          </ul>
        
          <p>
            <span className="italic text-gray-600">
              Note: If a company does not pay dividends (e.g., Berkshire Hathaway), the dividend value will be 0.
            </span>
          </p>
        
          <p>
            Even a brief glance at several company charts should reveal that <strong>EPS is a key driver of stock price</strong>. Understanding EPS can help you avoid many fundamental mistakes — especially common among new investors who ignore fundamental analysis and rely solely on price movements or technical tools.
          </p>
        
          <p>
            This can result in companies that are experiencing financial trouble (or even heading toward bankruptcy) appearing deceptively attractive simply because their stock is "cheap".
          </p>
        
          <p>
            <strong>🧪 Suggested Exercise</strong><br />
            Try comparing the following two companies:
          </p>
        
          <ul className="list-decimal list-inside ml-4">
            <li>
              <strong>Microsoft</strong> – Observe its stock price trend, consistent <strong>EPS growth</strong>, and rising <strong>dividends</strong>.
            </li>
            <li>
              <strong>CVS Health</strong> – Analyze its price, EPS, and dividend trends, and ask:
              <ul className="list-disc ml-6 mt-1">
                <li>
                  Is increasing dividends while EPS falls a smart financial policy — or a desperate attempt to attract investors despite trouble?
                </li>
                <li>
                  Is the price drop an opportunity to buy, or a sign of real financial weakness?
                </li>
              </ul>
            </li>
          </ul>
        
          <p>
            <strong>📊 Comparing Stocks</strong><br />
            Use the <strong>"Compare Stocks"</strong> menu to visually compare two or more companies on the same chart.
          </p>
        </div>
        
        )}
      </div>
    </div>
  );
};

export default Charts;

