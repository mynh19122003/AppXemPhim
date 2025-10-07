import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Import Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen'; // Updated to use TypeScript version
import MovieDetailScreen from '../screens/MovieDetailScreen';
import WatchMovieScreen from '../screens/WatchMovieScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VideoTestScreen from '../screens/VideoTestScreen';

// Import Category Screens
import {
  NewMoviesScreen,
  SingleMoviesScreen,
  SeriesMoviesScreen,
  AnimeScreen,
  USUKMoviesScreen,
  KoreanMoviesScreen,
} from '../screens/categories';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: 'transparent'},
          cardStyleInterpolator: ({current: {progress}}) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        <Stack.Screen name="WatchMovie" component={WatchMovieScreen} />
        <Stack.Screen name="VideoTest" component={VideoTestScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        
        {/* Category Screens */}
        <Stack.Screen name="NewMovies" component={NewMoviesScreen} />
        <Stack.Screen name="SingleMovies" component={SingleMoviesScreen} />
        <Stack.Screen name="SeriesMovies" component={SeriesMoviesScreen} />
        <Stack.Screen name="Anime" component={AnimeScreen} />
        <Stack.Screen name="USUKMovies" component={USUKMoviesScreen} />
        <Stack.Screen name="KoreanMovies" component={KoreanMoviesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
