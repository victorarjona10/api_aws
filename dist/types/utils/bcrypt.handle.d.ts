declare const encrypt: (pass: string) => Promise<string>;
declare const verified: (pass: string, passHash: string) => Promise<boolean>;
export { encrypt, verified };
