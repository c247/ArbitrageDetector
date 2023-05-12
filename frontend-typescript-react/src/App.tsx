import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './vite.svg';
import './App.css';

function App() {
  const [rates, setRates] = useState<any>({});

  useEffect(() => {
    async function fetchRates() {
      const response = await fetch('http://localhost:5000/get_rates');
      const data = await response.json();
      setRates(data);
    }

    fetchRates();

    // Call fetchRates() every 30 seconds
    const intervalId = setInterval(fetchRates, 30000);

    // Clean up the interval
    return () => clearInterval(intervalId);
  }, []);

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
              {currency.replace('-', '> ')} : {rates[currency]}
            </li>
          ))}
        </ul>
      </div>
      {hasNegativeCycle() ? (
        <p>A negative cycle exists in the graph.</p>
      ) : (
        <p>No negative cycle exists in the graph.</p>
      )}
    </>
  );
}

export default App;
