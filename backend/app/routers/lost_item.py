from fastapi import APIRouter

from app.schemas.lost_item import LostItem
from app.services.lost_item_service import create_lost_item

router = APIRouter(prefix="/lost-items", tags=["Lost Items"])


@router.post("/")
async def create_lost_item_route(item: LostItem):

    saved_item = create_lost_item(item)

    return {
        "message": "Lost item reported successfully",
        "data": saved_item
    }