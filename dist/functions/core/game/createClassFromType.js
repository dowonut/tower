/** Create a class that inherits properties from a type. */
export default function createClassFromType() {
    return class {
        constructor(args) {
            Object.assign(this, args);
        }
    };
}
