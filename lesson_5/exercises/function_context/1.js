let person = {
  firstName: 'Rick ',
  lastName: 'Sanchez',
  fullName: this.firstName + this.lastName,
};

console.log(person.fullName);

/*
  The `this` keyword in the `person` object refers to the `global` object.
  Because of this, both `this.firstName` and `this.lastName` return `undefined`.
  `undefined` + `undefined` evaluates to `NaN`, so `NaN` will be logged.
*/