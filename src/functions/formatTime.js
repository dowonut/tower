export default {
  formatTime: (seconds) => {
    let text = ``;

    function round(input) {
      return Math.round(input * 10) / 10;
    }

    if (seconds < 60) {
      text = `${seconds} seconds`;
    } else if (seconds < 3600) {
      text = `${round(seconds / 60)} minutes`;
    } else if (seconds < 86400) {
      text = `${round(seconds / 60 / 60)} hours`;
    } else {
      text = `${round(seconds / 60 / 60 / 24)} days`;
    }

    return text;
  },
};
