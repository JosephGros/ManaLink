export const BASE_XP = 100;
export const SCALING_XP = 25;
export const XP_SCALING_FACTOR = 1.25;
export const XP_FOR_GAME_PLAYED = 10;
export const XP_FOR_GAME_WON = 30;
export const XP_FOR_NEW_GROUP = 50;
export const XP_FOR_NEW_FRIEND = 20;


export const calculateRequiredXP = (level: number): number => {
    if (level === 1 || level === 2) {
      return BASE_XP;
    }
    return Math.floor(BASE_XP + SCALING_XP * Math.pow(level - 2, XP_SCALING_FACTOR));
  };