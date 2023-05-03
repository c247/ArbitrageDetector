# ArbitrageDetector
This program web-scrapes exchange rates for currencies and runs a modification of the bellman-ford algorithm to detect for negative-weight cycles. The graph G has currencies as its verticies and the edge weight betwen two currencies is modifided to not be the actual exchange rate, but the inverse log of it.


![demo](./demo.PNG)
