#!/usr/bin/env python3
"""
Gradio Chatbot UI for TA (Vườn sâm Ngọc Linh)
- Connect to Rasa NLU + Ollama LLM
- Vietnamese language support
- Chat history + responsive UI
"""

import os
import sys
import gradio as gr
from typing import List, Tuple
import requests
from datetime import datetime

# Environment
RASA_URL = os.getenv("RASA_URL", "http://localhost:5005")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

class TAChatbot:
    """TA Chatbot interface"""

    def __init__(self):
        self.rasa_url = RASA_URL
        self.ollama_url = OLLAMA_URL
        self.chat_history = []

    def send_message(self, message: str, history: List[Tuple[str, str]]) -> Tuple[List[Tuple[str, str]], str]:
        """
        Send message to chatbot (Rasa → Ollama)

        Args:
            message: User message
            history: Chat history for context

        Returns:
            Updated history + response text
        """
        try:
            # Call Rasa NLU
            response = requests.post(
                f"{self.rasa_url}/model/parse",
                json={"text": message},
                timeout=5
            )
            response.raise_for_status()
            rasa_result = response.json()

            intent = rasa_result.get("intent", {}).get("name", "unknown")
            confidence = rasa_result.get("intent", {}).get("confidence", 0)

            # If confidence low, fallback to LLaMA
            if confidence < 0.3:
                bot_response = self._call_llama(message)
            else:
                # Get response from Rasa action
                bot_response = self._get_rasa_response(intent, message)

            # Add to history
            history.append((message, bot_response))
            self.chat_history.append({
                "timestamp": datetime.now().isoformat(),
                "user": message,
                "bot": bot_response,
                "intent": intent,
                "confidence": confidence
            })

            return history, ""

        except Exception as e:
            error_msg = f"⚠️ Lỗi: {str(e)}"
            history.append((message, error_msg))
            return history, ""

    def _get_rasa_response(self, intent: str, message: str) -> str:
        """Get Rasa action response"""
        responses = {
            "ask_price": "Sâm của chúng tôi có nhiều loại, giá từ 500k đến 5 triệu. Bạn quan tâm loại nào?",
            "ask_shipping": "Giao hàng toàn quốc 1-3 ngày. Phí vận chuyển tùy địa chỉ. Bạn ở đâu?",
            "ask_benefits": "Sâm bổ khí, tăng sức đề kháng, cải thiện tuần hoàn máu. Thích hợp cho tất cả.",
            "ask_usage": "Uống nước sâm hàng ngày hoặc ăn sâm sống 1-2 lần/tuần. Liều 3-5g/lần.",
            "ask_quality": "Sâm 100% Ngọc Linh nguyên chất, có chứng chỉ, trồng hữu cơ.",
            "ask_product_types": "Bán: sâm tươi, sâm khô, nước sâm, viên sâm, trà sâm.",
            "ask_storage": "Sâm khô: hộp chuyên dụng, nơi khô, hạn 2 năm. Sâm tươi: tủ lạnh, 2-3 tuần.",
            "complain": "Chúng tôi rất tiếc! Liên hệ 0984999309 để được hỗ trợ nhanh nhất.",
            "greeting": "Xin chào! 👋 Mình là trợ lý của Vườn sâm Ngọc Linh nhà Khánh. Mình giúp gì được?",
            "goodbye": "Cảm ơn bạn! Hẹn gặp lại. 👋",
        }
        return responses.get(intent, self._call_llama(message))

    def _call_llama(self, message: str) -> str:
        """Fallback to LLaMA LLM"""
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": "llama2-7b-chat-q4_K_M",
                    "prompt": f"User: {message}\nAssistant:",
                    "stream": False
                },
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("response", "Xin lỗi, tôi không hiểu.")
        except Exception as e:
            return f"⚠️ LLM error: {str(e)}"

    def clear_history(self):
        """Clear chat history"""
        self.chat_history = []
        return []

# Initialize chatbot
chatbot = TAChatbot()

# Gradio interface
def create_interface():
    """Create Gradio UI"""
    with gr.Blocks(title="TA Chatbot 🤖", theme=gr.themes.Soft()) as demo:
        # Header
        gr.Markdown("""
        # 🌿 Vườn Sâm Ngọc Linh nhà Khánh
        #### Trợ lý khách hàng AI
        """)

        # Chat interface
        chatbot_ui = gr.Chatbot(
            label="Chat",
            height=400,
            show_copy_button=True
        )

        # Input
        with gr.Row():
            msg = gr.Textbox(
                label="Nhập câu hỏi",
                placeholder="Ví dụ: Sâm bao nhiêu tiền?",
                scale=5,
                lines=1
            )
            submit_btn = gr.Button("Gửi", scale=1, variant="primary")

        # Buttons
        with gr.Row():
            clear_btn = gr.Button("🗑️ Xóa lịch sử")
            info_btn = gr.Button("ℹ️ Thông tin")

        # Info
        info_text = gr.Markdown(visible=False)

        # Connect events
        submit_btn.click(
            chatbot.send_message,
            inputs=[msg, chatbot_ui],
            outputs=[chatbot_ui, msg]
        )

        msg.submit(
            chatbot.send_message,
            inputs=[msg, chatbot_ui],
            outputs=[chatbot_ui, msg]
        )

        clear_btn.click(
            chatbot.clear_history,
            outputs=chatbot_ui
        )

        def toggle_info():
            return gr.Markdown(visible=True, value="""
            ### 📋 Thông Tin
            - **Giờ làm việc:** 8h - 18h (Thứ 2 - Thứ 7)
            - **Hotline:** 0984999309
            - **Email:** tasamngoclinh@gmail.com
            - **Địa chỉ:** Vườn sâm Ngọc Linh nhà Khánh

            ### ⚙️ Cách sử dụng
            - Đặt câu hỏi về giá, vận chuyển, cách dùng
            - Trợ lý sẽ trả lời nhanh
            - Khiếu nại? Liên hệ hotline ngay!
            """)

        info_btn.click(toggle_info, outputs=info_text)

    return demo

if __name__ == "__main__":
    demo = create_interface()

    # Launch with server options for Vercel
    demo.launch(
        server_name="0.0.0.0",
        server_port=int(os.getenv("PORT", 7860)),
        share=False,
        show_error=True
    )
