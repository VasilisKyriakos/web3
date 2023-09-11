import random
import json
from datetime import datetime, timedelta

# Function to load products from a JSON file
def load_products_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data["products"]

# Load products
input_file_path = "./products.json"
products = load_products_from_file(input_file_path)

# Extract product names and IDs
product_info = [(product["id"], product["name"]) for product in products]

# Save product names and IDs to 'product_info.txt'
with open('product_info.txt', 'w', encoding='utf-8') as f:
    for id, name in product_info:
        f.write(f"{id} - {name}\n")

# Generate random price data for the range of dates
def generate_prices(start_date_str, end_date_str):
    date_format = "%Y-%m-%d"
    start_date = datetime.strptime(start_date_str, date_format)
    end_date = datetime.strptime(end_date_str, date_format)
    
    prices = []
    while start_date <= end_date:
        price_data = {
            "date": start_date.strftime(date_format),
            "price": round(random.uniform(0.5, 10.0), 2)
        }
        prices.append(price_data)
        start_date += timedelta(days=1)

    return prices

# Calculate the start and end dates
start_date_two_weeks_before_now = (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d")
end_date_today = datetime.now().strftime("%Y-%m-%d")

# Generate price data for each product
price_data_json = {
    "fetch_date": int(datetime.now().timestamp()),
    "data": []
}

for id, name in product_info:
    product_data = {
        "id": int(id),
        "name": name,
        "prices": generate_prices(start_date_two_weeks_before_now, end_date_today)  # Updated the dates
    }
    price_data_json["data"].append(product_data)

# Save the generated data to 'prices.json'
output_file_path = 'prices.json'
with open(output_file_path, 'w', encoding='utf-8') as f:
    json.dump(price_data_json, f, indent=4, ensure_ascii=False)

print(f"Generated prices data saved to {output_file_path}")
