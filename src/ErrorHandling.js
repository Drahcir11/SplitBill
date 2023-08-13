export const noWhiteSpace = (input) => {
    return Boolean(input.trim());
};

export const isValidInput = (name => {
    // Restricts User name input to 50 characters
    const regex = /^[a-zA-Z0-9 ):<~-]{0,50}$/;
    return regex.test(name);
})