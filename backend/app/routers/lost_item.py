from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import (
    get_current_user,
    require_active_user,
)

from app.schemas.lost_item import LostItem

from app.services.lost_item_service import (
    create_lost_item,
    delete_lost_item,
    get_all_lost_items,
    get_lost_item,
    get_my_lost_items,
    update_lost_item,
)


router = APIRouter(
    prefix="/lost-items",
    tags=["Lost Items"],
)


# =========================================================
# CREATE
# =========================================================

@router.post("/")
async def create_lost_item_route(
    item: LostItem,
    current_user=Depends(require_active_user),
):
    saved_item = create_lost_item(
        item,
        current_user,
    )

    return {
        "message": "Lost item reported successfully",
        "data": saved_item,
    }


# =========================================================
# BROWSE ALL
# =========================================================

@router.get("/")
async def list_lost_items_route():
    items = get_all_lost_items()

    return {
        "data": items,
    }


# =========================================================
# MY ITEMS
# =========================================================

@router.get("/my-items")
async def my_lost_items_route(
    current_user=Depends(get_current_user),
):
    items = get_my_lost_items(
        current_user
    )

    return {
        "data": items,
    }


# =========================================================
# GET SINGLE
# =========================================================

@router.get("/{item_id}")
async def get_lost_item_route(
    item_id: str,
):
    item = get_lost_item(item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found",
        )

    return {
        "data": item,
    }


# =========================================================
# UPDATE
# =========================================================

@router.put("/{item_id}")
async def update_lost_item_route(
    item_id: str,
    item: LostItem,
    current_user=Depends(get_current_user),
):
    existing_item = get_lost_item(item_id)

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Item not found",
        )

    # Check ownership
    if existing_item.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only edit your own lost items",
        )

    updated_item = update_lost_item(
        item_id,
        item,
        current_user,
    )

    if not updated_item:
        raise HTTPException(
            status_code=403,
            detail="Unable to update this item",
        )

    return {
        "message": "Lost item updated successfully",
        "data": updated_item,
    }


# =========================================================
# DELETE
# =========================================================

@router.delete("/{item_id}")
async def delete_lost_item_route(
    item_id: str,
    current_user=Depends(get_current_user),
):
    existing_item = get_lost_item(item_id)

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Item not found",
        )

    if existing_item.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own lost items",
        )

    deleted = delete_lost_item(
        item_id,
        current_user,
    )

    if not deleted:
        raise HTTPException(
            status_code=403,
            detail="Unable to delete this item",
        )

    return {
        "message": "Lost item deleted successfully",
    }