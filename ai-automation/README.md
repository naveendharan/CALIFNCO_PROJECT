# Califnco AI Social Media Automation Suite

Automates daily product spotlights for Instagram and WhatsApp Status without manual intervention.

## Features
- **Scheduled Daily Workflow**: Automated daily trigger at 09:00 AM IST (via n8n or Python scheduler daemon).
- **AI-Generated Product Imagery**: High-resolution photorealistic water purifier visuals generated via Hugging Face Inference API (`stabilityai/stable-diffusion-xl-base-1.0` / FLUX.1-schnell) or branded marketing card compositor.
- **AI-Generated Copy & Hashtags**: Converts product technical specifications into high-converting consumer and wholesale copy with emojis and 15+ relevant hashtags using Google Gemini / Groq API.
- **Public Image Hosting**: Cloudinary / ImgBB integration for generating public HTTPS URLs required by Meta Graph API.
- **Instagram Publishing**: Automated media container creation and publishing to Instagram Business Account via Meta Graph API v19.0.
- **Bonus (+10 pts) WhatsApp Status Automation**: Posts image and caption to WhatsApp Status via WAHA (WhatsApp HTTP API) running via Docker.

---

## 1. Quick Test Run (Standalone Python)
Run an immediate execution of today's spotlight product:
```bash
python daily_social_poster.py --once
```

Run as a continuous background daemon (scheduled daily at 09:00 AM IST):
```bash
python daily_social_poster.py --daemon
```

Sample generated output is saved in `./sample_output/`:
- Image: `sample_output/CAL-RO-001_daily_post.png`
- Caption: `sample_output/CAL-RO-001_caption.txt`
- Full Run Log: `sample_output/run_log_CAL-RO-001_*.json`

---

## 2. Docker & n8n Workflow Automation
To run the automated pipeline using n8n and WAHA:

1. Start containers:
```bash
docker compose up -d
```
2. Open n8n at `http://localhost:5678`.
3. Go to **Workflows** > **Import from File** > select `workflow-n8n.json`.
4. Configure credentials in n8n for:
   - `GEMINI_API_KEY` (captions)
   - `HUGGINGFACE_API_KEY` (image generation)
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` (public hosting)
   - `INSTAGRAM_ACCOUNT_ID` & `META_ACCESS_TOKEN` (Meta Graph API)
5. Activate the workflow. It will trigger automatically every day at 09:00 AM.

---

## 3. WAHA WhatsApp Status Setup (Bonus +10 pts)
WAHA provides a WhatsApp HTTP API server.
1. Once WAHA is started via `docker compose up -d`, navigate to `http://localhost:3000/dashboard`.
2. Scan the QR code using a secondary WhatsApp number.
3. The automated pipeline will post daily status updates to `/api/status` with zero manual effort!
