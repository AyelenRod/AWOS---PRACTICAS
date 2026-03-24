export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export type Product = { id: string; name: string; price: number; inStock: boolean; };
export type ProductsListResponse = { data: Product[]; meta: { page: number; limit: number; total: number; }; };
export type ApiError = { code: string; message: string; details: Record<string, any>; };

function ensureBase() {
  if (!API_BASE) throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en web/.env.local");
}

export async function listProducts() {
  ensureBase();
  const res = await fetch(`${API_BASE}/api/products?page=1&limit=10`);
  const body = await res.json();
  if (!res.ok) throw body as ApiError;
  return body as ProductsListResponse;
}
