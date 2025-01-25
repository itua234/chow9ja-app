import formReducer, { setInput, setError, clearErrors, setApiErrors } from './formSlice';

describe('formSlice', () => {
    it('should handle setInput', () => {
        const state = formReducer(initialState, setInput({ field: 'firstname', value: 'John' }));
        expect(state.inputs.firstname).toBe('John');
    });

    it('should handle setError', () => {
        const state = formReducer(initialState, setError({ field: 'firstname', error: 'Required' }));
        expect(state.errors.firstname).toBe('Required');
    });

    it('should handle clearErrors', () => {
        const stateWithErrors = { ...initialState, errors: { firstname: 'Required' } };
        const state = formReducer(stateWithErrors, clearErrors());
        expect(state.errors).toEqual({});
    });

    it('should handle setApiErrors', () => {
        const apiErrors = { email: 'Invalid email' };
        const state = formReducer(initialState, setApiErrors(apiErrors));
        expect(state.errors).toEqual(apiErrors);
    });
});