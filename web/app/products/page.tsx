"use client";

import { useEffect, useState } from "react";
import { listProducts, ProductsListResponse, ApiError } from "../../lib/api";

export default function ProductsPage() {
  const [data, setData] = useState<ProductsListResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    listProducts().then(setData).catch(setError);
  }, []);

  return (
    <main>
      <h1>Products</h1>

      {error && (
        <pre>{error.code} - {error.message}{"\n"}{JSON.stringify(error.details, null, 2)}</pre>
      )}

      {!data && !error && <p>Cargando...</p>}

      {data && (
        <ul>
          {data.data.map((p) => (
            <li key={p.id}>{p.name} - ${p.price} - inStock: {String(p.inStock)}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
