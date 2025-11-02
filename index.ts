import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalPrompt, userIdea, characters, plot } = await req.json();
    
    if (!originalPrompt) {
      throw new Error('Original prompt is required');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Adapting prompt with user customizations...');

    const systemPrompt = `Ты - эксперт по адаптации промптов для AI-генераторов видео и изображений. Твоя задача - взять оригинальный промпт и переделать его под новые требования пользователя, сохранив стиль, качество и структуру.

Правила:
- Сохрани визуальный стиль и технические детали оригинала
- Адаптируй сюжет, персонажей и идею под запрос пользователя
- Промпт должен быть на английском языке
- Оптимизируй под AI-генераторы (Runway, Sora, Midjourney)
- Включи детали освещения, камеры, настроения
- Длина: 2-4 предложения`;
    
    let userPrompt = `Оригинальный промпт: ${originalPrompt}

Адаптируй этот промпт под новые параметры:`;

    if (userIdea) {
      userPrompt += `\n- Новая идея: ${userIdea}`;
    }
    if (characters) {
      userPrompt += `\n- Персонажи: ${characters}`;
    }
    if (plot) {
      userPrompt += `\n- Сюжет: ${plot}`;
    }

    userPrompt += `\n\nСоздай новый промпт, сохранив стиль оригинала, но с учетом новых параметров. Напиши ТОЛЬКО промпт на английском, без пояснений.`;

    console.log('Calling AI API...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const adaptedPrompt = data.choices[0].message.content.trim();
    
    console.log('Adapted prompt generated');

    return new Response(
      JSON.stringify({ 
        success: true,
        adaptedPrompt,
        originalPrompt,
        message: 'Prompt adapted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in adapt-prompt:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
