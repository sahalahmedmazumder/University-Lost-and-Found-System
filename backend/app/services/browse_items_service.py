from app.config import dynamodb

lost_table = dynamodb.Table("LostItems")


class BrowseItemsService:

    @staticmethod
    def get_items(filter_type: str = "All"):

        response = lost_table.scan()

        items = response.get("Items", [])

        # Every item in this table is currently a Lost item
        for item in items:
            item["status"] = "Lost"

        if filter_type == "Lost":
            return items

        if filter_type == "Found":
            return []

        return items