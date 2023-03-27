/**
 * Return random element from an array.
 */
export default function getRandom(array: any[]) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}
