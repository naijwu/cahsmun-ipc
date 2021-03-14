
const prettySwitchboard = {
    'aljazeera': 'Al Jazeera',
    'bbc': 'BBC',
    'cnn': 'CNN',
    'euronews':'Euronews',
    'foxnews':'Fox News',
    'nyt': 'New York Times',
    'russiatoday': 'Russia Today',
    'globeandmail': 'The Globe and Mail',
    'theonion': 'The Onion',
    'xinhua': 'Xinhua News Agency'
}

const validAgencies = ['aljazeera', 'bbc', 'cnn', 'euronews', 'foxnews', 'nyt', 'russiatoday', 'globeandmail', 'theonion', 'xinhua'];

const DAYS = [
    "Sunday",
    "Monday", 
    "Tuesday", 
    "Wednseday",
    "Thursday", 
    "Friday", 
    "Saturday",
]

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const API_URL = false ? 'http://localhost:8080/ipc' : 'https://api.opengavel.app/ipc';

export { API_URL, MONTHS, DAYS, prettySwitchboard, validAgencies };