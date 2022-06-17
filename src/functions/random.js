export default {
  random: (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  },
};
