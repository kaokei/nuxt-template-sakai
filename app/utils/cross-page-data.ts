let JSON_INPUT = '';

export function crossPageSetJsonInput(input: string) {
  JSON_INPUT = input || '';
}

export function crossPageGetJsonInput() {
  const res = JSON_INPUT || '';
  JSON_INPUT = '';
  return res;
}
