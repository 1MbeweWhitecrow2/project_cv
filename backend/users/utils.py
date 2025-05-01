import requests
from django.conf import settings

def verify_recaptcha(recaptcha_token):
    url = "https://www.google.com/recaptcha/api/siteverify"
    data = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': recaptcha_token
    }
    response = requests.post(url, data=data)
    result = response.json()
    return result.get("success", False)
