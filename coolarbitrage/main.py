from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

currency_codes = {
    "US Dollar": "USD",
    "Argentine Peso": "ARS",
    "Australian Dollar": "AUD",
    "Bahraini Dinar": "BHD",
    "Botswana Pula": "BWP",
    "Brazilian Real": "BRL",
    "British Pound": "GBP",
    "Bruneian Dollar": "BND",
    "Bulgarian Lev": "BGN",
    "Canadian Dollar": "CAD",
    "Chilean Peso": "CLP",
    "Chinese Yuan Renminbi": "CNY",
    "Colombian Peso": "COP",
    "Czech Koruna": "CZK",
    "Danish Krone": "DKK",
    "Emirati Dirham": "AED",
    "Euro": "EUR",
    "Hong Kong Dollar": "HKD",
    "Hungarian Forint": "HUF",
    "Icelandic Krona": "ISK",
    "Indian Rupee": "INR",
    "Indonesian Rupiah": "IDR",
    "Iranian Rial": "IRR",
    "Israeli Shekel": "ILS",
    "Japanese Yen": "JPY",
    "Kazakhstani Tenge": "KZT",
    "Kuwaiti Dinar": "KWD",
    "Libyan Dinar": "LYD",
    "Malaysian Ringgit": "MYR",
    "Mauritian Rupee": "MUR",
    "Mexican Peso": "MXN",
    "Nepalese Rupee": "NPR",
    "New Zealand Dollar": "NZD",
    "Norwegian Krone": "NOK",
    "Omani Rial": "OMR",
    "Pakistani Rupee": "PKR",
    "Philippine Peso": "PHP",
    "Polish Zloty": "PLN",
    "Qatari Riyal": "QAR",
    "Romanian New Leu": "RON",
    "Russian Ruble": "RUB",
    "Saudi Arabian Riyal": "SAR",
    "Singapore Dollar": "SGD",
    "South African Rand": "ZAR",
    "South Korean Won": "KRW",
    "Sri Lankan Rupee": "LKR",
    "Swedish Krona": "SEK",
    "Swiss Franc": "CHF",
    "Taiwan New Dollar": "TWD",
    "Thai Baht": "THB",
    "Trinidadian Dollar": "TTD",
    "Turkish Lira": "TRY",
    "Venezuelan Bolivar": "VEF"
}

currencies = ['USD', 'CAD', 'JPY'] # initialize currencies you are interested in monitoring

@app.route('/get_rates')
def get_rates():
    # Initialize an empty dictionary to store the rates
    rates = {}

    for currency in currencies:
        # Set the URL to scrape
        url = f'https://www.x-rates.com/table/?from={currency}&amount=1'

        # Send a GET request to the URL
        response = requests.get(url)

        # Use BeautifulSoup to parse the HTML content of the page
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the table with the currency rates
        table = soup.find('table', {'class': 'ratesTable'})

        # Find the body of the table
        table_body = table.find('tbody')

        # Loop through each row of the table body
        for row in table_body.find_all('tr'):
            # Get the currency name
            currency_to = row.find('td').text.strip()

            # Get the normal rate (not inv.)
            normal_rate = row.find_all('td', {'class': 'rtRates'})[0].text.strip()

            # Define the key
            key = f'{currency}-{currency_codes[currency_to]}'

            # Store the rate in the dictionary
            rates[key] = float(normal_rate)

    # Return the rates as JSON
    return jsonify(rates)

if __name__ == '__main__':
    app.run()
