import _ from "lodash";

/**
 * Combine a class instance with object properties.
 */
export default function createClassObject<T>(baseClass: any, baseInfo: any): T {
  if (!baseClass) return;
  const source = Object.assign(_.cloneDeep(baseClass), baseInfo);
  return source;
}
