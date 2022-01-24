class Something {
  constructor() {
    this.data = "Hello";
  }

  dupData() {
    return this.data + this.data;
  }

  static dupData() {
    return "ByeBye";
  }
}

let thing = new Something();        // Creates a new instance of 'Something'
console.log(Something.dupData());   // Logs 'ByeBye' (static method)
console.log(thing.dupData());       // Logs 'HelloHello' (instance method)