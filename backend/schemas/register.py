from typing import Dict, List

def serializeDict(item: Dict) -> Dict:
    return {
        "id": str(item["_id"]) if "_id" in item else None,
        "name": item.get("name"),
        "email": item.get("email"),
        "password": item.get("password"),
        "type": item.get("type")
    }

def serializeList(entity: List[Dict]) -> List[Dict]:
    return [serializeDict(item) for item in entity]
