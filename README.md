# FINKI Timetables Scraper
Script for scraping and organizing lecture timetables

Requirements:
node-fetch

Example data
```json
{
  "*207": {
    "subject": "Основи на веб дизајн",
    "teachers": ["TEACHER_NAME"],
    "classes": ["1г. КИ", "1y. SEIS/KNIA", "1г. ПИТ-4", "1г. КЕ"],
    "classroom": {
      "short": "223",
      "name": "223 ФЕИТ"
    },
    "day": "Четврток",
    "time": {
      "start": {
        "name": "16:00 - 16:45",
        "startTime": "16:00",
        "endTime": "16:45"
      },
      "end": {
        "name": "16:00 - 16:45",
        "startTime": "16:00",
        "endTime": "16:45"
      }
    }
  }
}
```
