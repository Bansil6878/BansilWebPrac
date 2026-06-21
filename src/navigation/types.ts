import { NavigatorScreenParams } from '@react-navigation/native';

export type CharactersStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { characterId: number };
};

export type LocationsStackParamList = {
  LocationList: undefined;
  LocationDetail: { locationId: number };
};

export type RootTabParamList = {
  CharactersTab: NavigatorScreenParams<CharactersStackParamList>;
  EpisodesTab: undefined;
  LocationsTab: NavigatorScreenParams<LocationsStackParamList>;
  FavouritesTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
