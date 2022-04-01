
const prettySwitchboard = {
    'cnn': 'CNN',
    'foxnews':'Fox News',
    'newyorktimes': 'The New York Times',
    'globeandmail': 'The Globe and Mail',
    'theonion': 'The Onion',
}

const validAgencies = ['cnn', 'foxnews', 'newyorktimes', 'globeandmail', 'theonion',];

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