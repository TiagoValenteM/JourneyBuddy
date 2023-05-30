const average = (array: number[]) =>
  array.length > 0 ? array.reduce((a, b) => a + b) / array.length : 0;

export default average;
