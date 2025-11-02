# 🏭 Auto Buzz Factory ULTIMATE 2025 - N8N Workflow

## 📋 Описание

Полностью автоматизированный конвейер для создания вирусного видео-контента с использованием современных AI-моделей.

## 🎯 Возможности

### 1. **Сбор трендов** (7 источников RSS)
- TechCrunch
- The Verge  
- Wired
- Ars Technica
- Habr AI
- VC.ru AI
- Tproger AI

### 2. **AI-анализ и генерация сценариев**
- **Gemini 2.0 Flash** - основной генератор сценариев
- **Groq Llama 3.3 70B** - fallback для генерации
- **GPT-5** - расширение промптов для видео

### 3. **Генерация контента**
- **DALL-E 3** - создание обложек (thumbnails)
- **Sora 2.0** - генерация видео (primary)
- **Google Veo 3** - fallback #1
- **Runway Gen-3** - fallback #2
- **Luma Dream Machine** - fallback #3
- **ElevenLabs** - озвучка (Text-to-Speech)

### 4. **Автопубликация**
- YouTube Shorts
- Instagram Reels
- TikTok

### 5. **Аналитика и уведомления**
- Google Sheets - логирование всех публикаций
- Telegram Bot - мгновенные уведомления

## 🔧 Настройка

### Шаг 1: API Ключи

Вам понадобятся следующие API ключи:

1. **Google AI (Gemini + Veo)**
   - Получить: https://makersuite.google.com/app/apikey
   - Для: Gemini 2.0 Flash, Google Veo 3

2. **Groq**
   - Получить: https://console.groq.com/keys
   - Для: Llama 3.3 70B (fallback LLM)

3. **OpenAI**
   - Получить: https://platform.openai.com/api-keys
   - Для: GPT-5, DALL-E 3, Sora 2.0

4. **Runway ML**
   - Получить: https://runwayml.com/
   - Для: Runway Gen-3 (fallback video)

5. **Luma Labs**
   - Получить: https://lumalabs.ai/
   - Для: Luma Dream Machine (fallback video)

6. **ElevenLabs**
   - Получить: https://elevenlabs.io/
   - Для: Text-to-Speech озвучка

7. **YouTube Data API**
   - Получить: https://console.cloud.google.com/
   - Включить YouTube Data API v3
   - Создать OAuth 2.0 credentials

8. **Instagram Graph API**
   - Получить: https://developers.facebook.com/
   - Настроить Instagram Business Account

9. **TikTok for Developers**
   - Получить: https://developers.tiktok.com/
   - Создать приложение

10. **Google Sheets API**
    - Получить: https://console.cloud.google.com/
    - Включить Google Sheets API
    - Service Account или OAuth 2.0

11. **Telegram Bot**
    - Получить: https://t.me/BotFather
    - Команда: `/newbot`

### Шаг 2: Настройка Credentials в N8N

1. Откройте N8N
2. Перейдите в **Settings** → **Credentials**
3. Создайте следующие credentials:

```
1. HTTP Header Auth (id: 1) - Gemini API Key
   Name: Gemini API Key
   Header: x-goog-api-key
   Value: YOUR_GEMINI_API_KEY

2. HTTP Header Auth (id: 2) - Groq API Key
   Name: Groq API Key
   Header: Authorization
   Value: Bearer YOUR_GROQ_API_KEY

3. HTTP Header Auth (id: 3) - OpenAI API Key
   Name: OpenAI API Key
   Header: Authorization
   Value: Bearer YOUR_OPENAI_API_KEY

4. HTTP Header Auth (id: 4) - Google AI API Key
   Name: Google AI API Key
   Header: x-goog-api-key
   Value: YOUR_GOOGLE_AI_KEY

5. HTTP Header Auth (id: 5) - Runway API Key
   Name: Runway API Key
   Header: Authorization
   Value: Bearer YOUR_RUNWAY_API_KEY

6. HTTP Header Auth (id: 6) - Luma API Key
   Name: Luma API Key
   Header: Authorization
   Value: Bearer YOUR_LUMA_API_KEY

7. HTTP Header Auth (id: 7) - ElevenLabs API Key
   Name: ElevenLabs API Key
   Header: xi-api-key
   Value: YOUR_ELEVENLABS_API_KEY

8. OAuth2 API (id: 8) - YouTube OAuth2
   Name: YouTube OAuth2
   (Настроить через Google Cloud Console)

9. HTTP Header Auth (id: 9) - Instagram API Token
   Name: Instagram API Token
   Header: Authorization
   Value: Bearer YOUR_INSTAGRAM_TOKEN

10. HTTP Header Auth (id: 10) - TikTok API Token
    Name: TikTok API Token
    Header: Authorization
    Value: Bearer YOUR_TIKTOK_TOKEN

11. Google Sheets OAuth2 (id: 11) - Google Sheets Account
    Name: Google Sheets Account
    (Настроить через Google Cloud Console)

12. Telegram API (id: 12) - Telegram Bot
    Name: Telegram Bot
    Token: YOUR_TELEGRAM_BOT_TOKEN
```

### Шаг 3: Настройка Google Sheets

1. Создайте новую Google таблицу
2. Скопируйте ID таблицы из URL
3. В workflow замените `YOUR_GOOGLE_SHEET_ID` на ваш ID
4. Создайте лист с названием "Sheet1" или измените название в workflow

### Шаг 4: Настройка Telegram

1. Создайте бота через @BotFather
2. Получите токен бота
3. Узнайте свой Chat ID (можно через @userinfobot)
4. В workflow замените `YOUR_TELEGRAM_CHAT_ID` на ваш ID

### Шаг 5: Импорт Workflow

1. Скопируйте содержимое файла `auto-buzz-factory-ultimate-2025.json`
2. В N8N: **Workflows** → **Import from URL** → вставьте JSON
3. Или: **Workflows** → **Add workflow** → кнопка меню → **Import from File**

## 🚀 Запуск

### Ручной запуск
1. Откройте workflow
2. Нажмите кнопку **Execute Workflow**

### Автоматический запуск
Workflow настроен на автоматический запуск каждые 6 часов через Schedule Trigger.

## 📊 Процесс работы

```
1. Сбор трендов (7 RSS источников)
   ↓
2. Scoring и фильтрация (Top 10 по viral score)
   ↓
3. AI-анализ и генерация сценария (Gemini/Groq)
   ↓
4. Расширение промпта для видео (GPT-5)
   ↓
5. Параллельная генерация:
   - Thumbnail (DALL-E 3)
   - Video (Sora → Veo → Runway → Luma fallback)
   - Voiceover (ElevenLabs)
   ↓
6. Упаковка финальных ассетов
   ↓
7. Автопубликация:
   - YouTube Shorts
   - Instagram Reels
   - TikTok
   ↓
8. Логирование и уведомления:
   - Google Sheets
   - Telegram
```

## ⚙️ Viral Score

Алгоритм scoring учитывает:
- **AI Keywords** (15 баллов за каждое): sora, veo, runway, gpt, claude, gemini, midjourney и др.
- **Video Keywords** (10 баллов): video, shorts, tiktok, reels, viral
- **Trend Keywords** (5 баллов): новый, тренд, breaking, latest, обзор

**Максимальный score**: 100

## 🎨 Генерируемый контент

Для каждого тренда создается:
- 3 варианта заголовка
- Hook (зацепка на 3 сек)
- Основной контент (30-50 сек)
- Call-to-action
- 15 хештегов
- SEO-описание
- Детальный видео-промпт
- Промпт для обложки
- Скрипт озвучки
- Рекомендации по музыке

## 🔄 Fallback система

### LLM (генерация сценариев)
1. Gemini 2.0 Flash (primary)
2. Groq Llama 3.3 70B (fallback)

### Video Generation
1. Sora 2.0 (primary)
2. Google Veo 3 (fallback #1)
3. Runway Gen-3 (fallback #2)
4. Luma Dream Machine (fallback #3)

## 📈 Мониторинг

### Google Sheets
Все публикации логируются с полями:
- Timestamp
- Title
- Viral Score
- Video URL
- YouTube/Instagram/TikTok IDs
- Source
- Keywords
- Status

### Telegram
Мгновенные уведомления о каждой публикации с:
- Заголовком
- Viral Score
- Ссылками на все платформы
- Временем публикации

## 💡 Советы

1. **Начните с тестового режима**: Закомментируйте узлы публикации, пока не убедитесь, что контент генерируется корректно
2. **Проверьте API limits**: У некоторых сервисов есть лимиты на количество запросов
3. **Мониторьте costs**: Генерация видео через AI может быть дорогой
4. **Настройте промпты**: Адаптируйте промпты под вашу тематику и аудиторию
5. **Тестируйте fallback**: Убедитесь, что fallback-цепочки работают корректно

## 🐛 Troubleshooting

### Ошибка "API Key invalid"
- Проверьте правильность API ключей в Credentials
- Убедитесь, что не истек срок действия

### Ошибка "Rate limit exceeded"
- Увеличьте задержки между запросами
- Используйте меньше источников RSS

### Видео не генерируется
- Проверьте fallback-цепочку
- Убедитесь, что у вас достаточно кредитов на API

### Публикация не работает
- Проверьте OAuth токены
- Убедитесь, что у приложения есть необходимые permissions

## 📝 Лицензия

Этот workflow создан для образовательных целей. Убедитесь, что вы соблюдаете Terms of Service всех используемых API и платформ.

## 🤝 Поддержка

Для вопросов и багрепортов создайте Issue в репозитории или свяжитесь через Telegram.

---

**Версия**: 2025.1.0  
**Последнее обновление**: Январь 2025  
**Совместимость**: N8N v1.0+
