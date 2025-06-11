const convertToMilliseconds = (timeString) => {
    if (!timeString) return 24 * 60 * 60 * 1000; // Default to 24 hours

    const timeValue = parseInt(timeString);
    const timeUnit = timeString.slice(-1).toLowerCase();

    switch (timeUnit) {
        case 's': // seconds
            return timeValue * 1000;
        case 'm': // minutes
            return timeValue * 60 * 1000;
        case 'h': // hours
            return timeValue * 60 * 60 * 1000;
        case 'd': // days
            return timeValue * 24 * 60 * 60 * 1000;
        default:
            // If no unit specified, assume seconds
            return timeValue * 1000;
    }
};

module.exports = {
    convertToMilliseconds
};