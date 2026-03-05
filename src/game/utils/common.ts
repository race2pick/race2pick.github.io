export function randomMinMax(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function createRandomCycle<T>(items: T[]) {
  let pool: T[] = [];

  function shuffle(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return function getNext() {
    if (pool.length === 0) {
      pool = shuffle([...items]);
    }

    return pool.pop();
  };
}