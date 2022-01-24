let franchise = {
  name: 'How to Train Your Dragon',
  allMovies() {
    let self = this;
    return [1, 2, 3].map(function(number) {
      return self.name + ' ' + number;
    });
  },

  // Using an arrow function
  // allMovies() {
  //   return [1, 2, 3].map(number => {
  //     return this.name + ' ' + number;
  //   });
  // },
};

console.log(franchise.allMovies());