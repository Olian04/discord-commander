
// name = 'Foo', { bar: 1, biz: 'lel' } => 'Foo(bar=1, biz=lel)'
export const debugPrintObject = (name: string, object: object) =>
  `${name}(${Object.keys(object).map((k) => `${k}=${object[k]}`).join(', ')})`;
