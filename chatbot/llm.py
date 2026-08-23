#!/usr/bin/env python3
"""
LangChain + Ollama LLM wrapper for TA Chatbot
- Local LLaMA 2 7B model (no API costs)
- Vietnamese language support
- Fast response (<5s per query)
"""

import os
import sys
import time
from typing import Optional
from datetime import datetime

# LangChain imports
from langchain.llms import Ollama
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Environment
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2-7b-chat-q4_K_M")  # Quantized for speed
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "30"))  # seconds

class TALLMClient:
    """TA Chatbot LLM Client using Ollama + LangChain"""

    def __init__(self, base_url: str = OLLAMA_URL, model: str = OLLAMA_MODEL):
        """Initialize LLM with Ollama backend"""
        self.base_url = base_url
        self.model = model
        self.llm = None
        self._initialize_llm()

    def _initialize_llm(self):
        """Initialize Ollama LLM via LangChain"""
        try:
            print(f"🚀 Initializing Ollama LLM...")
            print(f"   Model: {self.model}")
            print(f"   URL: {self.base_url}")

            self.llm = Ollama(
                base_url=self.base_url,
                model=self.model,
                temperature=0.7,  # balanced creativity + consistency
                top_p=0.9,
                top_k=40,
                num_predict=512,  # max output tokens
                num_ctx=2048,  # context window
                timeout=OLLAMA_TIMEOUT,
            )

            # Test connection
            print("✓ LLM initialized")
        except Exception as e:
            print(f"❌ Failed to initialize LLM: {e}")
            sys.exit(1)

    def chat(self, message: str, context: Optional[str] = None) -> dict:
        """
        Send message to LLM, get response

        Args:
            message: User query (Vietnamese or English)
            context: Optional system context (for Rasa integration)

        Returns:
            {
                "response": str,
                "model": str,
                "timestamp": str,
                "processing_time_ms": int
            }
        """
        start_time = time.time()

        try:
            # Build prompt with context
            prompt_text = self._build_prompt(message, context)

            # Call LLM
            response = self.llm(prompt_text)

            elapsed_ms = int((time.time() - start_time) * 1000)

            return {
                "response": response.strip(),
                "model": self.model,
                "timestamp": datetime.now().isoformat(),
                "processing_time_ms": elapsed_ms,
                "success": True,
            }

        except Exception as e:
            elapsed_ms = int((time.time() - start_time) * 1000)
            return {
                "response": f"⚠️ Error: {str(e)}",
                "model": self.model,
                "timestamp": datetime.now().isoformat(),
                "processing_time_ms": elapsed_ms,
                "success": False,
                "error": str(e),
            }

    def _build_prompt(self, message: str, context: Optional[str] = None) -> str:
        """Build system prompt + user message"""
        system_prompt = """Bạn là trợ lý khách hàng của công ty Vườn sâm Ngọc Linh nhà Khánh (TA).
Bạn nói tiếng Việt và tiếng Anh.
Bạn tư vấn về sâm Ngọc Linh, sức khỏe, cách dùng, giá cả, vận chuyển.
Trả lời ngắn gọn, thân thiện, hữu ích.
Nếu không biết, nói thực thà rằng không biết."""

        if context:
            prompt = f"""{system_prompt}

Context: {context}

User: {message}
Assistant:"""
        else:
            prompt = f"""{system_prompt}

User: {message}
Assistant:"""

        return prompt

    def stream_chat(self, message: str, context: Optional[str] = None):
        """Stream response token-by-token (for real-time UI)"""
        try:
            prompt_text = self._build_prompt(message, context)

            # Use streaming callback for real-time output
            handler = StreamingStdOutCallbackHandler()
            chain = LLMChain(
                llm=Ollama(
                    base_url=self.base_url,
                    model=self.model,
                    callbacks=[handler],
                ),
                prompt=PromptTemplate(
                    input_variables=[],
                    template=prompt_text,
                ),
            )

            chain.run({})

        except Exception as e:
            print(f"❌ Stream error: {e}")

    def health_check(self) -> bool:
        """Check if Ollama is accessible"""
        try:
            import requests
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False


# CLI usage
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="TA Chatbot LLM Client")
    parser.add_argument("--message", "-m", type=str, help="User message to send")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive mode")
    parser.add_argument("--health", action="store_true", help="Check LLM health")

    args = parser.parse_args()

    # Initialize client
    client = TALLMClient()

    if args.health:
        status = "✓ Healthy" if client.health_check() else "❌ Unavailable"
        print(f"Ollama health: {status}")
        sys.exit(0 if client.health_check() else 1)

    if args.message:
        # Single message mode
        result = client.chat(args.message)
        print("\n📝 Response:")
        print(result["response"])
        print(f"\n⏱️  Time: {result['processing_time_ms']}ms")

    elif args.interactive:
        # Interactive chat mode
        print("🤖 TA Chatbot (type 'quit' to exit)")
        print("-" * 40)

        while True:
            user_input = input("\nYou: ").strip()
            if user_input.lower() in ["quit", "exit", "q"]:
                print("Goodbye! 👋")
                break

            result = client.chat(user_input)
            print(f"\nBot: {result['response']}")
            print(f"({result['processing_time_ms']}ms)")

    else:
        print("Usage: python chatbot/llm.py --message 'your question' or --interactive or --health")
        parser.print_help()
