// DOM elements
const usaDateTimeInput = document.getElementById('usaDateTime');
const usaTimezoneSelect = document.getElementById('usaTimezone');
const indiaDateTimeDisplay = document.getElementById('indiaDateTime');
const currentUSADisplay = document.getElementById('currentUSA');
const currentIndiaDisplay = document.getElementById('currentIndia');
const statesTimeList = document.getElementById('statesTimeList');
const usaCalendar = document.getElementById('usaCalendar');
const indiaCalendar = document.getElementById('indiaCalendar');
const usaHolidays = document.getElementById('usaHolidays');
const indiaHolidays = document.getElementById('indiaHolidays');
const currentMonth = document.getElementById('currentMonth');
const currentMonthIndia = document.getElementById('currentMonthIndia');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const prevMonthIndia = document.getElementById('prevMonthIndia');
const nextMonthIndia = document.getElementById('nextMonthIndia');

// New elements for bidirectional conversion
const toggleDirection = document.getElementById('toggleDirection');
const usaToIndia = document.getElementById('usaToIndia');
const indiaToUsa = document.getElementById('indiaToUsa');
const indiaDateTimeInput = document.getElementById('indiaDateTime2');
const targetUsaTimezoneSelect = document.getElementById('targetUsaTimezone');
const usaDateTimeDisplay = document.getElementById('usaDateTime2');

// Calendar state
let currentCalendarDate = new Date();
let currentIndiaCalendarDate = new Date();
let isIndiaToUsa = false;

// Get timezone offset hours from UTC
function getTimezoneOffsetHours(timezone) {
    const now = new Date();
    const jan = new Date(now.getFullYear(), 0, 1);
    const jul = new Date(now.getFullYear(), 6, 1);
    
    const janOffset = getOffsetForDate(jan, timezone);
    const julOffset = getOffsetForDate(jul, timezone);
    
    // Use current date to determine if DST is active
    return getOffsetForDate(now, timezone);
}

function getOffsetForDate(date, timezone) {
    const utc1 = date.getTime() + (date.getTimezoneOffset() * 60000);
    const utc2 = new Date(utc1 + (0 * 3600000)); // UTC time
    const targetTime = new Date(utc2.toLocaleString('en-US', {timeZone: timezone}));
    const localTime = new Date(utc2.toLocaleString());
    
    return (targetTime.getTime() - localTime.getTime()) / (1000 * 60 * 60);
}

// Convert USA time to India time (PROPERLY FIXED)
function convertToIndiaTime() {
    const usaDateTime = usaDateTimeInput.value;
    const usaTimezone = usaTimezoneSelect.value;
    
    if (!usaDateTime) {
        indiaDateTimeDisplay.textContent = 'Select USA time above';
        return;
    }
    
    // Parse the input datetime
    const inputDate = new Date(usaDateTime);
    
    // Get timezone offsets
    const timezoneOffsets = {
        'America/New_York': -5,    // EST (UTC-5, UTC-4 in DST)
        'America/Chicago': -6,     // CST (UTC-6, UTC-5 in DST)
        'America/Denver': -7,      // MST (UTC-7, UTC-6 in DST)
        'America/Los_Angeles': -8  // PST (UTC-8, UTC-7 in DST)
    };
    
    // Check if DST is active (March to November roughly)
    const month = inputDate.getMonth();
    const isDST = month >= 2 && month <= 10;
    const usaOffset = timezoneOffsets[usaTimezone] + (isDST ? 1 : 0);
    const indiaOffset = 5.5; // IST is UTC+5:30
    
    // Calculate time difference
    const hoursDiff = indiaOffset - usaOffset;
    
    // Convert to India time
    const indiaTime = new Date(inputDate.getTime() + (hoursDiff * 60 * 60 * 1000));
    
    // Format the display
    const formattedTime = indiaTime.toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const [datePart, timePart] = formattedTime.split(', ');
    indiaDateTimeDisplay.innerHTML = `
        <div style="font-size: 1.2rem; color: #4ecdc4;">${datePart}</div>
        <div style="font-size: 1.4rem; color: #4ecdc4; margin-top: 5px;">${timePart}</div>
    `;
}

// Convert India time to USA time (PROPERLY FIXED)
function convertToUsaTime() {
    const indiaDateTime = indiaDateTimeInput.value;
    const targetTimezone = targetUsaTimezoneSelect.value;
    
    if (!indiaDateTime) {
        usaDateTimeDisplay.textContent = 'Select India time above';
        return;
    }
    
    // Parse the input datetime
    const inputDate = new Date(indiaDateTime);
    
    // Get timezone offsets
    const timezoneOffsets = {
        'America/New_York': -5,    // EST (UTC-5, UTC-4 in DST)
        'America/Chicago': -6,     // CST (UTC-6, UTC-5 in DST)
        'America/Denver': -7,      // MST (UTC-7, UTC-6 in DST)
        'America/Los_Angeles': -8  // PST (UTC-8, UTC-7 in DST)
    };
    
    // Check if DST is active
    const month = inputDate.getMonth();
    const isDST = month >= 2 && month <= 10;
    const usaOffset = timezoneOffsets[targetTimezone] + (isDST ? 1 : 0);
    const indiaOffset = 5.5; // IST is UTC+5:30
    
    // Calculate time difference (reverse of India to USA)
    const hoursDiff = usaOffset - indiaOffset;
    
    // Convert to USA time
    const usaTime = new Date(inputDate.getTime() + (hoursDiff * 60 * 60 * 1000));
    
    // Format the display
    const formattedTime = usaTime.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const [datePart, timePart] = formattedTime.split(', ');
    usaDateTimeDisplay.innerHTML = `
        <div style="font-size: 1.2rem; color: #4ecdc4;">${datePart}</div>
        <div style="font-size: 1.4rem; color: #4ecdc4; margin-top: 5px;">${timePart}</div>
    `;
}

// Toggle between conversion modes
function toggleConversionMode() {
    isIndiaToUsa = !isIndiaToUsa;
    
    if (isIndiaToUsa) {
        usaToIndia.style.display = 'none';
        indiaToUsa.style.display = 'block';
        toggleDirection.textContent = 'Switch to USA → India';
    } else {
        usaToIndia.style.display = 'block';
        indiaToUsa.style.display = 'none';
        toggleDirection.textContent = 'Switch to India → USA';
    }
}

// Update current time displays
function updateCurrentTimes() {
    const now = new Date();
    
    // USA Eastern Time
    const usaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(now);
    
    // India Time
    const indiaTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(now);
    
    currentUSADisplay.innerHTML = usaTime.replace(', ', '<br>');
    currentIndiaDisplay.innerHTML = indiaTime.replace(', ', '<br>');
}

// Event listeners
usaDateTimeInput.addEventListener('change', convertToIndiaTime);
usaTimezoneSelect.addEventListener('change', convertToIndiaTime);
indiaDateTimeInput.addEventListener('change', convertToUsaTime);
targetUsaTimezoneSelect.addEventListener('change', convertToUsaTime);
toggleDirection.addEventListener('click', toggleConversionMode);

// US States with their timezones
const usStates = {
    'Alabama': 'America/Chicago', 'Alaska': 'America/Anchorage', 'Arizona': 'America/Phoenix',
    'Arkansas': 'America/Chicago', 'California': 'America/Los_Angeles', 'Colorado': 'America/Denver',
    'Connecticut': 'America/New_York', 'Delaware': 'America/New_York', 'Florida': 'America/New_York',
    'Georgia': 'America/New_York', 'Hawaii': 'Pacific/Honolulu', 'Idaho': 'America/Denver',
    'Illinois': 'America/Chicago', 'Indiana': 'America/New_York', 'Iowa': 'America/Chicago',
    'Kansas': 'America/Chicago', 'Kentucky': 'America/New_York', 'Louisiana': 'America/Chicago',
    'Maine': 'America/New_York', 'Maryland': 'America/New_York', 'Massachusetts': 'America/New_York',
    'Michigan': 'America/New_York', 'Minnesota': 'America/Chicago', 'Mississippi': 'America/Chicago',
    'Missouri': 'America/Chicago', 'Montana': 'America/Denver', 'Nebraska': 'America/Chicago',
    'Nevada': 'America/Los_Angeles', 'New Hampshire': 'America/New_York', 'New Jersey': 'America/New_York',
    'New Mexico': 'America/Denver', 'New York': 'America/New_York', 'North Carolina': 'America/New_York',
    'North Dakota': 'America/Chicago', 'Ohio': 'America/New_York', 'Oklahoma': 'America/Chicago',
    'Oregon': 'America/Los_Angeles', 'Pennsylvania': 'America/New_York', 'Rhode Island': 'America/New_York',
    'South Carolina': 'America/New_York', 'South Dakota': 'America/Chicago', 'Tennessee': 'America/Chicago',
    'Texas': 'America/Chicago', 'Utah': 'America/Denver', 'Vermont': 'America/New_York',
    'Virginia': 'America/New_York', 'Washington': 'America/Los_Angeles', 'West Virginia': 'America/New_York',
    'Wisconsin': 'America/Chicago', 'Wyoming': 'America/Denver'
};

// Holidays data
const usaHolidays2025 = [
    {date: '2025-01-01', name: 'New Year\'s Day'},
    {date: '2025-01-20', name: 'Martin Luther King Jr. Day'},
    {date: '2025-02-17', name: 'Presidents\' Day'},
    {date: '2025-05-26', name: 'Memorial Day'},
    {date: '2025-07-04', name: 'Independence Day'},
    {date: '2025-09-01', name: 'Labor Day'},
    {date: '2025-10-13', name: 'Columbus Day'},
    {date: '2025-11-11', name: 'Veterans Day'},
    {date: '2025-11-27', name: 'Thanksgiving'},
    {date: '2025-12-25', name: 'Christmas Day'}
];

const indiaHolidays2025 = [
    {date: '2025-01-26', name: 'Republic Day'},
    {date: '2025-03-14', name: 'Holi'},
    {date: '2025-04-18', name: 'Good Friday'},
    {date: '2025-08-15', name: 'Independence Day'},
    {date: '2025-10-02', name: 'Gandhi Jayanti'},
    {date: '2025-10-20', name: 'Dussehra'},
    {date: '2025-11-09', name: 'Diwali'},
    {date: '2025-12-25', name: 'Christmas Day'}
];

// Update all US states times
function updateStatesTime() {
    const statesHtml = Object.entries(usStates).map(([state, timezone]) => {
        const time = new Date().toLocaleString('en-US', {
            timeZone: timezone,
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return `<div class="state-item"><span class="state-name">${state}</span><span class="state-time">${time}</span></div>`;
    }).join('');
    statesTimeList.innerHTML = statesHtml;
}

// Generate calendar
function generateCalendar(calendarElement, date, holidays) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = '';
    
    // Header days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        html += `<div class="calendar-day calendar-header-day">${day}</div>`;
    });
    
    // Empty cells for first week
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-day"></div>`;
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.getDay();
        
        let classes = 'calendar-day calendar-date';
        
        // Check if today
        if (currentDate.toDateString() === today.toDateString()) {
            classes += ' today';
        }
        
        // Check if weekend
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            classes += ' weekend';
        }
        
        // Check if holiday
        if (holidays.some(h => h.date === dateStr)) {
            classes += ' holiday';
        }
        
        html += `<div class="${classes}">${day}</div>`;
    }
    
    calendarElement.innerHTML = html;
}

// Update calendar displays
function updateCalendars() {
    currentMonth.textContent = currentCalendarDate.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
    currentMonthIndia.textContent = currentIndiaCalendarDate.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
    
    generateCalendar(usaCalendar, currentCalendarDate, usaHolidays2025);
    generateCalendar(indiaCalendar, currentIndiaCalendarDate, indiaHolidays2025);
}

// Display holidays
function displayHolidays() {
    const usaHtml = usaHolidays2025.map(holiday => 
        `<div class="holiday-item"><span class="holiday-date">${new Date(holiday.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span><span class="holiday-name">${holiday.name}</span></div>`
    ).join('');
    
    const indiaHtml = indiaHolidays2025.map(holiday => 
        `<div class="holiday-item"><span class="holiday-date">${new Date(holiday.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span><span class="holiday-name">${holiday.name}</span></div>`
    ).join('');
    
    usaHolidays.innerHTML = usaHtml;
    indiaHolidays.innerHTML = indiaHtml;
}

// Calendar navigation
prevMonth.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    updateCalendars();
});

nextMonth.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    updateCalendars();
});

prevMonthIndia.addEventListener('click', () => {
    currentIndiaCalendarDate.setMonth(currentIndiaCalendarDate.getMonth() - 1);
    updateCalendars();
});

nextMonthIndia.addEventListener('click', () => {
    currentIndiaCalendarDate.setMonth(currentIndiaCalendarDate.getMonth() + 1);
    updateCalendars();
});

// Initialize everything
updateCurrentTimes();
updateStatesTime();
updateCalendars();
displayHolidays();

setInterval(() => {
    updateCurrentTimes();
    updateStatesTime();
}, 1000);

// Set current times as default
const now = new Date();
const localISOTime = now.toISOString().slice(0, 16);
usaDateTimeInput.value = localISOTime;
indiaDateTimeInput.value = localISOTime;
convertToIndiaTime();
convertToUsaTime();