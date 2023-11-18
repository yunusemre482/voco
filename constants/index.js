const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
};

const TOKEN_TYPES = {
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
    PASSWORD_RESET: 'PASSWORD_RESET',
};

const RESTAURANT_TYPES = {
    FAST_FOOD: 'fast food',
    CAFE: 'cafe',
    RESTAURANT: 'restaurant',
    BAR: 'bar',
    PUB: 'pub',
    CLUB: 'club',
    BAKERY: 'bakery',
    FOOD_TRUCK: 'food truck',
    HOMEMADE: 'homemade',
    OTHER: 'other',
};


const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    DELIVERED: 'delivered',
};

module.exports = {
    GENDER,
    TOKEN_TYPES,
    RESTAURANT_TYPES,
    ORDER_STATUS,
}