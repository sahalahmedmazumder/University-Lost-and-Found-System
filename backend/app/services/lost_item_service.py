import uuid

from boto3.dynamodb.conditions import Key

from app.config import lost_items_table


# =========================================================
# CREATE LOST ITEM
# =========================================================

def create_lost_item(item, current_user):
    item_dict = item.model_dump()

    item_dict["item_id"] = str(uuid.uuid4())
    item_dict["user_id"] = current_user["user_id"]

    lost_items_table.put_item(
        Item=item_dict
    )

    return item_dict


# =========================================================
# GET ALL LOST ITEMS
# PUBLIC
# =========================================================

def get_all_lost_items():
    response = lost_items_table.scan()

    return response.get("Items", [])


# =========================================================
# GET MY LOST ITEMS
# LOGIN REQUIRED
# =========================================================

def get_my_lost_items(current_user):
    response = lost_items_table.query(
        IndexName="user_id-index",
        KeyConditionExpression=Key("user_id").eq(
            current_user["user_id"]
        ),
    )

    return response.get("Items", [])


# =========================================================
# GET SINGLE LOST ITEM
# =========================================================

def get_lost_item(item_id: str):
    response = lost_items_table.get_item(
        Key={
            "item_id": item_id
        }
    )

    return response.get("Item")


# =========================================================
# UPDATE LOST ITEM
# LOGIN REQUIRED
# =========================================================

def update_lost_item(
    item_id: str,
    item,
    current_user,
):
    # First find the existing item
    existing_item = get_lost_item(item_id)

    if not existing_item:
        return None

    # Make sure the user owns this item
    if existing_item.get("user_id") != current_user["user_id"]:
        return None

    # Get new form data
    item_dict = item.model_dump()

    # Preserve identifiers
    item_dict["item_id"] = item_id
    item_dict["user_id"] = current_user["user_id"]

    # Save updated item
    lost_items_table.put_item(
        Item=item_dict
    )

    return item_dict


# =========================================================
# DELETE LOST ITEM
# LOGIN REQUIRED
# =========================================================

def delete_lost_item(
    item_id: str,
    current_user,
):
    # Find existing item
    existing_item = get_lost_item(item_id)

    if not existing_item:
        return False

    # Make sure user owns this item
    if existing_item.get("user_id") != current_user["user_id"]:
        return False

    lost_items_table.delete_item(
        Key={
            "item_id": item_id
        }
    )

    return True