// // console.log("=== Using var ===");

// // for (var i = 0; i < 3; i++) {
// //   setTimeout(() => {
// //     console.log("var:", i);
// //   }, 1000);
// // }

// // setTimeout(() => {
// //   console.log("\n=== Using let ===");

// //   for (let i = 0; i < 3; i++) {
// //     setTimeout(() => {
// //       console.log("let:", i);
// //     }, 1000);
// //   }
// // }, 2000);

// // Opt1:
// const user = {
//   name: "John",
//   greet() {
//     console.log(this.name);
//   }
// };
// setTimeout(user.greet, 1000);

// // Opt2 
// setTimeout(() => user.greet(), 1000);

// let count = 0;

// while (count < 5) {
//   console.log(count);
// }
// // =>Fix 
// let count = 0;

// while (count < 5) {
//   console.log(count);
//   count++;
// }


// fetchData("Old Request", 3000);
// fetchData("New Request", 1000);

// // Memory leak demo
// const interval = setInterval(() => {
//   console.log("Running...");
// }, 1000);
// // Fix
// const interval = setInterval(() => {
//   console.log("Running...");
// }, 1000);

// setTimeout(() => {
//   clearInterval(interval);
//   console.log("Interval cleared");
// }, 5000);



const response = {
  data: {
    user: {
      name: "John"
    }
  }
};
// Broken response handling
console.log(response.user.name); 
// => TypeError: Cannot read properties of undefined (reading 'name')
// Fixed response handling
console.log(response.data.user.name);