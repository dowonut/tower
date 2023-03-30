/**
 * Return random element from an array.
 */
export default function getRandom<T extends any[]>(array: T) {
  const random = Math.floor(Math.random() * array.length);
  return array[random] as T[number];
}
