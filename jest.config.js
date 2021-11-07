module.exports = {
    testRegex: "((\\.|/*.)(test))\\.js?$",
    moduleFileExtensions: ["js"],
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    moduleNameMapper: {
      "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$" : "jest-transform-stub",
      '^/(.*)$': 'src/$1'
    },
    moduleDirectories: ["<rootDir>", "./src", "node_modules"]
};