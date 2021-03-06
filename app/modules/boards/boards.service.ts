import {request} from 'helpers/request';
import {Boards} from './boards.entity';

export async function getAllBoards(): Promise<Boards> {
  const response = await request.get<Boards>('/api/boards');
  return response.data;
}
