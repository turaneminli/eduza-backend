// swagger config

const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/auth.js", "./routes/course.js"];
swaggerAutogen(outputFile, endpointsFiles);
