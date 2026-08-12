from fastapi import HTTPException, status

from app.config import dynamodb


users_table = dynamodb.Table("Users")
lost_items_table = dynamodb.Table("LostItems")
found_items_table = dynamodb.Table("FoundItems")


class AdminService:

    # ==========================================
    # USERS
    # ==========================================

    @staticmethod
    def get_all_users():

        response = users_table.scan()

        users = []

        for user in response.get("Items", []):

            users.append({
                "user_id": user.get("user_id"),
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role", "user"),
                "flagged": user.get("flagged", False),
            })

        return users


    @staticmethod
    def get_user(user_id: str):

        response = users_table.get_item(
            Key={
                "user_id": user_id
            }
        )

        user = response.get("Item")

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return {
            "user_id": user.get("user_id"),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role", "user"),
            "flagged": user.get("flagged", False),
        }


    @staticmethod
    def delete_user(user_id: str):

        response = users_table.get_item(
            Key={
                "user_id": user_id
            }
        )

        if "Item" not in response:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        users_table.delete_item(
            Key={
                "user_id": user_id
            }
        )

        return {
            "message": "User deleted successfully"
        }


    @staticmethod
    def flag_user(
        user_id: str,
        flagged: bool
    ):

        response = users_table.get_item(
            Key={
                "user_id": user_id
            }
        )

        user = response.get("Item")

        if not user:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        users_table.update_item(
            Key={
                "user_id": user_id
            },
            UpdateExpression="SET flagged = :flagged",
            ExpressionAttributeValues={
                ":flagged": flagged
            },
            ReturnValues="ALL_NEW",
        )

        return {
            "message":
                "User flagged successfully"
                if flagged
                else
                "User unflagged successfully",

            "user_id": user_id,

            "flagged": flagged,
        }


    # ==========================================
    # ITEMS
    # ==========================================

    @staticmethod
    def get_all_items():

        lost_response = lost_items_table.scan()
        found_response = found_items_table.scan()

        lost_items = lost_response.get("Items", [])
        found_items = found_response.get("Items", [])

        items = []

        # -----------------------------
        # LOST ITEMS
        # -----------------------------

        for item in lost_items:

            items.append({
                "item_id": item.get("item_id"),
                "item_name": item.get("item_name"),
                "category": item.get("category"),
                "description": item.get("description"),
                "location": item.get("location"),
                "contact_name": item.get("contact_name"),
                "contact_phone": item.get("contact_phone"),
                "status": "Lost",
                "date_lost": item.get("date_lost"),
                "date_found": None,
            })


        # -----------------------------
        # FOUND ITEMS
        # -----------------------------

        for item in found_items:

            items.append({
                "item_id": item.get("item_id"),
                "item_name": item.get("item_name"),
                "category": item.get("category"),
                "description": item.get("description"),
                "location": item.get("location"),
                "contact_name": item.get("contact_name"),
                "contact_phone": item.get("contact_phone"),
                "status": "Found",
                "date_lost": None,
                "date_found": item.get("date_found"),
            })


        return items


    @staticmethod
    def delete_item(item_id: str):

        # Check LostItems first

        lost_response = lost_items_table.get_item(
            Key={
                "item_id": item_id
            }
        )

        if "Item" in lost_response:

            lost_items_table.delete_item(
                Key={
                    "item_id": item_id
                }
            )

            return {
                "message": "Lost item deleted successfully"
            }


        # Check FoundItems

        found_response = found_items_table.get_item(
            Key={
                "item_id": item_id
            }
        )

        if "Item" in found_response:

            found_items_table.delete_item(
                Key={
                    "item_id": item_id
                }
            )

            return {
                "message": "Found item deleted successfully"
            }


        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )