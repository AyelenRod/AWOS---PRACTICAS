import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

let products = [
  { id: "p1", name: "Mouse", price: 299, inStock: true },
  { id: "p2", name: "Teclado", price: 799, inStock: false }
];

app.get("/api/products", (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 10)));
  const search = String(req.query.search ?? "").toLowerCase().trim();

  let data = products;
  if (search) data = data.filter(p => p.name.toLowerCase().includes(search));

  const total = data.length;
  const start = (page - 1) * limit;
  const slice = data.slice(start, start + limit);

  res.json({ data: slice, meta: { page, limit, total } });
});

app.get("/api/products/:id", (req, res) => {
  const found = products.find(p => p.id === req.params.id);
  if (!found) {
    return res.status(404).json({ code: "PRODUCT_NOT_FOUND", message: "Producto no encontrado", details: { id: req.params.id } });
  }
  res.json(found);
});

app.post("/api/products", (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const price = Number(req.body?.price);

  if (!name || name.length < 2) {
    return res.status(422).json({ code: "INVALID_NAME", message: "Validacion fallida", details: { field: "name" } });
  }
  if (!Number.isFinite(price) || price <= 0) {
    return res.status(422).json({ code: "INVALID_PRICE", message: "Validacion fallida", details: { field: "price" } });
  }
  if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ code: "DUPLICATE_PRODUCT", message: "Ya existe un producto con ese nombre", details: { name } });
  }

  const newItem = { id: `p${products.length + 1}`, name, price, inStock: Boolean(req.body?.inStock) };
  products.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ code: "PRODUCT_NOT_FOUND", message: "Producto no encontrado" });
  }

  const { name, price, inStock } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(422).json({ code: "MISSING_FIELDS", message: "Datos incompletos" });
  }

  products[index] = { id: req.params.id, name, price, inStock: Boolean(inStock) };
  res.json(products[index]);
});

app.patch("/api/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ code: "PRODUCT_NOT_FOUND", message: "Producto no encontrado" });
  }

  products[index] = { ...products[index], ...req.body, id: req.params.id };
  res.json(products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ code: "PRODUCT_NOT_FOUND", message: "Producto no encontrado" });
  }

  const deleted = products.splice(index, 1);
  res.status(200).json({ message: "Eliminado", item: deleted[0] });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));