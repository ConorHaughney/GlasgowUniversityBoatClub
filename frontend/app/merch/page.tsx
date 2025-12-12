"use client";

import { useState } from "react";
import { ShoppingCart, Plus, X } from "lucide-react";

type OrderItem = { item: string; size: string; quantity: string };

export default function MerchPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comments: "",
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { item: "", size: "", quantity: "1" },
  ]);

  const items = [
    { name: "GUBC Hoodie", price: "£35" },
    { name: "GUBC T-Shirt", price: "£18" },
    { name: "GUBC Polo Shirt", price: "£25" },
    { name: "GUBC Jacket", price: "£45" },
    { name: "GUBC Beanie", price: "£12" },
    { name: "GUBC Water Bottle", price: "£8" },
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert("Please add at least one item to your order.");
      return;
    }
    alert(
      "Order submitted! We will contact you shortly to arrange payment and collection."
    );
    setFormData({ name: "", email: "", comments: "" });
    setOrderItems([{ item: "", size: "", quantity: "1" }]);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleItemClick = (itemName: string) => {
    setOrderItems((prev) => {
      const firstEmpty = prev.findIndex((item) => !item.item);
      if (firstEmpty !== -1) {
        const next = [...prev];
        next[firstEmpty] = { ...next[firstEmpty], item: itemName };
        return next;
      }
      return [...prev, { item: itemName, size: "", quantity: "1" }];
    });
    document
      .getElementById("order-form")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleAddItem = () =>
    setOrderItems([...orderItems, { item: "", size: "", quantity: "1" }]);
  const handleRemoveItem = (index: number) =>
    setOrderItems(orderItems.filter((_, i) => i !== index));
  const handleQuantityChange = (index: number, value: string) =>
    setOrderItems(
      orderItems.map((item, i) =>
        i === index ? { ...item, quantity: value } : item
      )
    );
  const handleSizeChange = (index: number, value: string) =>
    setOrderItems(
      orderItems.map((item, i) =>
        i === index ? { ...item, size: value } : item
      )
    );

  return (
    <section id="merch" className="bg-gray-1000 mt-20">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        {/* Hero Section */}
        <section className="relative py-24 bg-black text-white overflow-hidden">
          <div className="absolute top-0 right-0 text-white/5 text-[15rem] uppercase tracking-tighter leading-none pointer-events-none">
            Merch
          </div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#ffdc36] transform origin-bottom-left skew-x-6 -translate-x-1/3 opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="h-1 w-20 bg-[#ffdc36] mb-6"></div>
            <h1 className="text-white uppercase tracking-tight mb-6">
              <span className="block text-5xl sm:text-6xl lg:text-7xl">
                Club
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#ffdc36]">
                Merchandise
              </span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl">
              Show your GUBC pride with official club merchandise. All proceeds support the club.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="mt-10 mb-16">

        <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product List */}
            <div>
              <h3 className="text-black text-2xl mb-6">Available Items</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleItemClick(item.name)}
                    className={`flex justify-between items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      orderItems.some(
                        (orderItem) => orderItem.item === item.name
                      )
                        ? "bg-[#ffdc36] border-2 border-black"
                        : "bg-gray-50 border-2 border-transparent hover:border-[#ffdc36]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="text-black" size={20} />
                      <span className="text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-black">{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-[#ffdc36] p-6 rounded-lg">
                <h4 className="text-black mb-2">How to Order</h4>
                <ol className="text-black space-y-2 text-sm">
                  <li>1. Fill out the order form</li>
                  <li>
                    2. We&apos;ll contact you to confirm and arrange payment
                  </li>
                  <li>3. Collect your items at the boathouse</li>
                </ol>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-gray-50 p-8 rounded-lg" id="order-form">
              <h3 className="text-gray-900 text-2xl mb-6">Order Form</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-gray-700">Items *</label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="bg-[#ffdc36] text-black py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Item
                    </button>
                  </div>

                  {orderItems.map((orderItem, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border-2 border-gray-200 space-y-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Item {index + 1}
                        </span>
                        {orderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor={`item-${index}`}
                          className="block text-gray-700 mb-2 text-sm"
                        >
                          Product *
                        </label>
                        <select
                          id={`item-${index}`}
                          value={orderItem.item}
                          onChange={(e) =>
                            setOrderItems(
                              orderItems.map((item, i) =>
                                i === index
                                  ? { ...item, item: e.target.value }
                                  : item
                              )
                            )
                          }
                          required
                          className="w-full text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="">Select an item</option>
                          {items.map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name} - {item.price}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor={`size-${index}`}
                            className="block text-gray-700 mb-2 text-sm"
                          >
                            Size
                          </label>
                          <select
                            id={`size-${index}`}
                            value={orderItem.size}
                            onChange={(e) =>
                              handleSizeChange(index, e.target.value)
                            }
                            className="w-full text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          >
                            <option value="">Select size</option>
                            {sizes.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`quantity-${index}`}
                            className="block text-gray-700 mb-2 text-sm"
                          >
                            Quantity *
                          </label>
                          <input
                            type="number"
                            id={`quantity-${index}`}
                            min="1"
                            max="10"
                            value={orderItem.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                            required
                            className="w-full text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="comments"
                    className="block text-gray-700 mb-2"
                  >
                    Additional Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-[#ffdc36] py-3 rounded-lg hover:bg-gray-900 transition-colors uppercase tracking-wider"
                >
                  Submit Order
                </button>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
