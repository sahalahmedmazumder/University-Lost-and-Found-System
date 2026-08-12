from pydantic import BaseModel


class FoundItem(BaseModel):
    item_name: str
    category: str
    description: str
    location: str
    date_found: str
    contact_name: str
    contact_phone: str