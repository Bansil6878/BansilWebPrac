import { open, QuickSQLiteConnection } from 'react-native-quick-sqlite';
import { Character } from '../types/api.types';

const DB_NAME = 'rickmorty.db';

let db: QuickSQLiteConnection | null = null;

interface FavouriteRow {
  id: number;
  data: string;
}

function getDb(): QuickSQLiteConnection {
  if (!db) {
    db = open({ name: DB_NAME });
    db.execute(`
      CREATE TABLE IF NOT EXISTS favourites (
        id INTEGER PRIMARY KEY,
        data TEXT NOT NULL
      );
    `);
  }
  return db;
}

export function initFavouritesDb(): void {
  getDb();
}

function rowToCharacter(row: FavouriteRow): Character {
  return JSON.parse(row.data) as Character;
}

export async function getFavourites(): Promise<Character[]> {
  const connection = getDb();
  const result = await connection.executeAsync(
    'SELECT id, data FROM favourites ORDER BY id ASC',
  );

  const rows = result.rows;
  if (!rows || rows.length === 0) {
    return [];
  }

  const favourites: Character[] = [];
  for (let i = 0; i < rows.length; i++) {
    favourites.push(rowToCharacter(rows.item(i) as FavouriteRow));
  }
  return favourites;
}

export async function addFavourite(character: Character): Promise<void> {
  const connection = getDb();
  await connection.executeAsync(
    'INSERT OR REPLACE INTO favourites (id, data) VALUES (?, ?)',
    [character.id, JSON.stringify(character)],
  );
}

export async function removeFavourite(characterId: number): Promise<void> {
  const connection = getDb();
  await connection.executeAsync('DELETE FROM favourites WHERE id = ?', [
    characterId,
  ]);
}
