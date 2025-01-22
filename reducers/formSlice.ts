import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validate } from '@/util/validator';

export interface InputsType {
    [key: string]: string;
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
        setInput(state, action: PayloadAction<{ field: string; value: string }>) {
            const { field, value } = action.payload;
            const errors: ErrorsType = validate({ [field]: value }, { [field]: schema[field] });
            state.inputs[field] = value;
            state.errors[field] = errors[field] || '';
        },
        setError(state, action: PayloadAction<{ field: string; error: string }>) {
            const { field, error } = action.payload;
            state.errors[field] = error;
        },
        clearErrors(state) {
            state.errors = {};
        },
        setApiErrors(state, action: PayloadAction<ErrorsType>) {
            state.errors = action.payload;
        },
    },
});

export const { setInput, setError, clearErrors, setApiErrors } = formSlice.actions;
export default formSlice.reducer;