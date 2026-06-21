import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  FilmIcon,
  HeartIcon,
  MapPinIcon,
  UserGroupIcon,
} from 'react-native-heroicons/outline';
import { CharacterDetailScreen } from '../features/characters/CharacterDetailScreen';
import { CharacterListScreen } from '../features/characters/CharacterListScreen';
import { EpisodesScreen } from '../features/episodes/EpisodesScreen';
import { FavouritesScreen } from '../features/favourites/FavouritesScreen';
import { LocationDetailScreen } from '../features/locations/LocationDetailScreen';
import { LocationsScreen } from '../features/locations/LocationsScreen';
import {
  CharactersStackParamList,
  LocationsStackParamList,
  RootTabParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const CharactersStack = createNativeStackNavigator<CharactersStackParamList>();
const LocationsStack = createNativeStackNavigator<LocationsStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: '#fff' },
  headerTitleStyle: { fontWeight: '600' as const },
  headerShadowVisible: false,
};

function CharactersStackNavigator() {
  return (
    <CharactersStack.Navigator screenOptions={screenOptions}>
      <CharactersStack.Screen
        name="CharacterList"
        component={CharacterListScreen}
        options={{ title: 'Characters', headerShown: false }}
      />
      <CharactersStack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={{ title: 'Character' }}
      />
    </CharactersStack.Navigator>
  );
}

function LocationsStackNavigator() {
  return (
    <LocationsStack.Navigator screenOptions={screenOptions}>
      <LocationsStack.Screen
        name="LocationList"
        component={LocationsScreen}
        options={{ title: 'Locations', headerShown: false }}
      />
      <LocationsStack.Screen
        name="LocationDetail"
        component={LocationDetailScreen}
        options={{ title: 'Location' }}
      />
    </LocationsStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...screenOptions,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}>
      <Tab.Screen
        name="CharactersTab"
        component={CharactersStackNavigator}
        options={{
          title: 'Characters',
          tabBarIcon: ({ color, size }) => (
            <UserGroupIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="EpisodesTab"
        component={EpisodesScreen}
        options={{
          title: 'Episodes',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FilmIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="LocationsTab"
        component={LocationsStackNavigator}
        options={{
          title: 'Locations',
          tabBarIcon: ({ color, size }) => (
            <MapPinIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesScreen}
        options={{
          title: 'Favourites',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HeartIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
