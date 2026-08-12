from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import get_current_user
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


# Create Found Item (Login Required)
@router.post("/")
async def create_found_item_route(
    item: FoundItem,
    current_user=Depends(get_current_user),
):
    saved_item = create_found_item(item, current_user)

    return {
        "message": "Found item reported successfully",
        "data": saved_item,
    }


# Browse All Found Items (Public)
@router.get("/")
async def list_found_items_route():
    items = get_all_found_items()

    return {
        "data": items,
    }


# My Found Items (Login Required)
@router.get("/my-items")
async def my_found_items_route(
    current_user=Depends(get_current_user),
):
    items = get_my_found_items(current_user)

    return {
        "data": items,
    }


# Get Single Found Item
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


# Update Found Item (Login Required)
@router.put("/{item_id}")
async def update_found_item_route(
    item_id: str,
    item: FoundItem,
    current_user=Depends(get_current_user),
):
    if not get_found_item(item_id):
        raise HTTPException(
            status_code=404,
            detail="Item not found",
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


# Delete Found Item
@router.delete("/{item_id}")
async def delete_found_item_route(item_id: str):
    if not get_found_item(item_id):
        raise HTTPException(
            status_code=404,
            detail="Item not found",
        )

    delete_found_item(item_id)

    return {
        "message": "Found item deleted successfully",
    }