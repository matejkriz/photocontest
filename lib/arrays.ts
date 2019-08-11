/**
 * Group array of objects by value of defined key.
 */
export const groupBy = <O>(key: string & keyof O) => (array: Array<O>) =>
  array.reduce((objectsByKeyValue: { [key: string]: Array<O> }, obj: O) => {
    const value = `${obj[key]}`;
    return {
      ...objectsByKeyValue,
      [value]: [...(objectsByKeyValue[value] || []), obj],
    };
  }, {});
