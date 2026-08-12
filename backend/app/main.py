from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.lost_item import router as lost_item_router
from app.routers.browse_items import router as browse_router
from app.routers.found_item import router as found_item_router
from app.routers.my_reports import router as my_reports_router
from app.routers.admin import router as admin_router


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://university-lost-and-found-system.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(auth_router)
app.include_router(lost_item_router)
app.include_router(browse_router)
app.include_router(found_item_router)
app.include_router(my_reports_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {
        "message": "Backend running"
    }