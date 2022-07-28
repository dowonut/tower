export default {
  progressBar: (min, max) => {
    const boxes = 10;
    let fill = Math.floor((min / max) * boxes);
    let text = ``;
    for (let i = 0; i < boxes; i++) {
      if (i < fill) {
        text += `■`;
      } else {
        text += `□`;
      }
    }
    return text;
  },
};
