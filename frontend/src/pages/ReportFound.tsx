import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    createFoundItem,
    deleteFoundItem,
    getMyFoundItems,
    updateFoundItem,
} from "../services/foundItemService";

import "../styles/ReportLost.css";

import type {
    FoundItem,
    FoundItemRecord,
} from "../types/foundItem";


const emptyForm: FoundItem = {
    item_name: "",
    category: "",
    description: "",
    location: "",
    date_found: "",
    contact_name: "",
    contact_phone: "",
};


export default function ReportFound() {

    const location = useLocation();


    // =========================================
    // FORM
    // =========================================

    const [formData, setFormData] =
        useState<FoundItem>(emptyForm);


    // =========================================
    // FOUND ITEMS ONLY
    // =========================================

    const [items, setItems] =
        useState<FoundItemRecord[]>([]);


    const [editingId, setEditingId] =
        useState<string | null>(null);


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState("");


    // =========================================
    // FETCH MY FOUND ITEMS
    // =========================================

    const fetchItems = async () => {

        try {

            const data =
                await getMyFoundItems();

            setItems(data || []);

        } catch (error) {

            console.error(
                "Failed to fetch found items:",
                error
            );

            setItems([]);

        }

    };


    // =========================================
    // PAGE LOAD
    // =========================================

    useEffect(() => {

        fetchItems();


        /*
         * If My Reports sends an item for editing,
         * load that FOUND item into the form.
         */

        if (location.state) {

            const item =
                location.state as FoundItemRecord;


            const {
                item_id,
                user_id,
                ...rest
            } = item;


            setFormData({
                item_name: rest.item_name || "",
                category: rest.category || "",
                description: rest.description || "",
                location: rest.location || "",
                date_found: rest.date_found || "",
                contact_name: rest.contact_name || "",
                contact_phone: rest.contact_phone || "",
            });


            setEditingId(item_id);

            setMessage("");


            /*
             * Clear navigation state
             * so refresh does not reopen edit mode.
             */

            window.history.replaceState(
                {},
                document.title
            );
        }

    }, [location.state]);


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // =========================================
    // CREATE / UPDATE FOUND ITEM
    // =========================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");


        try {

            // ================================
            // UPDATE FOUND ITEM
            // ================================

            if (editingId) {

                await updateFoundItem(
                    editingId,
                    formData
                );


                setMessage(
                    "Found item updated successfully!"
                );

            }

            // ================================
            // CREATE FOUND ITEM
            // ================================

            else {

                await createFoundItem(
                    formData
                );


                setMessage(
                    "Found item reported successfully!"
                );

            }


            // Reset form

            setFormData({
                ...emptyForm,
            });


            setEditingId(null);


            // Refresh FOUND items table

            await fetchItems();


            // Scroll to top

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });


        } catch (error) {

            console.error(
                "Failed to submit found item:",
                error
            );


            setMessage(
                "Failed to submit report."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // EDIT FOUND ITEM
    // =========================================

    const handleEdit = (
        item: FoundItemRecord
    ) => {

        const {
            item_id,
            user_id,
            ...rest
        } = item;


        setFormData({

            item_name:
                rest.item_name || "",

            category:
                rest.category || "",

            description:
                rest.description || "",

            location:
                rest.location || "",

            date_found:
                rest.date_found || "",

            contact_name:
                rest.contact_name || "",

            contact_phone:
                rest.contact_phone || "",

        });


        setEditingId(item_id);

        setMessage("");


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // =========================================
    // CANCEL EDIT
    // =========================================

    const handleCancelEdit = () => {

        setFormData({
            ...emptyForm,
        });

        setEditingId(null);

        setMessage("");

    };


    // =========================================
    // DELETE FOUND ITEM
    // =========================================

    const handleDelete = async (
        itemId: string
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this found item?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteFoundItem(
                itemId
            );


            // If currently editing this item

            if (editingId === itemId) {

                handleCancelEdit();

            }


            setMessage(
                "Found item deleted successfully!"
            );


            // Refresh FOUND items only

            await fetchItems();


        } catch (error) {

            console.error(
                "Failed to delete found item:",
                error
            );


            setMessage(
                "Failed to delete item."
            );

        }

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div className="report-page">


            {/* =================================
                REPORT FOUND FORM
            ================================= */}

            <div className="report-card">

                <h2>
                    {editingId
                        ? "Edit Found Item"
                        : "Report Found Item"}
                </h2>


                <p className="subtitle">

                    {editingId
                        ? "Update the details of your found item."
                        : "Fill in the details below to report your found item."}

                </p>


                <form
                    onSubmit={handleSubmit}
                >


                    {/* =========================
                        ITEM NAME
                    ========================== */}

                    <div className="form-group">

                        <label>
                            Item Name
                        </label>


                        <input
                            type="text"
                            name="item_name"
                            value={
                                formData.item_name
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* =========================
                        CATEGORY
                    ========================== */}

                    <div className="form-group">

                        <label>
                            Category
                        </label>


                        <select
                            name="category"
                            value={
                                formData.category
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            <option value="Electronics">
                                Electronics
                            </option>

                            <option value="Wallet">
                                Wallet
                            </option>

                            <option value="Bag">
                                Bag
                            </option>

                            <option value="ID Card">
                                ID Card
                            </option>

                            <option value="Books">
                                Books
                            </option>

                            <option value="Accessories">
                                Accessories
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* =========================
                        DESCRIPTION
                    ========================== */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>


                        <textarea
                            rows={4}
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* =========================
                        LOCATION FOUND
                    ========================== */}

                    <div className="form-group">

                        <label>
                            Location Found
                        </label>


                        <input
                            type="text"
                            name="location"
                            value={
                                formData.location
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* =========================
                        DATE FOUND
                    ========================== */}

                    <div className="form-group">

                        <label>
                            Date Found
                        </label>


                        <input
                            type="date"
                            name="date_found"
                            value={
                                formData.date_found
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* =========================
                        CONTACT NAME
                    ========================== */}

                    <div className="form-group">

                        <label>
                            Contact Name
                        </label>


                        <input
                            type="text"
                            name="contact_name"
                            value={
                                formData.contact_name
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* =========================
                        CONTACT PHONE
                    ========================== */}

                    <div className="form-group">

                        <label>
                            Contact Phone
                        </label>


                        <input
                            type="text"
                            name="contact_phone"
                            value={
                                formData.contact_phone
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    {/* =========================
                        MESSAGE
                    ========================== */}

                    {message && (

                        <p className="success">
                            {message}
                        </p>

                    )}


                    {/* =========================
                        SUBMIT BUTTON
                    ========================== */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Submitting..."
                            : editingId
                                ? "Update Report"
                                : "Submit Report"}

                    </button>


                    {/* =========================
                        CANCEL BUTTON
                    ========================== */}

                    {editingId && (

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={
                                handleCancelEdit
                            }
                        >
                            Cancel
                        </button>

                    )}

                </form>

            </div>


            {/* =================================
                MY FOUND ITEMS TABLE
            ================================= */}

            <div className="report-card table-card">

                <h2>
                    My Found Items
                </h2>


                {items.length === 0 ? (

                    <p className="subtitle">

                        You haven't reported any
                        found items yet.

                    </p>

                ) : (

                    <table className="items-table">

                        <thead>

                            <tr>

                                <th>
                                    Item
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Location
                                </th>

                                <th>
                                    Date Found
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

                            {items.map(
                                (item) => (

                                    <tr
                                        key={
                                            item.item_id
                                        }
                                    >

                                        <td>
                                            {
                                                item.item_name
                                            }
                                        </td>


                                        <td>
                                            {
                                                item.category
                                            }
                                        </td>


                                        <td>
                                            {
                                                item.location
                                            }
                                        </td>


                                        <td>
                                            {
                                                item.date_found
                                            }
                                        </td>


                                        <td>
                                            {
                                                item.contact_name
                                            }
                                        </td>


                                        <td className="actions-cell">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        item
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
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

                )}

            </div>

        </div>

    );
}