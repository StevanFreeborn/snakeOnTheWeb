import { nanoid } from 'nanoid';

export const createGameId = () => {
    return nanoid(10);
}