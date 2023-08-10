/**
 * Combine a class instance with object properties.
 */
export default function createClassObject<T>(baseClass: any, baseInfo: any) {
  const source = Object.assign(Object.create(Object.getPrototypeOf(baseClass)), baseClass, baseInfo) satisfies T as T;
  return source;
}
