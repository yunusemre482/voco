function calculateDistance(coord1, coord2) {
    return Math.sqrt(
        Math.pow(coord1.latitude - coord2.latitude, 2) +
        Math.pow(coord1.longitude - coord2.longitude, 2)
    );
}


module.exports = {
    calculateDistance
}