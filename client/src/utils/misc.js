// https://stackoverflow.com/questions/1484506/random-color-generator
const getRandomColor = () => `#${Math.floor(Math.random() * 16777216).toString(16)}`;

export { getRandomColor };
