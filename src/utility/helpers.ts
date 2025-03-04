const bcrypt = require('bcrypt');

export async function passwordHasher(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return {
        salt,
        hashedPassword
    };
}

export async function passwordCompare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}
