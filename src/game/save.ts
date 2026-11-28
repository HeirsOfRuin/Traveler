// Traveler's saves: the engine's codec with this game's format name, version and migrations, and
// its save-code prefix. The contract (tests/save-contract.test.ts): every save version that ever
// shipped has a fixture in tests/fixtures/, and each loads and plays on.
import { makeSaveCodec, SaveError, type SaveFile as CoreSaveFile, type LoadResult as CoreLoadResult } from '@engine/save';
import { encodeSaveCode as encodeCode, decodeSaveCode as decodeCode } from '@engine/savecode';
import type { GameState } from './state';

export { SaveError };

/** Never rename: a save without this format name is refused. */
export const SAVE_FORMAT = 'traveler-save';
export const SAVE_VERSION = 2;
/** localStorage key; never rename either. */
export const SAVE_KEY = 'traveler.save.v1';

export type SaveFile = CoreSaveFile<GameState>;
export type LoadResult = CoreLoadResult<GameState>;

/** fromVersion -> the next version's save. Add one when SAVE_VERSION rises, and commit the old fixture first. */
export const migrations: Record<number, (save: SaveFile) => SaveFile> = {
  // v2 (2026-11-28): the deck's spent list, and the four years. A v1 save has used no deck and begun no life.
  1: (save) => ({ ...save, saveVersion: 2, state: { ...save.state, spent: (save.state as Partial<GameState>).spent ?? {} } }),
};

export const { toSave, fromSave } = makeSaveCodec<GameState>({ format: SAVE_FORMAT, title: 'Traveler', version: SAVE_VERSION, migrations });

/** Save codes: "TRV1." + base64url of the deflated save (moves a game between devices). */
export const CODE_PREFIX = 'TRV1.';
export const encodeSaveCode = (save: unknown) => encodeCode(CODE_PREFIX, save);
export const decodeSaveCode = (text: string) => decodeCode(CODE_PREFIX, text);
