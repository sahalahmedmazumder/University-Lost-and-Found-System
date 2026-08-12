from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import (
    get_current_user,
    require_active_user,
)

from app.schemas.found_item import FoundItem

from app.services.found_item_service import (
    create_found_item,
    delete_found_item,
    get_all_found_items,
    get_found_item,
    get_my_found_items,
    update_found_item,
)


router = APIRouter(
    prefix="/found-items",
    tags=["Found Items"],
)


# =========================================================
# CREATE FOUND ITEM
# =========================================================

@router.post("/")
async def create_found_item_route(
    item: FoundItem,
    current_user=Depends(require_active_user),
):
    saved_item = create_found_item(
        item,
        current_user,
    )

    return {
        "message": "Found item reported successfully",
        "data": saved_item,
    }


# =========================================================
# BROWSE ALL FOUND ITEMS
# =========================================================

@router.get("/")
async def list_found_items_route():
    items = get_all_found_items()

    return {
        "data": items,
    }


# =========================================================
# MY FOUND ITEMS
# =========================================================

@router.get("/my-items")
async def my_found_items_route(
    current_user=Depends(get_current_user),
):
    items = get_my_found_items(current_user)

    return {
        "data": items,
    }


# =========================================================
# GET SINGLE FOUND ITEM
# =========================================================

@router.get("/{item_id}")
async def get_found_item_route(item_id: str):
    item = get_found_item(item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found",
        )

    return {
        "data": item,
    }


# =========================================================
# UPDATE FOUND ITEM
# =========================================================

@router.put("/{item_id}")
async def update_found_item_route(
    item_id: str,
    item: FoundItem,
    current_user=Depends(get_current_user),
):
    existing_item = get_found_item(item_id)

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Item not found",
        )

    # Check ownership
    if existing_item.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only edit your own found items",
        )

    updated_item = update_found_item(
        item_id,
        item,
        current_user,
    )

    return {
        "message": "Found item updated successfully",
        "data": updated_item,
    }


# =========================================================
# DELETE FOUND ITEM
# =========================================================

@router.delete("/{item_id}")
async def delete_found_item_route(
    item_id: str,
    current_user=Depends(get_current_user),
):
    existing_item = get_found_item(item_id)

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Item not found",
        )

    # Check ownership
    if existing_item.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own found items",
        )

    delete_found_item(item_id)

    return {
        "message": "Found item deleted successfully",
    }