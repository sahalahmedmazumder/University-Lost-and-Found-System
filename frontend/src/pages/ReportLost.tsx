import { useState } from "react";
import { createLostItem } from "../services/lostItemService";
import "../styles/ReportLost.css";
import type { LostItem } from "../types/lostItem";

export default function ReportLost() {
  const [formData, setFormData] = useState<LostItem>({
    item_name: "",
    category: "",
    description: "",
    location: "",
    date_lost: "",
    contact_name: "",
    contact_phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await createLostItem(formData);

      setMessage("Lost item reported successfully!");

      setFormData({
        item_name: "",
        category: "",
        description: "",
        location: "",
        date_lost: "",
        contact_name: "",
        contact_phone: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h1>Report Lost Item</h1>
        <p className="subtitle">
          Fill in the details below to report your lost item.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option>Electronics</option>
              <option>Wallet</option>
              <option>Bag</option>
              <option>ID Card</option>
              <option>Books</option>
              <option>Accessories</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location Lost</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date Lost</label>
            <input
              type="date"
              name="date_lost"
              value={formData.date_lost}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Name</label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="text"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              required
            />
          </div>

          {message && <p className="success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
