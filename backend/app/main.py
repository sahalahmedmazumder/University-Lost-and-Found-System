from app.routers.lost_item import router as lost_item_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.health import router as health_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)

app.include_router(lost_item_router)


@app.get("/")
def root():
    return {"message": "Backend running"}