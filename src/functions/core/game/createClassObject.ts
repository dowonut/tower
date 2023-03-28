/**
 * Combine a class instance with object properties.
 */
export default function createClassObject<T>(baseClass: any, baseInfo: any) {
  return Object.assign(baseClass, baseInfo) satisfies T as T;
}
