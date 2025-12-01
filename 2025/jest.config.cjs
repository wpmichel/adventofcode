/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.jest.json",
            },
        ],
    },
};

module.exports = config;
