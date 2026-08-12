import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    deleteAdminItem,
    deleteAdminUser,
    flagAdminUser,
    getAdminItems,
    getAdminUsers,
    type AdminItem,
    type AdminUser,
} from "../services/adminService";

import {
    getToken,
    logout,
} from "../services/authService";

import "../styles/AdminDashboard.css";


/* =========================
   COMPONENT
========================= */

export default function AdminDashboard() {

    const navigate = useNavigate();

    /* =========================
       USERS
    ========================= */

    const [users, setUsers] = useState<AdminUser[]>([]);

    const [usersLoading, setUsersLoading] =
        useState(true);

    /* =========================
       ITEMS
    ========================= */

    const [items, setItems] =
        useState<AdminItem[]>([]);

    const [itemsLoading, setItemsLoading] =
        useState(true);

    /* =========================
       GENERAL
    ========================= */

    const [error, setError] =
        useState("");

    /* =========================
       ITEM FILTERS
    ========================= */

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [categoryFilter, setCategoryFilter] =
        useState("All");

    const [dateFilter, setDateFilter] =
        useState("");


    /* =========================
       LOAD DATA
    ========================= */

    useEffect(() => {

        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        loadUsers();
        loadItems();

    }, []);


    /* =========================
       LOAD USERS
    ========================= */

    const loadUsers = async () => {

        try {

            setUsersLoading(true);
            setError("");

            const data =
                await getAdminUsers();

            setUsers(data);

        } catch (error: any) {

            console.error(
                "Failed to load users:",
                error
            );

            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {
                handleLogout();
                return;
            }

            setError(
                "Failed to load users."
            );

        } finally {

            setUsersLoading(false);

        }
    };


    /* =========================
       LOAD ITEMS
    ========================= */

    const loadItems = async () => {

        try {

            setItemsLoading(true);
            setError("");

            const data =
                await getAdminItems();

            setItems(data);

        } catch (error: any) {

            console.error(
                "Failed to load items:",
                error
            );

            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {
                handleLogout();
                return;
            }

            setError(
                "Failed to load items."
            );

        } finally {

            setItemsLoading(false);

        }
    };


    /* =========================
       LOGOUT
    ========================= */

    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    /* =========================
       DELETE USER
    ========================= */

    const handleDeleteUser = async (
        userId: string
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminUser(
                userId
            );

            setUsers(
                previousUsers =>
                    previousUsers.filter(
                        user =>
                            user.user_id !==
                            userId
                    )
            );

        } catch (error: any) {

            console.error(
                "Failed to delete user:",
                error
            );

            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {
                handleLogout();
                return;
            }

            alert(
                "Failed to delete user."
            );

        }
    };


    /* =========================
       FLAG USER
    ========================= */

    const handleToggleFlag = async (
        userId: string,
        currentFlagged: boolean
    ) => {

        try {

            await flagAdminUser(
                userId,
                !currentFlagged
            );

            setUsers(
                previousUsers =>
                    previousUsers.map(
                        user =>
                            user.user_id ===
                            userId
                                ? {
                                      ...user,
                                      flagged:
                                          !currentFlagged,
                                  }
                                : user
                    )
            );

        } catch (error: any) {

            console.error(
                "Failed to update user:",
                error
            );

            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {
                handleLogout();
                return;
            }

            alert(
                "Failed to update user."
            );

        }
    };


    /* =========================
       DELETE ITEM
    ========================= */

    const handleDeleteItem = async (
        itemId: string
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this item?\n\nThis action cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminItem(
                itemId
            );

            setItems(
                previousItems =>
                    previousItems.filter(
                        item =>
                            item.item_id !==
                            itemId
                    )
            );

        } catch (error: any) {

            console.error(
                "Failed to delete item:",
                error
            );

            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {
                handleLogout();
                return;
            }

            alert(
                "Failed to delete item."
            );

        }
    };


    /* =========================
       CATEGORY OPTIONS
    ========================= */

    const categories =
        useMemo(() => {

            const uniqueCategories =
                Array.from(
                    new Set(
                        items
                            .map(
                                item =>
                                    item.category
                            )
                            .filter(Boolean)
                    )
                );

            return uniqueCategories.sort();

        }, [items]);


    /* =========================
       FILTER ITEMS
    ========================= */

    const filteredItems =
        useMemo(() => {

            return items.filter(
                item => {

                    /* SEARCH */

                    const searchText =
                        search
                            .toLowerCase()
                            .trim();

                    const matchesSearch =
                        !searchText ||
                        item.item_name
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||
                        item.category
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||
                        item.location
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||
                        item.contact_name
                            ?.toLowerCase()
                            .includes(
                                searchText
                            );


                    /* STATUS */

                    const matchesStatus =
                        statusFilter ===
                            "All" ||
                        item.status ===
                            statusFilter;


                    /* CATEGORY */

                    const matchesCategory =
                        categoryFilter ===
                            "All" ||
                        item.category ===
                            categoryFilter;


                    /* DATE */

                    const itemDate =
                        item.status ===
                        "Lost"
                            ? item.date_lost
                            : item.date_found;

                    const matchesDate =
                        !dateFilter ||
                        itemDate ===
                            dateFilter;


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesCategory &&
                        matchesDate
                    );
                }
            );

        }, [
            items,
            search,
            statusFilter,
            categoryFilter,
            dateFilter,
        ]);


    /* =========================
       STATISTICS
    ========================= */

    const totalUsers =
        users.length;

    const totalAdmins =
        users.filter(
            user =>
                user.role === "admin"
        ).length;

    const flaggedUsers =
        users.filter(
            user =>
                user.flagged
        ).length;

    const totalItems =
        items.length;

    const lostItems =
        items.filter(
            item =>
                item.status === "Lost"
        ).length;

    const foundItems =
        items.filter(
            item =>
                item.status === "Found"
        ).length;


    /* =========================
       REFRESH
    ========================= */

    const handleRefresh = () => {

        loadUsers();
        loadItems();

    };


    /* =========================
       LOADING
    ========================= */

    if (
        usersLoading &&
        itemsLoading
    ) {

        return (
            <div className="admin-dashboard">

                <div className="admin-loading">

                    <div className="loading-spinner" />

                    <p>
                        Loading admin dashboard...
                    </p>

                </div>

            </div>
        );
    }


    /* =========================
       RENDER
    ========================= */

    return (

        <div className="admin-dashboard">

            {/* =========================
                HEADER
            ========================= */}

            <header className="admin-dashboard-header">

                <div>

                    <div className="admin-title-row">

                        <div>

                            <span className="admin-label">
                                ADMIN PANEL
                            </span>

                            <h1>
                                Admin Dashboard
                            </h1>

                            <p>
                                Manage users, lost items,
                                and found items.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="admin-header-actions">

                    <button
                        className="refresh-button"
                        onClick={handleRefresh}
                    >
                        ↻ Refresh
                    </button>

                    <button
                        className="admin-back-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Back to Home
                    </button>

                </div>

            </header>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="admin-error">

                    {error}

                </div>

            )}


            {/* =========================
                STATISTICS
            ========================= */}

            <section className="admin-stats">

                <div className="admin-stat-card">

                    <span>
                        Total Users
                    </span>

                    <strong>
                        {totalUsers}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Administrators
                    </span>

                    <strong>
                        {totalAdmins}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Flagged Users
                    </span>

                    <strong>
                        {flaggedUsers}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Total Items
                    </span>

                    <strong>
                        {totalItems}
                    </strong>

                </div>


                <div className="admin-stat-card lost-stat">

                    <span>
                        Lost Items
                    </span>

                    <strong>
                        {lostItems}
                    </strong>

                </div>


                <div className="admin-stat-card found-stat">

                    <span>
                        Found Items
                    </span>

                    <strong>
                        {foundItems}
                    </strong>

                </div>

            </section>


            {/* =========================
                ITEMS SECTION
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>

                        <h2>
                            All Items
                        </h2>

                        <p>
                            View and manage every
                            lost and found item.
                        </p>

                    </div>

                    <span className="item-count">

                        Showing{" "}
                        <strong>
                            {filteredItems.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {items.length}
                        </strong>

                    </span>

                </div>


                {/* =========================
                    FILTERS
                ========================= */}

                <div className="admin-filters">

                    {/* SEARCH */}

                    <div className="admin-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search item, category, location..."
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={e =>
                            setStatusFilter(
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


                    {/* CATEGORY */}

                    <select
                        value={categoryFilter}
                        onChange={e =>
                            setCategoryFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Categories
                        </option>

                        {categories.map(
                            category => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>

                            )
                        )}

                    </select>


                    {/* DATE */}

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={e =>
                            setDateFilter(
                                e.target.value
                            )
                        }
                    />


                    {/* CLEAR */}

                    {(search ||
                        statusFilter !==
                            "All" ||
                        categoryFilter !==
                            "All" ||
                        dateFilter) && (

                        <button
                            className="clear-filter-button"
                            onClick={() => {

                                setSearch("");

                                setStatusFilter(
                                    "All"
                                );

                                setCategoryFilter(
                                    "All"
                                );

                                setDateFilter("");

                            }}
                        >
                            Clear
                        </button>

                    )}

                </div>


                {/* =========================
                    ITEMS TABLE
                ========================= */}

                {itemsLoading ? (

                    <div className="section-loading">

                        Loading items...

                    </div>

                ) : filteredItems.length === 0 ? (

                    <div className="admin-empty">

                        <div className="empty-icon">
                            📦
                        </div>

                        <h3>
                            No items found
                        </h3>

                        <p>
                            Try changing your
                            search or filters.
                        </p>

                    </div>

                ) : (

                    <div className="admin-table-container">

                        <table className="admin-items-table">

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

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredItems.map(
                                    item => (

                                        <tr
                                            key={
                                                item.item_id
                                            }
                                        >

                                            <td>

                                                <span
                                                    className={`item-status ${
                                                        item.status ===
                                                        "Lost"
                                                            ? "lost"
                                                            : "found"
                                                    }`}
                                                >

                                                    {item.status}

                                                </span>

                                            </td>


                                            <td>

                                                <strong>
                                                    {
                                                        item.item_name
                                                    }
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="category-badge">

                                                    {
                                                        item.category
                                                    }

                                                </span>

                                            </td>


                                            <td className="description-cell">

                                                {
                                                    item.description
                                                }

                                            </td>


                                            <td>

                                                {
                                                    item.location
                                                }

                                            </td>


                                            <td>

                                                {item.status ===
                                                "Lost"
                                                    ? item.date_lost ||
                                                      "-"
                                                    : item.date_found ||
                                                      "-"}

                                            </td>


                                            <td>

                                                <div className="contact-cell">

                                                    <strong>
                                                        {
                                                            item.contact_name
                                                        }
                                                    </strong>

                                                    {item.contact_phone && (

                                                        <span>
                                                            {
                                                                item.contact_phone
                                                            }
                                                        </span>

                                                    )}

                                                </div>

                                            </td>


                                            <td>

                                                <button
                                                    className="delete-button item-delete-button"
                                                    onClick={() =>
                                                        handleDeleteItem(
                                                            item.item_id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* =========================
                USERS SECTION
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>

                        <h2>
                            Users
                        </h2>

                        <p>
                            Manage registered users
                            and account access.
                        </p>

                    </div>

                    <span className="item-count">

                        {users.length} users

                    </span>

                </div>


                {usersLoading ? (

                    <div className="section-loading">
                        Loading users...
                    </div>

                ) : users.length === 0 ? (

                    <div className="admin-empty">

                        <div className="empty-icon">
                            👥
                        </div>

                        <h3>
                            No users found
                        </h3>

                    </div>

                ) : (

                    <div className="admin-table-container">

                        <table className="admin-users-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.map(
                                    user => (

                                        <tr
                                            key={
                                                user.user_id
                                            }
                                        >

                                            <td>

                                                <strong>
                                                    {
                                                        user.name
                                                    }
                                                </strong>

                                            </td>


                                            <td>
                                                {
                                                    user.email
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`role-badge ${
                                                        user.role ===
                                                        "admin"
                                                            ? "admin-role"
                                                            : "user-role"
                                                    }`}
                                                >

                                                    {
                                                        user.role
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        user.flagged
                                                            ? "flagged-status"
                                                            : "active-status"
                                                    }`}
                                                >

                                                    {user.flagged
                                                        ? "Flagged"
                                                        : "Active"}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className={
                                                            user.flagged
                                                                ? "unflag-button"
                                                                : "flag-button"
                                                        }
                                                        onClick={() =>
                                                            handleToggleFlag(
                                                                user.user_id,
                                                                user.flagged
                                                            )
                                                        }
                                                    >

                                                        {user.flagged
                                                            ? "Unflag"
                                                            : "Flag"}

                                                    </button>


                                                    {user.role !==
                                                        "admin" && (

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user.user_id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
}