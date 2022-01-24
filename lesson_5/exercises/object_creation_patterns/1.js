// name property added to make objects easier to identify
let foo = {
  name: 'foo',

  ancestors() {
    let proto = Object.getPrototypeOf(this);
    let list = [];

    while (proto) {
      list.push(proto.name || 'Object.prototype');
      proto = Object.getPrototypeOf(proto);
    }

    return list;
  }
};

let bar = Object.create(foo);
bar.name = 'bar';
let baz = Object.create(bar);
baz.name = 'baz';
let qux = Object.create(baz);
qux.name = 'qux';

console.log(qux.ancestors());  // returns ['baz', 'bar', 'foo', 'Object.prototype']
console.log(baz.ancestors());  // returns ['bar', 'foo', 'Object.prototype']
console.log(bar.ancestors());  // returns ['foo', 'Object.prototype']
console.log(foo.ancestors());  // returns ['Object.prototype']