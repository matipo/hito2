import json, os, uuid, boto3
from datetime import datetime, timezone

TABLE_NAME = os.environ["TABLE_NAME"]
ddb = boto3.resource("dynamodb").Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        order = {
            "id": str(uuid.uuid4()),
            "items": body.get("items", []),
            "total": body.get("total", 0),
            "status": "PAGADO",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        ddb.put_item(Item=order)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"ok": True, "order_id": order["id"]}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"ok": False, "error": str(e)}),
        }
