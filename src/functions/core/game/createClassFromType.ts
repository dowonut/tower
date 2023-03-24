/** Create a class that inherits properties from a type. */
export default function createClassFromType<T>() {
  type TG = Generic<T>;

  return class {
    constructor(args: TG) {
      Object.assign(this, args);
    }
  } as {
    new (args: TG): TG;
  };
}
