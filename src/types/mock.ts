export interface MockDatabase {
  users: User[];
  recyclableItems: RecyclableItem[];
  postedItems: PostedItem[];
  userStats: { [userId: string]: UserStats };
  posterStats: { [userId: string]: PosterStats };
}

import { User, RecyclableItem, PostedItem, UserStats, PosterStats } from './index';