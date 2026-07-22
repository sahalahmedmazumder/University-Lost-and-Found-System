import uuid

from app.config import lost_items_table


def create_lost_item(item):
    item_dict = item.model_dump()

    item_dict["item_id"] = str(uuid.uuid4())

    lost_items_table.put_item(Item=item_dict)

    return item_dict
