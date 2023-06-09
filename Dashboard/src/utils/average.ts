const average = (array: number[]): number => {
  if (array.length > 0) {
    const sum = array.reduce((a, b) => a + b, 0);
    const averageValue = sum / array.length;
    return Number(averageValue.toFixed(1));
  } else {
    return 0;
  }
};

export default average;
