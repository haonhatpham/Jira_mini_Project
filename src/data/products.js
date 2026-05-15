export const products = [
  { id: 1, name: "iPhone", price: 1000, description: "Latest Apple smartphone with A-series chip." },
  { id: 2, name: "Samsung", price: 900, description: "Flagship Galaxy with vibrant AMOLED display." },
  { id: 3, name: "Xiaomi", price: 500, description: "Great value phone with solid battery life." },
  { id: 4, name: "Oppo", price: 400, description: "Slim design and fast charging support." },
  { id: 5, name: "Pixel", price: 800, description: "Pure Android experience with excellent camera." },
];

export function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}
