interface Constraints {
    required?: boolean;
    email?: boolean;
    min_length?: number;
    max_length?: number;
    has_special_character?: boolean;
    must_have_number?: boolean;
    match?: string;
    no_whitespace?: boolean;
    is_number?: boolean;
    is_alphanumeric?: boolean;
    custom?: (value: string) => boolean;
}

interface ValidationRules {
    [key: string]: boolean;
}

interface ErrorMessages {
    [key: string]: string;
}

interface ErrorsType {
    [key: string]: string;  // Array of error messages
}

const shorthandMap: { 
    [key: string]: ((param: string) => Constraints) | Constraints 
} = {
    required: { required: true },
    email: { email: true },
    min: (length: string) => ({ min_length: parseInt(length, 10) || 0 }),
    max: (length: string) => ({ max_length: parseInt(length, 10) || 0 }),
    special: { has_special_character: true },
    number: { must_have_number: true },
    no_whitespace: { no_whitespace: true },
    alphanumeric: { is_alphanumeric: true },
    custom: (param: string) => ({ custom: eval(param) as (value: string) => boolean }),
    //custom: (func: (value: string) => boolean) => ({ custom: func }),
};

const parseConstraints = (shorthands: string): Constraints => {
    return shorthands.split('|').reduce((constraints: Constraints, shorthand: string) => {
        const [key, param] = shorthand.split(':');
        const rule = shorthandMap[key as keyof typeof shorthandMap];  // Ensure key is one of shorthandMap keys
        if (!rule) {
            console.warn(`Unknown shorthand key: ${key}`);
            return constraints;
        }

        if (typeof rule === 'function') {
            return { ...constraints, ...(rule(param)) };
        } else {
            return { ...constraints, ...rule };
        }
    }, {});
};

export const validate = (inputs: { [key: string]: string }, rules: { [key: string]: string }): ErrorsType => {
    const validationResults: ErrorsType = {};

    Object.entries(rules).forEach(([inputName, shorthand]) => {
        const constraints = parseConstraints(shorthand);
        const inputValue = inputs[inputName] || '';

        const {
            required,
            min_length,
            max_length,
            email,
            has_special_character,
            must_have_number,
            match,
            no_whitespace,
            is_number,
            is_alphanumeric,
            custom,
        } = constraints;

        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const numberRegex = /\d/;
        const whitespaceRegex = /\s/;
        const alphanumericRegex = /^[a-z0-9]+$/i;

        const validationRules: ValidationRules = {
            required: required ? !!inputValue : true,
            min_length: min_length ? (!!inputValue && inputValue.length >= min_length) : true,
            max_length: max_length ? (!!inputValue && inputValue.length <= max_length) : true,
            //min_length: min_length ? inputValue.length >= min_length : true,
            //max_length: max_length ? inputValue.length <= max_length : true,
            email: email ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputValue) || !inputValue : true,
            has_special_character: has_special_character ? specialCharsRegex.test(inputValue) || !inputValue : true,
            must_have_number: must_have_number ? numberRegex.test(inputValue) || !inputValue : true,
            match: match ? (inputValue === match) || !inputValue : true,
            no_whitespace: no_whitespace ? !whitespaceRegex.test(inputValue) : true,
            is_number: is_number ? !isNaN(Number(inputValue)) : true,
            is_alphanumeric: is_alphanumeric ? alphanumericRegex.test(inputValue) : true,
            //custom: custom ? custom(inputValue) : true,
            custom: custom ? (() => {
                try {
                    return custom(inputValue);
                } catch {
                    return false; // Mark custom validation as failed if an error occurs
                }
            })() : true,
        };

        const errorMessages: ErrorMessages = {
            required: `${inputName} field is required`,
            min_length: `${inputName} must have at least ${min_length} characters`,
            max_length: `${inputName} must not exceed ${max_length} characters`,
            email: `${inputName} must be a valid email`,
            has_special_character: `${inputName} must have special characters`,
            must_have_number: `${inputName} must have a number`,
            match: 'Does not match the specified field',
            no_whitespace: `${inputName} must not contain whitespace`,
            is_number: `${inputName} must be a number`,
            is_alphanumeric: `${inputName} must be alphanumeric`,
            custom: `${inputName} failed custom validation`,
        };

        const failedRules = Object.entries(validationRules)
            .filter(([rule, pass]) => !pass)
            .map(([rule]) => errorMessages[rule] || `${inputName} failed validation for rule: ${rule}`);

        if (failedRules.length > 0) {
            validationResults[inputName] = failedRules[0];
        }
    });

    return validationResults;
};