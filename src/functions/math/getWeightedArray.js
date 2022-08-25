export default {
  getWeightedArray: (array) => {
    // Create options and weights
    let options = [];
    let weights = [];

    for (const item of array) {
      options.push(item);
      weights.push(item.weight);
    }

    // Get random output from weights
    let { item } = game.weightedRandom(options, weights);

    return item;
  },
};
