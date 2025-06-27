const enhancedPrompt = `Analyze this image and determine if it shows a battery. Pay special attention to identifying the correct battery chemistry and type.

CRITICAL: Distinguish between these battery types:
1. PRIMARY (non-rechargeable) lithium batteries:
   - Lithium Thionyl Chloride (Li-SOCl2) - industrial, backup power
   - Lithium Manganese Dioxide (Li-MnO2) - coin cells, consumer
   - Lithium Iron Disulfide (Li-FeS2) - AA/AAA replacements

2. SECONDARY (rechargeable) lithium batteries:
   - Lithium-ion (Li-ion) - consumer electronics
   - Lithium Polymer (LiPo) - thin devices, drones
   - Lithium Iron Phosphate (LiFePO4) - power tools, EVs

Look for these indicators:
- Text mentioning "ER" models (usually Li-SOCl2 primary)
- "CR" models (usually Li-MnO2 primary) 
- Industrial/utility markings vs consumer markings
- Voltage ratings (3.6V often primary, 3.7V often rechargeable)

If it is a battery, provide detailed information including:
- Battery chemistry (be specific: Li-SOCl2, Li-ion, Li-MnO2, etc.)
- PRIMARY vs SECONDARY (rechargeable) classification
- Voltage rating and capacity
- Brand/manufacturer and model number
- Physical dimensions and form factor
- Intended applications and industry
- Safety warnings (especially for primary lithium - NOT rechargeable)
- Proper disposal/handling requirements

If it's NOT a battery, explain what the object appears to be.

SAFETY NOTE: Primary lithium batteries should NEVER be recharged and have different safety considerations.

Format your response as JSON:
{
    "is_battery": true/false,
    "object_type": "specific battery type or object description",
    "battery_classification": "PRIMARY" or "SECONDARY" (if battery),
    "battery_details": {
        "chemistry": "specific chemistry (Li-SOCl2, Li-ion, etc.)",
        "type": "detailed type description",
        "voltage": "",
        "capacity": "",
        "brand": "",
        "model": "",
        "dimensions": "",
        "certifications": "",
        "condition": "",
        "applications": "",
        "industry_use": "consumer/industrial/medical/etc"
    },
    "safety_warnings": "important safety information, especially for primary batteries",
    "confidence": "percentage",
    "additional_notes": ""
}`;

// Your API call
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: enhancedPrompt
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: image
                        }
                    }
                ]
            }
        ],
        max_tokens: 1500
    })
});