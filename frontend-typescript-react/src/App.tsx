import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import reactLogo from "./assets/react.svg";
import viteLogo from "./vite.svg";
import "./App.css";

function App() {
  const [rates, setRates] = useState<any>({});
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRates() {
      const response = await fetch("http://127.0.0.1:5000/get_rates");
      const data = await response.json();
      setRates(data);
    }

    fetchRates();

    // Call fetchRates() every 30 seconds
    const intervalId = setInterval(fetchRates, 30000);

    // Clean up the interval
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Check if rates data is available
    if (Object.keys(rates).length === 0) {
      return;
    }

    // Clear previous graph
    d3.select(graphRef.current).selectAll("*").remove();

    // Create a new graph
    const svg = d3
      .select(graphRef.current)
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    const keys = Object.keys(rates);
    const values = Object.values(rates);

    // Create scales
    const xScale = d3.scaleBand().domain(keys).range([0, 400]).padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values) || 0])
      .range([300, 0]);

    // Create bars
    svg
      .selectAll("rect")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d) || 0)
      .attr("y", (d) => yScale(rates[d]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => 300 - yScale(rates[d]))
      .attr("fill", "steelblue");
  }, [rates]);

  function hasNegativeCycle() {
    const nodes = Object.keys(rates);
    const edges = [];

    // Build the edge list
    for (let i = 0; i < nodes.length; i++) {
      const fromNode = nodes[i];
      const fromNodeRates = rates[fromNode];
      for (let j = 0; j < nodes.length; j++) {
        const toNode = nodes[j];
        const toNodeRate = rates[toNode];
        if (fromNodeRates.hasOwnProperty(toNode)) {
          edges.push([fromNode, toNode, -Math.log(fromNodeRates[toNode])]);
        }
      }
    }

    // Run the Bellman-Ford algorithm
    const dist = {};
    const prev = {};
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      dist[node] = Infinity;
      prev[node] = null;
    }

    dist[nodes[0]] = 0;

    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = 0; j < edges.length; j++) {
        const [fromNode, toNode, weight] = edges[j];
        if (dist[fromNode] + weight < dist[toNode]) {
          dist[toNode] = dist[fromNode] + weight;
          prev[toNode] = fromNode;
        }
      }
    }

    // Check for negative cycle
    for (let i = 0; i < edges.length; i++) {
      const [fromNode, toNode, weight] = edges[i];
      if (dist[fromNode] + weight < dist[toNode]) {
        return true;
      }
    }

    return false;
  }

  return (
    <>
      <h1>Currency Map</h1>
      <div className="card">
        <h2>Currency Rates</h2>
        <ul>
          {Object.entries(rates).map(([currency, rate]) => (
            <li key={currency}>
              {currency.replace("-", "> ")} : {rates[currency]}
            </li>
          ))}
        </ul>
      </div>
      <div className="graph-container" ref={graphRef}></div>
      {hasNegativeCycle() ? (
        <p>A negative cycle exists in the graph.</p>
      ) : (
        <p>No negative cycle exists in the graph.</p>
      )}
    </>
  );
}

export default App;
