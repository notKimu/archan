import chalk from "chalk";

export function logSuccex(message: any): void {
    console.log(chalk.bgGreenBright("[SUCCEX]") + chalk.greenBright(` >>> ${message}`));
};

export function logError(message: any): void {
    console.error(chalk.bgRedBright("[ERROR]") + chalk.redBright(` >>> ${message}`));
};

export function logInfo(message: any): void {
    console.log(chalk.bgMagentaBright("[INFO]") + chalk.magentaBright(` >>> ${message}`));
};

export function logWarning(message: any): void {
    console.log(chalk.bgYellowBright("[WARNING]") + chalk.yellowBright(` >>> ${message}`));
};

export function debug(message: any): void {
    console.log(">>> DEBUGGER ----------------");
    console.log(message);
    console.log(">>> -------------------------");

};