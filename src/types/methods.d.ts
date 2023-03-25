declare global {
  /**
   * Modify an existing type by overriding.
   */
  export type Modify<T, R> = Omit<T, keyof R> & R;
}

export {};
