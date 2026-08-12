import { useEffect, useMemo, useState } from "react";
import { getBrowseItems } from "../services/browseItemsService";
import "../styles/BrowseItems.css";

interface BrowseItem {
    item_id: string;
    item_name: string;
    category: string;
    description: string;
    location: string;
    contact_name: string;
    contact_phone?: string;
    status: "Lost" | "Found";
    date_lost?: string;
    date_found?: string;
}

export default function BrowseItems() {
    const [items, setItems] = useState<BrowseItem[]>([]);

    // Status filter
    const [filter, setFilter] = useState("All");

    // Category filter
    const [categoryFilter, setCategoryFilter] =
        useState("All");

    // Date filter
    const [dateFilter, setDateFilter] =
        useState("");

    // Search
    const [search, setSearch] =
        useState("");

    // Loading
    const [loading, setLoading] =
        useState(true);

    /*
     * Load items whenever status changes.
     */
    useEffect(() => {
        loadItems();
    }, [filter]);

    const loadItems = async () => {
        setLoading(true);

        try {
            const data = await getBrowseItems(filter);

            console.log("Browse Items:", data);

            setItems(data || []);
        } catch (err) {
            console.error(
                "Failed to load items:",
                err
            );

            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    /*
     * Get unique categories.
     */
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(
                items
                    .map((item) => item.category)
                    .filter(Boolean)
            )
        );

        return uniqueCategories.sort();
    }, [items]);

    /*
     * Search + category + date filtering.
     */
    const filteredItems = useMemo(() => {
        const searchText =
            search.trim().toLowerCase();

        return items.filter((item) => {

            /*
             * Category filter
             */
            const matchesCategory =
                categoryFilter === "All" ||
                item.category === categoryFilter;

            /*
             * Get correct date
             */
            const itemDate =
                item.status === "Lost"
                    ? item.date_lost
                    : item.date_found;

            /*
             * Date filter
             */
            const matchesDate =
                !dateFilter ||
                itemDate === dateFilter;

            /*
             * Search filter
             */
            const matchesSearch =
                !searchText ||
                item.item_name
                    .toLowerCase()
                    .includes(searchText) ||

                item.category
                    .toLowerCase()
                    .includes(searchText) ||

                item.description
                    .toLowerCase()
                    .includes(searchText) ||

                item.location
                    .toLowerCase()
                    .includes(searchText) ||

                item.contact_name
                    .toLowerCase()
                    .includes(searchText) ||

                (
                    item.contact_phone || ""
                )
                    .toLowerCase()
                    .includes(searchText);

            return (
                matchesCategory &&
                matchesDate &&
                matchesSearch
            );
        });
    }, [
        items,
        categoryFilter,
        dateFilter,
        search,
    ]);

    /*
     * Clear all filters.
     */
    const clearFilters = () => {
        setFilter("All");
        setCategoryFilter("All");
        setDateFilter("");
        setSearch("");
    };

    return (
        <div className="browse-page">

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="browse-header">

                <div>

                    <h1>
                        Browse Items
                    </h1>

                    <p className="browse-subtitle">
                        Browse reported lost and
                        found items and find what
                        you're looking for.
                    </p>

                </div>

            </div>


            {/* =====================================
                FILTER SECTION
            ====================================== */}

            <div className="filter-container">

                {/* Search */}

                <div className="filter-group search-group">

                    <label htmlFor="search-filter">
                        Search
                    </label>

                    <div className="search-wrapper">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            id="search-filter"
                            type="text"
                            placeholder="Search items..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* Status */}

                <div className="filter-group">

                    <label htmlFor="status-filter">
                        Item Type
                    </label>

                    <select
                        id="status-filter"
                        value={filter}
                        onChange={(e) =>
                            setFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Items
                        </option>

                        <option value="Lost">
                            Lost Items
                        </option>

                        <option value="Found">
                            Found Items
                        </option>

                    </select>

                </div>


                {/* Category */}

                <div className="filter-group">

                    <label htmlFor="category-filter">
                        Category
                    </label>

                    <select
                        id="category-filter"
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Categories
                        </option>

                        {categories.map(
                            (category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            )
                        )}

                    </select>

                </div>


                {/* Date */}

                <div className="filter-group">

                    <label htmlFor="date-filter">
                        Date
                    </label>

                    <input
                        id="date-filter"
                        type="date"
                        value={dateFilter}
                        onChange={(e) =>
                            setDateFilter(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* Clear */}

                <div className="filter-actions">

                    <button
                        type="button"
                        className="clear-filter-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

            </div>


            {/* =====================================
                RESULTS COUNT
            ====================================== */}

            {!loading && (
                <div className="results-info">

                    Showing{" "}

                    <strong>
                        {filteredItems.length}
                    </strong>{" "}

                    {filteredItems.length === 1
                        ? "item"
                        : "items"}

                </div>
            )}


            {/* =====================================
                TABLE
            ====================================== */}

            {loading ? (

                <div className="loading-message">

                    <div className="loading-spinner"></div>

                    <span>
                        Loading items...
                    </span>

                </div>

            ) : (

                <div className="table-wrapper">

                    <table className="browse-table">

                        <thead>

                            <tr>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Item
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Location
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Contact
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredItems.length > 0 ? (

                                filteredItems.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.item_id
                                            }
                                        >

                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={
                                                        item.status ===
                                                        "Lost"
                                                            ? "badge lost"
                                                            : "badge found"
                                                    }
                                                >
                                                    {
                                                        item.status
                                                    }
                                                </span>

                                            </td>


                                            {/* Item */}

                                            <td className="item-name">
                                                {
                                                    item.item_name
                                                }
                                            </td>


                                            {/* Category */}

                                            <td>
                                                {
                                                    item.category
                                                }
                                            </td>


                                            {/* Description */}

                                            <td className="description-cell">
                                                {
                                                    item.description
                                                }
                                            </td>


                                            {/* Location */}

                                            <td>
                                                {
                                                    item.location
                                                }
                                            </td>


                                            {/* Date */}

                                            <td className="date-cell">

                                                {item.status ===
                                                "Lost"
                                                    ? item.date_lost
                                                    : item.date_found}

                                            </td>


                                            {/* Contact */}

                                            <td className="contact-cell">

                                                <div className="contact-info">

                                                    <span className="contact-name">
                                                        {
                                                            item.contact_name
                                                        }
                                                    </span>

                                                    {item.contact_phone && (
                                                        <a
                                                            href={`tel:${item.contact_phone}`}
                                                            className="contact-phone"
                                                        >
                                                            📞{" "}
                                                            {
                                                                item.contact_phone
                                                            }
                                                        </a>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="no-items"
                                    >

                                        <div className="empty-state">

                                            <div className="empty-icon">
                                                🔍
                                            </div>

                                            <h3>
                                                No items found
                                            </h3>

                                            <p>
                                                Try changing
                                                your search
                                                or filters.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}