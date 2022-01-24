class Animal {
  constructor(name, age, legs, species, status) {
    this.name = name;
    this.age = age;
    this.legs = legs;
    this.species = species;
    this.status = status;
  }
  introduce() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old and ${this.status}.`;
  }
}

class Cat extends Animal {
  static LEG_COUNT = 4;
  static SPECIES = 'cat';

  constructor(name, age, status) {
    super(name, age, Cat.LEG_COUNT, Cat.SPECIES, status);
  }

  introduce() {
    return super.introduce() + ' Meow meow!';
  }
}

class Dog extends Animal {
  static LEG_COUNT = 4;
  static SPECIES = 'dog';

  constructor(name, age, status, master) {
    super(name, age, Dog.LEG_COUNT, Dog.SPECIES, status);
    this.master = master;
  }

  greetMaster() {
    return `Hello ${this.master}! Woof, woof!`;
  }
}