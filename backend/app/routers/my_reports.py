from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.services.my_reports_service import get_my_reports

router = APIRouter(
    prefix="/my-reports",
    tags=["My Reports"],
)


@router.get("/")
async def my_reports_route(
    filter: str = "All",
    current_user=Depends(get_current_user),
):
    reports = get_my_reports(current_user, filter)

    return {
        "data": reports,
    }