/** Create a class that inherits properties from a type. */
export default function createClassFromType<T>() {
  return class {
    constructor(args: T) {
      Object.assign(this, args);
    }
  } as {
    new (args: T): T;
  };
}
