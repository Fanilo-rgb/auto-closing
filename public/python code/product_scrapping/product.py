import pandas as pd
import json

class Product:
    def __init__(self, name=None, bv=None, price=None, order=None):
        self.name = name
        self.bv = bv
        self.order = order
        if bv is not None and price != bv * 3600:
            self.price = price
        else:
            self.price = None

    def get_price(self):
        return self.price if self.price is not None else (self.bv * 3600 if self.bv is not None else None)

    def __repr__(self):
        return f"Product(name={self.name}, bv={self.bv}, price={self.get_price()}, order={self.order})"

    def to_dict(self):
        return {
            "name": self.name,
            "bv": self.bv,
            "price": self.price,
            "order":self.order
        }

def get_products():
    df = pd.read_excel("../for use.xlsx")

    products: list[Product] = []

    columns = [cn for cn, _ in df.loc[0].items()]

    limit = len(columns) - 9
    products_columns = columns[8:limit]
    count = 1

    for c in products_columns:
        p_name = df.loc[0, c]
        p_bv = df.loc[1, c]
        p_price = df.loc[2, c]

        product = Product(p_name, p_bv, p_price, count)

        products.append(product)
        count +=1

    return products


def create_json_file():
    products = [p.to_dict() for p in get_products()]

    with open("products.json", "w", encoding="utf-8") as f :
        json.dump(products, f, ensure_ascii=False, indent=2)

create_json_file()