/** Create a class that inherits properties from a type. */
export default function createClassFromType<
  T,
  B extends boolean = true
>(args?: { generic?: B }) {
  type TG = B extends true ? Generic<T> : T;

  return class {
    constructor(args: TG) {
      Object.assign(this, args);
    }
  } as {
    new (args: TG): TG;
  };
}
