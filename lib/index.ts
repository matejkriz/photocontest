/* Use this function to prevent "Cannot read property 'name' of undefined" error.
 * Instead of foo && foo.bar && foo.bar[baz] && foo.bar[baz].hurrah you could write:
 * getSafe(() => foo.bar[baz].hurrah, 'Hurray!')
 */
export const getSafe = <T>(
  fn: () => T,
  defaultValue: T,
  reportError: boolean = true,
): T => {
  try {
    const value = fn();
    return value === undefined ? defaultValue : value;
  } catch (error) {
    if (reportError) {
      console.log(error);
    }
    return defaultValue;
  }
};
