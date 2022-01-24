class Vehicle {
  constructor(make, model, wheels) {
    this.make = make;
    this.model = model;
    this.wheels = wheels;
  }

  getWheels() {
    return this.wheels;
  }

  info() {
    return `${this.make} ${this.model}`;
  }
}

class Car extends Vehicle {
  static WHEELS = 4;

  constructor(make, model) {
    super(make, model, Car.WHEELS);
  }
}

class Motorcycle extends Vehicle {
  static WHEELS = 2;

  constructor(make, model) {
    super(make, model, Car.WHEELS);
  }
}

class Truck extends Vehicle {
  static WHEELS = 6;

  constructor(make, model, payload) {
    super(make, model, Car.WHEELS);
    this.payload = payload;
  }
}