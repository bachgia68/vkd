"""
Rasa Custom Actions for TA Chatbot
- Fetch products from Strapi
- Get pricing info
- Log conversations to Supabase
- Fallback to LLaMA LLM
"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import os
import json
import requests
from datetime import datetime

# Environment
STRAPI_URL = os.getenv("STRAPI_URL", "http://localhost:1337")
STRAPI_TOKEN = os.getenv("STRAPI_API_TOKEN", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Strapi API client
class StrapiClient:
    def __init__(self, url: str, token: str):
        self.url = url
        self.token = token
        self.headers = {"Authorization": f"Bearer {token}"}

    def get_products(self, limit: int = 10) -> List[Dict]:
        """Fetch all products from Strapi"""
        try:
            response = requests.get(
                f"{self.url}/api/products?pagination[limit]={limit}",
                headers=self.headers,
                timeout=5
            )
            response.raise_for_status()
            return response.json().get("data", [])
        except Exception as e:
            print(f"Error fetching products: {e}")
            return []

    def search_product(self, name: str) -> Dict:
        """Search product by name"""
        try:
            response = requests.get(
                f"{self.url}/api/products?filters[name][$contains]={name}",
                headers=self.headers,
                timeout=5
            )
            response.raise_for_status()
            products = response.json().get("data", [])
            return products[0] if products else None
        except Exception as e:
            print(f"Error searching product: {e}")
            return None

# Supabase logger
class SupabaseLogger:
    def __init__(self, url: str, key: str):
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Content-Type": "application/json"
        }

    def log_message(self, user_id: str, message: str, intent: str, response: str):
        """Log conversation to Supabase"""
        if not self.url or not self.key:
            return False

        try:
            data = {
                "user_id": user_id,
                "message": message,
                "intent": intent,
                "response": response,
                "timestamp": datetime.now().isoformat(),
                "source": "chatbot"
            }
            response = requests.post(
                f"{self.url}/rest/v1/conversations",
                headers=self.headers,
                json=data,
                timeout=5
            )
            return response.status_code in [200, 201]
        except Exception as e:
            print(f"Error logging to Supabase: {e}")
            return False

# Initialize clients
strapi = StrapiClient(STRAPI_URL, STRAPI_TOKEN)
logger = SupabaseLogger(SUPABASE_URL, SUPABASE_KEY)

# Actions
class ActionFetchProducts(Action):
    """Fetch products from Strapi"""

    def name(self) -> Text:
        return "action_fetch_products"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        products = strapi.get_products(limit=5)

        if products:
            product_list = "\n".join([
                f"• {p.get('name')}: {p.get('price'):,.0f} VND"
                for p in products[:5]
            ])
            message = f"Sâm Ngọc Linh của chúng tôi:\n{product_list}"
        else:
            message = "Hiện tại chúng tôi không có sâm nào. Vui lòng liên hệ sau!"

        dispatcher.utter_message(text=message)
        return []

class ActionGetPrice(Action):
    """Get price of specific product"""

    def name(self) -> Text:
        return "action_get_price"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        # Get product name from latest message or slot
        last_message = tracker.latest_message.get("text", "")
        product = strapi.search_product(last_message)

        if product:
            name = product.get("name", "Sâm")
            price = product.get("price", 0)
            message = f"{name}: {price:,.0f} VND"
        else:
            message = "Xin lỗi, tôi không tìm thấy sâm bạn hỏi. Có thể bạn nói cái tên khác không?"

        dispatcher.utter_message(text=message)
        return []

class ActionLogComplaint(Action):
    """Log complaint to support team"""

    def name(self) -> Text:
        return "action_log_complaint"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        sender_id = tracker.sender_id
        complaint = tracker.latest_message.get("text", "")

        # Log to Supabase
        logger.log_message(sender_id, complaint, "complain", "logged")

        message = "Chúng tôi đã ghi nhận khiếu nại của bạn. Đội hỗ trợ sẽ liên hệ ngay! ☎️"
        dispatcher.utter_message(text=message)

        return [SlotSet("complaint_logged", True)]

class ActionDefaultFallback(Action):
    """Fallback: when intent confidence is low, use LLaMA LLM"""

    def name(self) -> Text:
        return "action_default_fallback"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        # Get user message
        user_message = tracker.latest_message.get("text", "")

        # Call LLaMA for open-ended answer
        try:
            from chatbot.llm import TALLMClient
            llm = TALLMClient()
            result = llm.chat(user_message)

            if result["success"]:
                dispatcher.utter_message(text=result["response"])
            else:
                dispatcher.utter_message(
                    text="Xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng hỏi khác!"
                )
        except Exception as e:
            print(f"LLaMA fallback error: {e}")
            dispatcher.utter_message(
                text="Tôi gặp lỗi. Vui lòng thử lại sau!"
            )

        return []

class ActionLogConversation(Action):
    """Log all conversations to Supabase for analytics"""

    def name(self) -> Text:
        return "action_log_conversation"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        sender_id = tracker.sender_id
        user_message = tracker.latest_message.get("text", "")
        intent = tracker.latest_message.get("intent", {}).get("name", "unknown")
        response = tracker.latest_action_name or "none"

        # Log asynchronously (don't block response)
        logger.log_message(sender_id, user_message, intent, response)

        return []
