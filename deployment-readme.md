# Battery AI - Serverless Edition

🚀 **Fully serverless battery identification powered by OpenAI GPT-4V + Vercel + Upstash**

## 🏗️ Architecture

```
Frontend (HTML/JS) → Vercel Functions → OpenAI GPT-4V
                           ↓
                    Upstash Redis (Storage)
```

## 📋 Prerequisites

1. **OpenAI Account** - [platform.openai.com](https://platform.openai.com)
2. **Vercel Account** - [vercel.com](https://vercel.com) 
3. **Upstash Account** - [upstash.com](https://upstash.com) (optional, for analytics)

## 🚀 Quick Deploy

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/battery-ai)

### Option 2: Manual Deploy

1. **Clone/Download Files**
   ```bash
   # Create project directory
   mkdir battery-ai-serverless
   cd battery-ai-serverless
   
   # Add the files (see file structure below)
   ```

2. **Set Up Environment Variables**
   
   Get your OpenAI API key:
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create new secret key
   - Copy the key (starts with `sk-`)

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Add environment variables
   vercel env add OPENAI_API_KEY
   # Paste your OpenAI API key when prompted
   
   # Redeploy with env vars
   vercel --prod
   ```

## 📁 File Structure

```
battery-ai-serverless/
├── index.html              # Main frontend (from first artifact)
├── api/
│   └── analyze-battery.js   # Serverless function (from second artifact)
├── vercel.json             # Vercel configuration (from third artifact)
└── README.md               # This file
```

## ⚙️ Environment Variables

Set these in your Vercel dashboard (Settings → Environment Variables):

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key (sk-...) |
| `UPSTASH_REDIS_REST_URL` | ❌ Optional | Redis URL for analytics |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ Optional | Redis token for analytics |

## 🔧 Optional: Set Up Upstash Redis

For analytics and usage tracking:

1. Go to [upstash.com](https://upstash.com)
2. Create free account
3. Create new Redis database
4. Copy REST URL and Token
5. Add to Vercel environment variables

## 💰 Cost Breakdown

**Vercel (Serverless Functions)**
- Free: 100GB bandwidth, 6,000 function hours/month
- Pro: $20/month for additional usage

**OpenAI API**
- GPT-4V: ~$0.01-0.02 per image analysis
- Varies by image size and complexity

**Upstash Redis (Optional)**
- Free: 10,000 requests/day
- Pay-as-you-go beyond free tier

**Total for moderate usage**: $5-20/month

## 🧪 Testing

1. **Local Development**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Run locally
   vercel dev
   ```

2. **Production Testing**
   - Upload test images
   - Check browser console for debugging
   - Monitor Vercel function logs

## 🔍 Debugging

**Common Issues:**

1. **404 on API calls**
   - Check file structure: `api/analyze-battery.js`
   - Verify deployment completed successfully

2. **500 Internal Server Error**
   - Check environment variables are set
   - View Vercel function logs
   - Verify OpenAI API key is valid

3. **OpenAI API Errors**
   - Ensure billing is set up in OpenAI account
   - Check API key permissions
   - Verify image size is under limits

**Debug Tools:**
- Vercel Dashboard → Functions → View Logs
- Browser Console (F12)
- Built-in debug info in error messages

## 🚀 Features

- ✅ **Zero Infrastructure Management**
- ✅ **Automatic Scaling**
- ✅ **Secure API Key Handling**
- ✅ **Image Optimization**
- ✅ **Real-time Analysis**
- ✅ **Mobile Camera Support**
- ✅ **Error Handling & Debugging**
- ✅ **Optional Analytics Storage**

## 🔄 Updates

To update the app:
1. Modify files locally
2. Run `vercel --prod` to redeploy
3. Changes go live immediately

## 📝 License

MIT License - feel free to modify and distribute!

## 🆘 Support

Need help? Check:
- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Upstash Documentation](https://docs.upstash.com)

---

**Built with ❤️ using serverless technologies**