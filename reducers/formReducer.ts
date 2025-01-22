import { validate } from '@/util/validator';

export interface InputsType {
    [key: string]: string;
}
export interface ErrorsType {
    [key: string]: string;
}
export type FormAction =
  | { type: 'SET_INPUT'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_PHONE' }
  | { type: 'SET_API_ERRORS'; errors: ErrorsType };

export interface FormState {
    inputs: InputsType;
    errors: ErrorsType;
}

export const initialState: FormState = {
    inputs: {},
    errors: {},
};

const schema: { [key: string]: string } = {
    firstname: 'required',
    lastname: 'required',
    email: 'required|email',
    phone: 'required|number|min:10',
    password: 'required|min:8|number|special',
};

export const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'SET_INPUT':
            const { field, value } = action;
            const errors :  ErrorsType = validate({ [field]: value }, { [field]: schema[field] });
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.field]: action.value
                },
                errors: {
                    ...state.errors,
                    [field]: errors[field] || '',
                },
            };
        case 'SET_ERROR':
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.field]: action.error
                }
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                errors: {}
            };
        case 'SET_API_ERRORS':
            return {
                ...state,
                errors: action.errors
            };
        default:
            return state;
    }
}