const getDayName=(dateStr, locale="en-EN")=>
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

export {getDayName};