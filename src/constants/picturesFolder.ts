import path from 'path';

export const PICTURES_FOLDER = process.env.NODE_ENV !== 'local' ? '/app/pictures' : path.join(__dirname, '../../pictures');