from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_admin
from app.services.admin_service import AdminService


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# =========================================================
# USERS
# =========================================================


# GET ALL USERS

@router.get("/users")
async def get_all_users(
    current_admin=Depends(get_current_admin),
):

    users = AdminService.get_all_users()

    return {
        "data": users,
    }


# GET SINGLE USER

@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    current_admin=Depends(get_current_admin),
):

    user = AdminService.get_user(
        user_id
    )

    return {
        "data": user,
    }


# FLAG / UNFLAG USER

@router.put("/users/{user_id}/flag")
async def flag_user(
    user_id: str,
    flagged: bool,
    current_admin=Depends(get_current_admin),
):

    result = AdminService.flag_user(
        user_id,
        flagged,
    )

    return result


# DELETE USER

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_admin=Depends(get_current_admin),
):

    result = AdminService.delete_user(
        user_id
    )

    return result


# =========================================================
# ITEMS
# =========================================================


# GET ALL ITEMS

@router.get("/items")
async def get_all_items(
    current_admin=Depends(get_current_admin),
):

    items = AdminService.get_all_items()

    return {
        "data": items,
    }


# DELETE ITEM

@router.delete("/items/{item_id}")
async def delete_item(
    item_id: str,
    current_admin=Depends(get_current_admin),
):

    result = AdminService.delete_item(
        item_id
    )

    return result