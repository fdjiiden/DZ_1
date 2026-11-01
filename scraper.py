import requests
import json

API_URL = "https://tulsu.ru/schedule/queries/GetSchedule.php?search_field=GROUP_P&search_value=220252"
FILE_NAME = "tulsu_schedule.json"

def fetch_schedule():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": "https://tulsu.ru/schedule/?search=220252"
    }
    try:
        response = requests.get(API_URL, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        with open(FILE_NAME, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print("Расписание ТулГУ успешно скачано и сохранено!")
    except Exception as e:
        print(f"Ошибка: {e}")

if __name__ == "__main__":
    print("Скрипт запущен!")
    fetch_schedule()