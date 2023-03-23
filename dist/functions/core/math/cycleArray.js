/** Cycle through an array. */
export default function cycleArray(current, array) {
    let index = array.findIndex((x) => x == current);
    if (index == array.length - 1) {
        index = 0;
    }
    else {
        index += 1;
    }
    return array[index];
}
