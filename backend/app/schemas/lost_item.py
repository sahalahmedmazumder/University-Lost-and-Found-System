from pydantic import BaseModel


class LostItem(BaseModel):
    item_name: str
    category: str
    description: str
    location: str
    date_lost: str
    contact_name: str
    contact_phone: str