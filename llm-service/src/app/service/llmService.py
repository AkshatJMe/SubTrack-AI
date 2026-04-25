from typing import Optional
import json
import os
import re
from dotenv import load_dotenv
from transformers import pipeline
import google.generativeai as genai
from app.service.Expense import Expense

class LLMService:
    def __init__(self):
        load_dotenv()
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.gemini_model = os.getenv('GEMINI_MODEL_NAME', 'gemini-1.5-mini')
        self.hf_model = os.getenv('HF_MODEL_NAME', 'google/flan-t5-small')
        self.use_cuda = os.getenv('USE_CUDA', '0') == '1'
        self.device = 0 if self.use_cuda else -1

        self.prompt_template = (
            "Extract the transaction details from this bank SMS message. "
            "Return a valid JSON object with keys amount, merchant, and currency. "
            "If a value is missing, use null. Do not add any extra keys.\n\n"
            "SMS: {message}\n\nJSON:"
        )

        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
        else:
            self.generator = pipeline(
                'text2text-generation',
                model=self.hf_model,
                device=self.device,
                max_length=256,
                do_sample=False,
                temperature=0.0,
            )

    def runLLM(self, message: str) -> Optional[Expense]:
        if not message or not isinstance(message, str):
            return None

        prompt = self.prompt_template.format(message=message.strip())

        if self.gemini_api_key:
            generated_text = self._run_gemini(prompt)
        else:
            prediction = self.generator(prompt, truncation=True)
            generated_text = prediction[0]['generated_text'] if isinstance(prediction, list) else str(prediction)

        parsed = self._parse_model_output(generated_text)
        return Expense(**parsed)

    def _run_gemini(self, prompt: str) -> str:
        response = genai.generate_text(
            model=self.gemini_model,
            prompt=prompt,
            temperature=0.0,
            max_output_tokens=256,
        )

        if hasattr(response, 'text') and response.text:
            return response.text
        if hasattr(response, 'candidates') and response.candidates:
            first_candidate = response.candidates[0]
            return getattr(first_candidate, 'content', '') or getattr(first_candidate, 'text', '')
        return str(response)

    def _parse_model_output(self, text: str) -> dict:
        json_text = self._extract_json(text)
        if json_text:
            try:
                parsed = json.loads(json_text)
                return {
                    'amount': parsed.get('amount'),
                    'merchant': parsed.get('merchant'),
                    'currency': parsed.get('currency'),
                }
            except json.JSONDecodeError:
                pass

        return self._fallback_extract(text)

    def _extract_json(self, text: str) -> Optional[str]:
        start = text.find('{')
        end = text.rfind('}')
        if start >= 0 and end > start:
            return text[start:end + 1]
        return None

    def _fallback_extract(self, text: str) -> dict:
        return {
            'amount': self._extract_amount(text),
            'merchant': self._extract_merchant(text),
            'currency': self._extract_currency(text),
        }

    def _extract_amount(self, text: str) -> Optional[str]:
        match = re.search(r'(?:USD|EUR|GBP|INR|CAD|AUD|JPY|₹|Rs\.?|\$)\s*([0-9]+(?:[.,][0-9]{2})?)', text, flags=re.IGNORECASE)
        return match.group(1) if match else None

    def _extract_currency(self, text: str) -> Optional[str]:
        match = re.search(r'\b(USD|EUR|GBP|INR|CAD|AUD|JPY|₹|Rs\.?|\$)\b', text, flags=re.IGNORECASE)
        if not match:
            return None
        token = match.group(1).upper()
        if token in ['₹', 'RS', 'RS.', 'INR']:
            return 'INR'
        if token == '$':
            return 'USD'
        return token

    def _extract_merchant(self, text: str) -> Optional[str]:
        match = re.search(r'\b(?:at|to|from|via)\s+([A-Za-z0-9&\- ]+?)(?:\s+(?:on|for|in|with|ref|txn|trxn|amount)|$)', text, flags=re.IGNORECASE)
        if match:
            merchant = match.group(1).strip()
            return merchant if merchant else None
        return None