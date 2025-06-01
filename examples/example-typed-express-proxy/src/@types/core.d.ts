type InterfaceToType<T extends object> = {
    [P in keyof T]: T[P];
};