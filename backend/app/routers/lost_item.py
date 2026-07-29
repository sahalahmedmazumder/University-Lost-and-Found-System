from fastapi import APIRouter, HTTPException

from app.schemas.lost_item import LostItem
from app.services.lost_item_service import (
    create_lost_item,
    delete_lost_item,
    get_all_lost_items,
    get_lost_item,
    update_lost_item,
)

router = APIRouter(prefix="/lost-items", tags=["Lost Items"])


@router.post("/")
async def create_lost_item_route(item: LostItem):
    saved_item = create_lost_item(item)
    return {"message": "Lost item reported successfully", "data": saved_item}


@router.get("/")
async def list_lost_items_route():
    items = get_all_lost_items()
    return {"data": items}


@router.get("/{item_id}")
async def get_lost_item_route(item_id: str):
    item = get_lost_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"data": item}


@router.put("/{item_id}")
async def update_lost_item_route(item_id: str, item: LostItem):
    if not get_lost_item(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
    updated_item = update_lost_item(item_id, item)
    return {"message": "Lost item updated successfully", "data": updated_item}


@router.delete("/{item_id}")
async def delete_lost_item_route(item_id: str):
    if not get_lost_item(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
    delete_lost_item(item_id)
    return {"message": "Lost item deleted successfully"}
