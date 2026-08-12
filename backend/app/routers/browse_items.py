from fastapi import APIRouter

from app.services.lost_item_service import get_all_lost_items
from app.services.found_item_service import get_all_found_items

router = APIRouter(
    prefix="/browse-items",
    tags=["Browse Items"],
)


@router.get("/")
async def browse_items(filter: str = "All"):
    if filter == "Lost":
        items = get_all_lost_items()

        for item in items:
            item["status"] = "Lost"

        return items

    elif filter == "Found":
        items = get_all_found_items()

        for item in items:
            item["status"] = "Found"

        return items

    else:
        lost_items = get_all_lost_items()

        for item in lost_items:
            item["status"] = "Lost"

        found_items = get_all_found_items()

        for item in found_items:
            item["status"] = "Found"

        return lost_items + found_items