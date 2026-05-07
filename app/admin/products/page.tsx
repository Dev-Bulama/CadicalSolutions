"use client";

import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ======================================================
// TYPES
// ======================================================

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  sku: string;
  image?: string | null;
  category: string;
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  image: string;
  category: string;
};

// ======================================================
// DEFAULT FORM
// ======================================================

const defaultForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  sku: "",
  image: "",
  category: "",
};

// ======================================================
// COMPONENT
// ======================================================

export default function EcommerceDashboard() {
  // ======================================================
  // STATE
  // ======================================================

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [open, setOpen] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] =
    useState<ProductForm>(defaultForm);

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  }

  // ======================================================
  // FETCH ORDERS
  // ======================================================

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  }

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // ======================================================
  // IMAGE UPLOAD
  // ======================================================

  async function uploadImage(file: File) {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();

      return data.url as string;
    } catch (error) {
      console.error(error);
      alert("Upload failed");
      return "";
    } finally {
      setUploading(false);
    }
  }

  // ======================================================
  // OPEN CREATE
  // ======================================================

  function openCreate() {
    setEditingProduct(null);
    setForm(defaultForm);
    setOpen(true);
  }

  // ======================================================
  // OPEN EDIT
  // ======================================================

  function openEdit(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      sku: product.sku,
      image: product.image || "",
      category: product.category || "",
    });

    setOpen(true);
  }

  // ======================================================
  // SAVE PRODUCT
  // ======================================================

  async function saveProduct() {
    try {
      setLoading(true);

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        sku: form.sku,
        image: form.image,
        category: form.category,
      };

      const endpoint = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      await loadProducts();

      setOpen(false);

      setForm(defaultForm);

      setEditingProduct(null);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // DELETE PRODUCT
  // ======================================================

  async function deleteProduct(id: string) {
    const confirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Ecommerce Dashboard
        </h1>

        <p className="text-muted-foreground">
          Manage products, orders, and customer data
        </p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">
            Orders
          </TabsTrigger>

          {/* <TabsTrigger value="profile">
            Profile
          </TabsTrigger>

          <TabsTrigger value="address">
            Address
          </TabsTrigger> */}

          <TabsTrigger value="admin">
            Products
          </TabsTrigger>
        </TabsList>

        {/* ====================================================== */}
        {/* ORDERS */}
        {/* ====================================================== */}

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>
                Purchase History
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>

                    <TableHead>Date</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order.id}
                      </TableCell>

                      <TableCell>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        {order.status}
                      </TableCell>

                      <TableCell>
                        ${order.totalAmount}
                      </TableCell>
                    </TableRow>
                  ))}

                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================================================== */}
        {/* PROFILE */}
        {/* ====================================================== */}

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>
                Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input placeholder="Full name" />

              <Input placeholder="Email address" />

              <Button>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================================================== */}
        {/* ADDRESS */}
        {/* ====================================================== */}

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>
                Shipping Address
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Textarea placeholder="Enter your shipping address" />

              <Button>
                Save Address
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================================================== */}
        {/* PRODUCTS */}
        {/* ====================================================== */}

        <TabsContent value="admin">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Products
              </CardTitle>

              <Button onClick={openCreate}>
                Add Product
              </Button>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Image
                    </TableHead>

                    <TableHead>
                      Name
                    </TableHead>

                    <TableHead>
                      SKU
                    </TableHead>

                    <TableHead>
                      Price
                    </TableHead>

                    <TableHead>
                      Stock
                    </TableHead>

                    <TableHead>
                      Category
                    </TableHead>

                    <TableHead>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs">
                            N/A
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>

                      <TableCell>
                        {product.sku}
                      </TableCell>

                      <TableCell>
                        ${product.price}
                      </TableCell>

                      <TableCell>
                        {product.stock}
                      </TableCell>

                      <TableCell className="capitalize">
                        {product.category}
                      </TableCell>

                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openEdit(product)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteProduct(product.id)
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {products.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center"
                      >
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ====================================================== */}
      {/* PRODUCT MODAL */}
      {/* ====================================================== */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct
                ? "Edit Product"
                : "Create Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* NAME */}

            <Input
              placeholder="Product name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            {/* DESCRIPTION */}

            <Textarea
              placeholder="Product description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            {/* SKU */}

            <Input
              placeholder="SKU"
              value={form.sku}
              onChange={(e) =>
                setForm({
                  ...form,
                  sku: e.target.value,
                })
              }
            />

            {/* PRICE */}

            <Input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
            />

            {/* STOCK */}

            <Input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
            />

            {/* CATEGORY */}

            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  category: value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    Categories
                  </SelectLabel>

                  <SelectItem value="medistore">
                    MediStore
                  </SelectItem>

                  <SelectItem value="institutional">
                    Institutional
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* IMAGE */}

            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file =
                    e.target.files?.[0];

                  if (!file) return;

                  const url =
                    await uploadImage(file);

                  if (!url) return;

                  setForm((prev) => ({
                    ...prev,
                    image: url,
                  }));
                }}
              />

              {uploading && (
                <p className="text-sm text-muted-foreground">
                  Uploading image...
                </p>
              )}

              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-48 rounded object-cover border"
                />
              )}
            </div>

            {/* SAVE */}

            <Button
              className="w-full"
              disabled={loading}
              onClick={saveProduct}
            >
              {loading
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}