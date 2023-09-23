import on_work_creation from "./functions/on_work_creation";
import on_command from "./functions/on_command";

export const functionFactory = {
    // Add your functions here
    on_work_creation, on_command,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
