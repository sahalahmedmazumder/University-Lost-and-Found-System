import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { deleteFoundItem } from "../services/foundItemService";
import { deleteLostItem } from "../services/lostItemService";
import "../styles/MyReports.css";

interface ReportItem {
  item_id: string;
  item_name: string;
  category: string;
  description: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  user_id: string;
  status: "Lost" | "Found";
  date_lost?: string;
  date_found?: string;
}

export default function MyReports() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ReportItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/my-reports?filter=${filter}`
      );

      setItems(response.data.data || []);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filter]);

  const handleDelete = async (item: ReportItem) => {
    const confirmDelete = window.confirm(
      `Delete this ${item.status.toLowerCase()} report?`
    );

    if (!confirmDelete) return;

    try {
      if (item.status === "Lost") {
        await deleteLostItem(item.item_id);
      } else {
        await deleteFoundItem(item.item_id);
      }

      loadReports();
    } catch (error) {
      console.error(error);
      alert("Failed to delete report.");
    }
  };

  const handleEdit = (item: ReportItem) => {
    if (item.status === "Lost") {
      navigate("/report-lost", {
        state: item,
      });
    } else {
      navigate("/report-found", {
        state: item,
      });
    }
  };

  return (
    <div className="myreports-page">

      <div className="report-card">

        <h1>My Reports</h1>

        <p className="subtitle">
          View, edit and delete your lost and found reports.
        </p>

        <div className="filter-container">

          <label>Show</label>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All Reports
            </option>

            <option value="Lost">
              Lost Reports
            </option>

            <option value="Found">
              Found Reports
            </option>

          </select>

        </div>

      </div>

      <div className="report-card table-card">

        {loading ? (

          <p>Loading...</p>

        ) : items.length === 0 ? (

          <p className="subtitle">
            No reports found.
          </p>

        ) : (

          <table className="items-table">

            <thead>

              <tr>

                <th>Status</th>
                <th>Item</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Contact</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (

                <tr key={item.item_id}>

                  <td>

                    <span
                      className={
                        item.status === "Lost"
                          ? "badge lost"
                          : "badge found"
                      }
                    >
                      {item.status}
                    </span>

                  </td>

                  <td>{item.item_name}</td>

                  <td>{item.category}</td>

                  <td>{item.location}</td>

                  <td>
                    {item.status === "Lost"
                      ? item.date_lost
                      : item.date_found}
                  </td>

                  <td>{item.contact_name}</td>

                  <td className="actions-cell">

                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(item)
                      }
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