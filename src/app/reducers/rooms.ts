import { IRoom } from "../models/room";
import * as rooms from "../actions/rooms";

export interface IState {
  rooms: IRoom[];
}

const initialState: IState = {
  rooms: null
};

export function reducer(state: IState = initialState, action: rooms.Actions): IState {
  switch (action.type) {
    case rooms.LOAD_ROOMS_SUCCESS: {
      return {
        ...state,
        rooms: action.payload
      };
    }

    default: {
      return state;
    }
  };
};

export const getRooms = (state: IState) => state.rooms;
