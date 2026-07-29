import uuid

from app.config import lost_items_table


def create_lost_item(item):
    item_dict = item.model_dump()
    item_dict["item_id"] = str(uuid.uuid4())
    lost_items_table.put_item(Item=item_dict)
    return item_dict


def get_all_lost_items():
    response = lost_items_table.scan()
    return response.get("Items", [])


def get_lost_item(item_id: str):
    response = lost_items_table.get_item(Key={"item_id": item_id})
    return response.get("Item")


def update_lost_item(item_id: str, item):
    item_dict = item.model_dump()
    item_dict["item_id"] = item_id
    lost_items_table.put_item(Item=item_dict)
    return item_dict


def delete_lost_item(item_id: str):
    lost_items_table.delete_item(Key={"item_id": item_id})
