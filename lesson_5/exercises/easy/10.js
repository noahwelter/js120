class Pet {
  constructor(species, name) {
    this.species = species;
    this.name = name;
  }

  getSpecies() {
    return this.species;
  }

  toString() {
    return this.name;
  }

  getInfo() {
    return `a ${this.getSpecies()} named ${this}`;
  }
}

class Owner {
  constructor(name) {
    this.name = name;
    this.pets = [];
  }

  addPet(pet) {
    this.pets.push(pet);
  }

  numberOfPets() {
    return this.pets.length;
  }

  toString() {
    return this.name;
  }
}

class Shelter extends Owner {
  constructor() {
    super('The Animal Shelter');
    this.adoptedList = {};
  }

  adopt(owner, pet) {
    if (this.isNewAdopter(owner)) this.addAdopter(owner);

    owner.addPet(pet);
    this.adoptedList[owner].push(pet);

    this.pets = this.pets.filter(availablePet => availablePet !== pet);
  }

  printAdoptions() {
    for (let owner in this.adoptedList) {
      console.log(`${owner} has adopted the following pets:`);

      for (let pet of this.adoptedList[owner]) {
        console.log(pet.getInfo());
      }

      console.log();
    }
  }

  printAvailablePets() {
    console.log(`${this} has the following unadopted pets`);

    for (let pet of this.pets) {
      console.log(pet.getInfo());
    }

    console.log();
  }

  addAdopter(owner) {
    this.adoptedList[owner] = [];
  }

  addPetToAdoptedList(owner, pet) {
    this.adoptedList[owner].push(pet);
  }

  isNewAdopter(owner) {
    return !this.adoptedList[owner];
  }
}

let butterscotch = new Pet('cat', 'Butterscotch');
let pudding      = new Pet('cat', 'Pudding');
let darwin       = new Pet('bearded dragon', 'Darwin');
let kennedy      = new Pet('dog', 'Kennedy');
let sweetie      = new Pet('parakeet', 'Sweetie Pie');
let molly        = new Pet('dog', 'Molly');
let chester      = new Pet('fish', 'Chester');
let asta = new Pet('dog', 'Asta');
let laddie = new Pet('dog', 'Laddie');
let fluffy = new Pet('cat', 'Fluffy');
let kat = new Pet('cat', 'Kat');
let ben = new Pet('cat', 'Ben');
let chatterbox = new Pet('parakeet', 'Chatterbox');
let bluebell = new Pet('parakeet', 'Bluebell');

let phanson = new Owner('P Hanson');
let bholmes = new Owner('B Holmes');

let shelter = new Shelter();
shelter.adopt(phanson, butterscotch);
shelter.adopt(phanson, pudding);
shelter.adopt(phanson, darwin);
shelter.adopt(bholmes, kennedy);
shelter.adopt(bholmes, sweetie);
shelter.adopt(bholmes, molly);
shelter.adopt(bholmes, chester);

shelter.addPet(asta);
shelter.addPet(laddie);
shelter.addPet(fluffy);
shelter.addPet(kat);
shelter.addPet(ben);
shelter.addPet(chatterbox);
shelter.addPet(bluebell);

shelter.printAdoptions();
shelter.printAvailablePets();
console.log(`${phanson.name} has ${phanson.numberOfPets()} adopted pets.`);
console.log(`${bholmes.name} has ${bholmes.numberOfPets()} adopted pets.`);

shelter.adopt(bholmes, fluffy);
shelter.printAdoptions();
shelter.printAvailablePets();
console.log(`${bholmes.name} has ${bholmes.numberOfPets()} adopted pets.`);
