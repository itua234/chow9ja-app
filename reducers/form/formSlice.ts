import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validate } from '@/util/validator';

export interface InputsType {
    [key: string]: string | number | any;
}
export interface ErrorsType {
    [key: string]: string;
}
export interface FormState {
    inputs: InputsType;
    errors: ErrorsType;
}

const initialState: FormState = {
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

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setInputAndValidate(
            state, 
            action: PayloadAction<{ 
                field: string; 
                value: string;
                rules: {[key: string]: string}
            }>
        ) {
            const { field, value, rules } = action.payload;
            state.inputs[field] = value;
            const errors: ErrorsType = validate({ [field]: value }, rules);
            state.errors[field] = errors[field] || '';
        },
        setInput(state, action: PayloadAction<{ field: string; value: string }>) {
            const { field, value } = action.payload;
            state.inputs[field] = value;
        },
        setError(state, action: PayloadAction<{ field: string; error: string }>) {
            const { field, error } = action.payload;
            state.errors[field] = error;
        },
        clearErrors(state) {
            state.errors = {};
        },
        resetForm(state) {
            state.inputs = {};
            state.errors = {};
        },
        setApiErrors(state, action: PayloadAction<ErrorsType>) {
            state.errors = action.payload;
        },
        setChangePasswordInput(
            state, 
            action: PayloadAction<{ 
                field: string; 
                value: string;
                inputs: InputsType 
            }>
        ) {
            const { field, value, inputs } = action.payload;
            state.inputs[field] = value;
            // Reset confirm_password if password is changed
            if (field === 'password') {
                state.inputs['confirm_password'] = '';
            }
            const rules = {
                [field]: 
                    field === 'current_password' ? 'required' :
                    field === 'password' ? 'required|min:8|number|special' :
                    field === 'confirm_password' ? `required|match:password` :
                    'required'
            };
            const errors: ErrorsType = validate(
                { password: inputs.password, [field]: value }, 
                rules
            );
            state.errors[field] = errors[field] || '';
        }
    },
});

export const { 
    setInput, 
    setInputAndValidate, 
    setError, 
    clearErrors, 
    setApiErrors,
    setChangePasswordInput,
    resetForm
} = formSlice.actions;
export default formSlice.reducer;