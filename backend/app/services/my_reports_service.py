from boto3.dynamodb.conditions import Key

from app.config import (
    lost_items_table,
    found_items_table,
)


def get_my_reports(current_user, filter: str):
    user_id = current_user["user_id"]

    reports = []

    if filter in ["All", "Lost"]:

        response = lost_items_table.query(
            IndexName="user_id-index",
            KeyConditionExpression=Key("user_id").eq(user_id),
        )

        lost_items = response.get("Items", [])

        for item in lost_items:
            item["status"] = "Lost"

        reports.extend(lost_items)

    if filter in ["All", "Found"]:

        response = found_items_table.query(
            IndexName="user_id-index",
            KeyConditionExpression=Key("user_id").eq(user_id),
        )

        found_items = response.get("Items", [])

        for item in found_items:
            item["status"] = "Found"

        reports.extend(found_items)

    reports.sort(
        key=lambda x: x.get("date_found") or x.get("date_lost"),
        reverse=True,
    )

    return reports