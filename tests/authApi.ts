// import { login } from './authApi';

// describe('login', () => {
//   it('should return user data on successful login', async () => {
//     const mockResponse = { data: { id: '1', email: 'test@example.com', token: 'abc123' } };
//     jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);

//     const result = await login('test@example.com', 'password');
//     expect(result.data).toEqual(mockResponse.data);
//   });
// });