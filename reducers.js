// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import profileReducer from './profileReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
});

export default rootReducer;

// store.js
import { createStore } from 'redux';
import rootReducer from './rootReducer';

const store = createStore(rootReducer);

export default store;

// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import AuthScreen from './AuthScreen';

const App = () => (
  <Provider store={store}>
    <AuthScreen />
  </Provider>
);

export default App;

// AuthScreen.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const AuthScreen = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, error } = useSelector((state) => state.auth);
  const { profile, loading, profileError } = useSelector((state) => state.profile);

  const handleLogin = () => {
    // Dispatch login action
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Welcome, {user.name}</Text>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {profile && <Text>Profile: {profile.bio}</Text>}
    </View>
  );
};

export default AuthScreen;