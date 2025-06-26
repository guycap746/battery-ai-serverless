// netlify/functions/analyze-battery.js
exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { image } = JSON.parse(event.body);
    
    // Validate input
    if (!image) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'No image provided' })
      };
    }

    if (!image.startsWith('data:image/')) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid image format' })
      };
    }

    // Check environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY environment variable not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Server configuration error - missing API key' })
      };
    }

    console.log('🚀 Starting OpenAI API call...');
    console.log('📏 Image size:', Math.round(image.length / 1024), 'KB');

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image and determine if it shows a lithium battery. If it is a battery, provide detailed information including:
                - Battery type (lithium-ion, lithium polymer, etc.)
                - Voltage rating
                - Capacity (mAh/Ah if visible)
                - Brand/manufacturer
                - Model number
                - Physical dimensions if determinable
                - Safety warnings or certifications visible
                - Condition assessment
                - Common uses/applications
                
                If it's NOT a battery, simply respond with "NOT A BATTERY" and explain what the object appears to be.
                
                Format your response as JSON with the following structure:
                {
                    "is_battery": true/false,
                    "object_type": "description of what you see",
                    "battery_details": {
                        "type": "",
                        "voltage": "",
                        "capacity": "",
                        "brand": "",
                        "model": "",
                        "dimensions": "",
                        "certifications": "",
                        "condition": "",
                        "applications": ""
                    },
                    "confidence": "percentage",
                    "additional_notes": ""
                }`
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
        max_tokens: 1000
      })
    });

    console.log('📥 OpenAI response status:', openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      
      // Parse OpenAI error if possible
      let errorMessage = `OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage = `OpenAI API error: ${errorData.error.message}`;
        }
      } catch (parseError) {
        // Fallback if can't parse error
      }
      
      return {
        statusCode: openaiResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: errorMessage })
      };
    }

    const openaiData = await openaiResponse.json();
    console.log('✅ OpenAI response received');

    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
      console.error('Invalid OpenAI response structure:', openaiData);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid response from OpenAI API' })
      };
    }

    const analysisText = openaiData.choices[0].message.content;
    console.log('📝 Analysis text received:', analysisText.substring(0, 200) + '...');

    // Try to parse as JSON
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
      console.log('✅ Successfully parsed JSON response');
    } catch (parseError) {
      console.warn('⚠️ Could not parse as JSON, using fallback parsing');
      
      // Fallback parsing if not valid JSON
      analysisResult = {
        is_battery: analysisText.toLowerCase().includes('battery') && !analysisText.toLowerCase().includes('not a battery'),
        object_type: analysisText.substring(0, 200),
        confidence: "Unknown",
        additional_notes: analysisText
      };
    }

    // Return successful response
    console.log('🎯 Analysis complete, sending response');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisResult)
    };

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error: ' + error.message 
      })
    };
  }
};