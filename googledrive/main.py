import os
import gspread
import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

load_dotenv()

scope = ['https://www.googleapis.com/auth/spreadsheets',
         'https://www.googleapis.com/auth/drive']

credentials = Credentials.from_service_account_file(
    "googledrive/boreal-dock-391407-b0d4cbb25808.json", scopes=scope)

gc = gspread.authorize(credentials)

SPREADSHEET_KEY = os.getenv("SS_ID")
ss = gc.open_by_key(SPREADSHEET_KEY)
sheet = ss.sheet1

now = datetime.datetime.now()
sheet.append_row(values=[now.strftime('%Y/%m/%d %H:%M:%S')])
