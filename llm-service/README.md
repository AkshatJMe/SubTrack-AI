# dsService

## Environment setup

1. Copy `.env.example` to `.env`.
2. Set `GEMINI_API_KEY` to your Gemini API key.
3. If you want to use the free local fallback model instead, leave `GEMINI_API_KEY` empty and keep `HF_MODEL_NAME`.
4. Set `USE_CUDA=1` only if you have CUDA available and want GPU inference.

## Gemini API key instructions

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Create or select a project.
3. Enable the Generative AI API (Gemini API) for that project.
4. Create credentials / API key under "APIs & Services > Credentials".
5. Copy the key into `GEMINI_API_KEY` in your `.env` file.

## Install dependencies

Use:

```bash
pip install -r requirements.txt
```

## Notes

- By default, the service will use Gemini when `GEMINI_API_KEY` is set.
- If the key is missing, it falls back to a local Hugging Face model (`google/flan-t5-small`).
