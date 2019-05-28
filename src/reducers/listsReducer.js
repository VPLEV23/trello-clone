import { CONSTANTS } from "../actions";

const initialState = {
  "list-0": {
    id: "list-0",
    cards: ["card-0"],
    title: "myList",
    board: "board-0"
  }
};

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.ADD_LIST: {
      const { title, id } = action.payload;
      const newList = {
        title: title,
        id: `list-${id}`,
        cards: []
      };

      const newState = { ...state, [`list-${id}`]: newList };

      return newState;
    }

    case CONSTANTS.ADD_CARD: {
      const { listID, id } = action.payload;
      const list = state[listID];
      list.cards.push(`card-${id}`);
      return { ...state, [listID]: list };
    }

    case CONSTANTS.DRAG_HAPPENED:
      const {
        droppableIdStart,
        droppableIdEnd,
        droppableIndexEnd,
        droppableIndexStart,

        type
      } = action.payload;

      // drag list navkolo
      if (type === "list") {
        return state;
      }

      // v tomu samomy list
      if (droppableIdStart === droppableIdEnd) {
        const list = state[droppableIdStart];
        const card = list.cards.splice(droppableIndexStart, 1);
        list.cards.splice(droppableIndexEnd, 0, ...card);
        return { ...state, [droppableIdStart]: list };
      }

      // v other list
      if (droppableIdStart !== droppableIdEnd) {
        // находить де стається drag 
        const listStart = state[droppableIdStart];
        // витягує карту з листа
        const card = listStart.cards.splice(droppableIndexStart, 1);
        // находить список де кінець
        const listEnd = state[droppableIdEnd];

        // ставить карту в інший список
        listEnd.cards.splice(droppableIndexEnd, 0, ...card);
        return {
          ...state,
          [droppableIdStart]: listStart,
          [droppableIdEnd]: listEnd
        };
      }
      return state;

    case CONSTANTS.DELETE_CARD: {
      const { listID, id } = action.payload;

      const list = state[listID];
      const newCards = list.cards.filter(cardID => cardID !== id);

      return { ...state, [listID]: { ...list, cards: newCards } };
    }

    case CONSTANTS.EDIT_LIST_TITLE: {
      const { listID, newTitle } = action.payload;

      const list = state[listID];
      list.title = newTitle;
      return { ...state, [listID]: list };
    }

    case CONSTANTS.DELETE_LIST: {
      const { listID } = action.payload;
      const newState = state;
      delete newState[listID];
      return newState;
    }

    default:
      return state;
  }
};

export default listsReducer;