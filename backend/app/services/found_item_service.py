import uuid

from boto3.dynamodb.conditions import Key

from app.config import found_items_table


def create_found_item(item, current_user):
    item_dict = item.model_dump()

    item_dict["item_id"] = str(uuid.uuid4())
    item_dict["user_id"] = current_user["user_id"]

    found_items_table.put_item(Item=item_dict)

    return item_dict


def get_all_found_items():
    response = found_items_table.scan()

    return response.get("Items", [])


def get_my_found_items(current_user):
    response = found_items_table.query(
        IndexName="user_id-index",
        KeyConditionExpression=Key("user_id").eq(
            current_user["user_id"]
        ),
    )

    return response.get("Items", [])


def get_found_item(item_id: str):
    response = found_items_table.get_item(
        Key={
            "item_id": item_id,
        }
    )

    return response.get("Item")


def update_found_item(
    item_id: str,
    item,
    current_user,
):
    item_dict = item.model_dump()

    item_dict["item_id"] = item_id
    item_dict["user_id"] = current_user["user_id"]

    found_items_table.put_item(Item=item_dict)

    return item_dict


def delete_found_item(item_id: str):
    found_items_table.delete_item(
        Key={
            "item_id": item_id,
        }
    )