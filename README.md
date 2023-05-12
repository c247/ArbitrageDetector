# ArbitrageDetector
This program web-scrapes exchange rates for currencies and runs a modification of the bellman-ford algorithm to detect for negative-weight cycles. The graph G has currencies as its verticies and the edge weight betwen two currencies is modifided to not be the actual exchange rate, but the inverse log of it. If there exists a negative weight cycle in the graph, then there exists an arbitrage opportunity!

### How it Works
- The backend is a Python Flask application that uses BeautifulSoup to scrape excahnge rates between currencies from the Web and creates an api route that relays this data
- The frontend is a Typescript React application that runs the Arbitrage detection algorithm and displays results to the user. It actively updates results every 30seconds - utilizing the api created above.
## Steps To Run

###  Backend

- Go to cool coolarbitrage folder
- run
```
python main.py
```
- This will create a Flask API running on localhost:5000

### Frontend
- Go to my-vite-app folder
- run
```
npm run dev
```

### Enjoy - the App.tsx file contains the bellman-ford logic to detect arbitrages


![demo](./demo.PNG)
