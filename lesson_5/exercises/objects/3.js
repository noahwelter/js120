function objectsEqual(objA, objB) {
  for (let key in objA) {
    if (!objB.hasOwnProperty(key)) return false;
    if (objA[key] !== objB[key]) return false;
  }

  for (let key in objB) {
    if (!objB.hasOwnProperty(key)) return false;
    if (objA[key] !== objB[key]) return false;
  }

  return true;
}

console.log(objectsEqual({a: 'foo'}, {a: 'foo'}));                      // true
console.log(objectsEqual({a: 'foo', b: 'bar'}, {a: 'foo'}));            // false
console.log(objectsEqual({}, {}));                                      // true
console.log(objectsEqual({a: 'foo', b: undefined}, {a: 'foo', c: 1}));  // false