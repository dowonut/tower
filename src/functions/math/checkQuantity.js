export default {
  checkQuantity: (quantity, message) => {
    if (quantity) {
      if (quantity.trim() == "a" || quantity.trim() == "all") {
        return "all";
      } else if (isNaN(quantity)) {
        game.error(message, "quantity must be a number.");
        return undefined;
      } else if (quantity < 1) {
        game.error(message, "quantity must be a number above 0.");
        return undefined;
      } else if (quantity > 10000000) {
        game.error(message, "quantity too high.");
        return undefined;
      } else return parseInt(quantity);
    } else return 1;
  },
};
