import { useEffect, useState } from "react";
import {
  createLostItem,
  deleteLostItem,
  getLostItems,
  updateLostItem,
} from "../services/lostItemService";
import "../styles/ReportLost.css";
import type { LostItem, LostItemRecord } from "../types/lostItem";

const emptyForm: LostItem = {
  item_name: "",
  category: "",
  description: "",
  location: "",
  date_lost: "",
  contact_name: "",
  contact_phone: "",
};

export default function ReportLost() {
  const [formData, setFormData] = useState<LostItem>(emptyForm);
  const [items, setItems] = useState<LostItemRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchItems = async () => {
    try {
      const data = await getLostItems();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        await updateLostItem(editingId, formData);
        setMessage("Lost item updated successfully!");
      } else {
        await createLostItem(formData);
        setMessage("Lost item reported successfully!");
      }

      setFormData(emptyForm);
      setEditingId(null);
      await fetchItems();
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: LostItemRecord) => {
    const { item_id, ...rest } = item;
    setFormData(rest);
    setEditingId(item_id);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await deleteLostItem(itemId);
      if (editingId === itemId) handleCancelEdit();
      await fetchItems();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete item.");
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h1>{editingId ? "Edit Lost Item" : "Report Lost Item"}</h1>
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
            {loading
              ? "Submitting..."
              : editingId
                ? "Update Report"
                : "Submit Report"}
          </button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="report-card table-card">
        <h2>Submitted Lost Items</h2>
        {items.length === 0 ? (
          <p className="subtitle">No items reported yet.</p>
        ) : (
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date Lost</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.item_name}</td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>{item.date_lost}</td>
                  <td>{item.contact_name}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.item_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
