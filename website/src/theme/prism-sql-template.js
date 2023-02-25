Prism.languages.sql_template = {
    comment: /--.*/,
    variable: [
        /<[^>\s]+>/,
        { pattern: /(\w|\[)\.\.\.(?=\])/, lookbehind: true },
        { pattern: /(\w|\[, )\.\.\.(?=\])/, lookbehind: true },
    ],
    keyword: /\b[A-Z]+\b/,
    punctuation: /[;[\]{}]/,
};
