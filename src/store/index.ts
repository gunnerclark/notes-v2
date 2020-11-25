import { createStore } from "vuex";

interface Note {
  uuid: string,
  title: string,
  body: any,
  checklist: Array<object>,
  tags: Array<string>,
  dateCreated: object,
  dateEdited: object
}

function generateUUID(): string {
  let d = new Date().getTime(); //Timestamp
  let d2 = (performance && performance.now && (performance.now()*1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if(d > 0){ //Use timestamp until depleted
      r = (d + r)%16 | 0;
      d = Math.floor(d/16);
    } else { //Use microseconds since page-load if supported
      r = (d2 + r)%16 | 0;
      d2 = Math.floor(d2/16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export default createStore({
  state: {
    // all notes
    //*firebase*/
    allNotes: new Map(),
    activeName: '',
    pinnedName: '',
    archiveName: '',
    trashName: '',
    // working note
    manageState: false,
    managingNote: {},
    managingUUID: {},
    managingLocation: '',
    // save / trash note variables
    tempTitle: '',
    tempBody: '',
    tempChecklist: [] as any,
    tempTags: new Set(),
    tempTag: '',
    // new organization method
    //*firebase*/
    location: new Map(),
    name: 'ACTIVE',
    // search
    searching: false,
    search: '',
    searchSet: new Set(),
    // demo login
    loggedIn: false,
  },
  mutations: {
    createNote(state, { title, body, tags }) {
      const uuid = generateUUID();
      const date = new Date();

			const note: Note = {
        uuid: uuid,
        title: title,
        body: body,
        checklist: [],
        tags: tags,
        dateCreated: date,
        dateEdited: {}
      };

      // new location method
      if (!state.location.has('ACTIVE')) {
        const tempSet = new Set();
        tempSet.add(uuid);

        state.location.set('ACTIVE', tempSet);
      } else {
        state.location.get('ACTIVE').add(uuid);
      }

      state.manageState = true;
      state.managingUUID = uuid;
      // set managing location
      const keys = Array.from(state.location.keys());
      for (let i = 0; i < keys.length; i++) {
        if (state.location.get(keys[i]).size > 0 && state.location.get(keys[i]).has(uuid)) {
          state.managingLocation = keys[i];
        }
      }
      state.allNotes.set(uuid, note);
      state.tempTitle = state.allNotes.get(uuid).title;
      state.tempBody = state.allNotes.get(uuid).body;
      state.tempChecklist = state.allNotes.get(uuid).checklist;
      state.tempTags = state.allNotes.get(uuid).tags;
    },
    
    manageNote(state, uuid) {
      state.managingUUID = uuid;
      state.manageState = true;
      const keys = Array.from(state.location.keys());
      const hardArray = ["PINNED", "ACTIVE", "ARCHIVE", "TRASH"];
      for (let i = 0; i < keys.length; i++) {
        if (state.location.get(keys[i]).size > 0 && state.location.get(keys[i]).has(uuid) && hardArray.includes(keys[i])) {
          // console.log(keys[i]);
          state.managingLocation = keys[i];
        }
      }
      // set temporary variables (looking back, v-model on Manager.vue getters seem redundant)
      state.tempTitle = state.allNotes.get(uuid).title;
      state.tempBody = state.allNotes.get(uuid).body;
      state.tempChecklist = state.allNotes.get(uuid).checklist;
      state.tempTags = state.allNotes.get(uuid).tags;
    },

    toggleManageState(state) {
      state.manageState = !state.manageState;
    },

    saveNote(state) {
      // set Title
      state.allNotes.get(state.managingUUID).title = state.tempTitle;
      // set Body
      state.allNotes.get(state.managingUUID).body = state.tempBody;
      // set Check List
      state.allNotes.get(state.managingUUID).checklist = state.tempChecklist;
      // set Tags
      if (state.tempTags.size > 0) {
        state.allNotes.get(state.managingUUID).tags = state.tempTags;
      }
      // set date edited'
      const date = new Date();
      state.allNotes.get(state.managingUUID).dateEdited = date;
      // reset temporary variables
      state.tempTitle = '';
      state.tempBody = '';
      // set manage to False
      state.manageState = false;
    },

    /*
    trashNote(state, uuid) {
      state.manageState = false;
      state.managingNote = {};
      state.managingUUID = {};
      state.tempTitle = '';
      state.tempBody = '';
      state.tempChecklist = [];
      state.tempTags = new Set();

      state.trash.set(uuid, state.allNotes.get(uuid));
      state.allNotes.delete(uuid);
    },
    */

    setLocation(state, { name, uuid, base }) {
      if (!state.location.has(name)) {
        const tempSet = new Set();
        tempSet.add(uuid);

        const hardArray = ["PINNED", "ACTIVE", "ARCHIVE", "TRASH"];

        if (name === "PINNED" || name === "ACTIVE" || name === "ARCHIVE" || name === "TRASH") {
          hardArray.splice(hardArray.indexOf(name), 1);

          for (let i = 0; i < hardArray.length; i++) {
            if (state.location.has(hardArray[i]) && state.location.get(hardArray[i]).has(uuid)) {
              state.location.get(hardArray[i]).delete(uuid);
            }
          }

          state.location.set(name, tempSet);
          // console.log(state.location);
        } else {
          state.location.set(name, tempSet);
        }
      } else {
        const hardArray = ["PINNED", "ACTIVE", "ARCHIVE", "TRASH"];

        if (name === "PINNED" || name === "ACTIVE" || name === "ARCHIVE" || name === "TRASH") {
          hardArray.splice(hardArray.indexOf(name), 1);

          for (let i = 0; i < hardArray.length; i++) {
            if (state.location.has(hardArray[i]) && state.location.get(hardArray[i]).has(uuid)) {
              state.location.get(hardArray[i]).delete(uuid);
            }
          }

          if (state.location.get(name).has(uuid)) {
            state.location.get(name).delete(uuid);
            // adds to the end of the array, add "date added" feature (make it default) -> custom order
            state.location.get("ACTIVE").add(uuid);
          } else {
            state.location.get(name).add(uuid);
          }
        } else {
          state.location.get(name).add(uuid);
        }
      }
      const keys = Array.from(state.location.keys());
      for (let i = 0; i < keys.length; i++) {
        if (state.location.get(keys[i]).size > 0 && state.location.get(keys[i]).has(uuid)) {
          state.managingLocation = keys[i];
        }
      }
    },

    removeLocation(state, { type, uuid }) {
      // removes uuid from ALL locations
      const location = state.location.keys();
      for (let i = 0; i < state.location.size; i++) {
        const name = location.next().value;
        if (state.location.get(name).has(uuid) && type === "tags" && name !== "PINNED" && name !== "ACTIVE" && name !== "ARCHIVE" && name !== "TRASH") {
          state.location.get(name).delete(uuid)
          // clear tags that are empty
          if (!(state.location.get(name).size > 0)) {
            state.location.delete(name);
          }
        }
      }
    },
    
    changeOrder(state, { type, uuid, direction }) {
      const keys = Array.from(state.location.keys());
      let location = '';
      for (let i = 0; i < keys.length; i++) {
        if (state.location.get(keys[i]).size > 0 && state.location.get(keys[i]).has(uuid)) {
          // console.log(keys[i]);
          location = keys[i];
        }
      }

      let tempArray: any = [];
      let tempIndex = 0;
      if (type === "noteList" ) {
        tempArray = Array.from(state.location.get(location));
        tempIndex = tempArray.indexOf(uuid);
      } else if (type === "checkList") {
        tempArray = state.tempChecklist;
        // using uuid as index for the checkList out of convenience, may cause confusion in the future
        tempIndex = uuid;
      }

      if( direction === 'up' && tempIndex !== 0) {
          const holder = tempArray[tempIndex - 1];
          tempArray[tempIndex - 1] = tempArray[tempIndex];
          tempArray[tempIndex] = holder;
      } else if ( direction === 'down' && tempIndex !== (tempArray.length - 1) ) {
        const holder = tempArray[tempIndex + 1];
        tempArray[tempIndex + 1] = tempArray[tempIndex];
        tempArray[tempIndex] = holder;
      }
      
      if (type === "noteList" ) {
        const tempSet = new Set(tempArray);
        state.location.set(location, tempSet);
      } else if (type === "checkList") {
        state.tempChecklist = tempArray;
      }
    },
    
    toggleCheck(state, uuid) {
      if (state.tempBody.length === 0 && state.tempChecklist.length === 0) {
        // change format of data within note ... title remains the same but body becomes { check : note } format
        // const noteBody = state.allNotes.get(state.managingUUID).body;
        const noteBody = state.tempBody;
        const checkList = [];
        const split = noteBody.split('\n');
        for (const item in split) {
          const newItem = { checked: false, note: split[item] };
          checkList.push(newItem);
        }
        state.tempChecklist = checkList;
        state.tempBody = '';
      } else if (state.tempBody.length > 0) {
        // const noteBody = state.allNotes.get(state.managingUUID).body;
        const noteBody = state.tempBody;
        const checkList = [];
        const split = noteBody.split('\n');
        for (const item in split) {
          const newItem = { checked: false, note: split[item] };
          checkList.push(newItem);
        }
        /*
        for (const item in checkList) {
          console.log(checkList[item]);
        }
        */
        state.tempChecklist = checkList;
        state.tempBody = '';
      } else if (state.tempChecklist.length > 0) {
        // change body back to normal (prompt user with loss of checklist item state)
        const checkList = state.tempChecklist;
        let noteBody = '';
        for (let i = 0; i < checkList.length; i++) {
          if (i === 0) {
            noteBody += checkList[i].note;
          }
          else {
            const add = '\n' + checkList[i].note;
            noteBody += add;
          }
        }
        state.tempBody = noteBody;
        state.tempChecklist = [] as any;
      }
    },

    deleteNote(state) {
      const location = state.location.keys();
      for (let i = 0; i < state.location.size; i++) {
        const name = location.next().value;
        if (state.location.get(name).has(state.managingUUID)) {
          state.location.get(name).delete(state.managingUUID)
        }
      }
      if (state.searchSet.has(state.managingUUID)) {
        state.searchSet.delete(state.managingUUID)
      }
      state.allNotes.delete(state.managingUUID);
      state.managingNote = {};
      state.managingUUID = {};
      state.tempTitle = '';
      state.tempBody = '';
      state.tempChecklist = [];
      state.tempTags = new Set();
    },

    searchNotes(state) {
      state.searchSet.clear();
      state.searching = true;
      const allNotes = state.allNotes.keys();
      const locationKeys = Array.from(state.location.keys());
      const firstWord = state.search.replace(/ .*/,'');
      if (firstWord[0] === '#' && firstWord[firstWord.length - 1] === ':' && locationKeys.includes(firstWord.replace('#', '').replace(':', '').toLowerCase())) {
        console.log("tag set");
        const tagSetName = firstWord.replace('#', '').replace(':', '').toLowerCase();
        const setArray = Array.from(state.location.get(tagSetName));
        let searchString = state.search.replace(firstWord, '');
        searchString = searchString.slice(1, (searchString.length));
        
        for (let i = 0; i < setArray.length; i++) {
          if (state.allNotes.get(setArray[i]).title.includes(searchString)) {
            state.searchSet.add(setArray[i]);
          } else if (state.allNotes.get(setArray[i]).body.includes(searchString)) {
            state.searchSet.add(setArray[i]);
          } else if (state.allNotes.get(setArray[i]).checklist.length > 0) {
            for (let i = 0; i < state.allNotes.get(setArray[i]).checklist.length; i++) {
              if (state.allNotes.get(setArray[i]).checklist[i].includes(searchString)) {
                return state.searchSet.add(setArray[i]);
              }
            }
          }
        }


      } else if (firstWord[0] === '~' && firstWord[firstWord.length - 1] === ':' && locationKeys.includes(firstWord.replace('~', '').replace(':', '').toUpperCase())) {
        console.log("main set");
        const mainSetName = firstWord.replace('~', '').replace(':', '').toUpperCase();
        const setArray = Array.from(state.location.get(mainSetName));
        let searchString = state.search.replace(firstWord, '');
        searchString = searchString.slice(1, (searchString.length));
        
        for (let i = 0; i < setArray.length; i++) {
          if (state.allNotes.get(setArray[i]).title.includes(searchString)) {
            state.searchSet.add(setArray[i]);
          } else if (state.allNotes.get(setArray[i]).body.includes(searchString)) {
            state.searchSet.add(setArray[i]);
          } else if (state.allNotes.get(setArray[i]).checklist.length > 0) {
            for (let i = 0; i < state.allNotes.get(setArray[i]).checklist.length; i++) {
              if (state.allNotes.get(setArray[i]).checklist[i].includes(searchString)) {
                return state.searchSet.add(setArray[i]);
              }
            }
          }
        }

      } else {
        console.log("normal search");
        for (let i = 0; i < state.allNotes.size; i++) {
          const uuid = allNotes.next().value;
          if (state.allNotes.get(uuid).title.includes(state.search)) {
            state.searchSet.add(uuid);
          } else if (state.allNotes.get(uuid).body.includes(state.search)) {
            state.searchSet.add(uuid);
          } else if (state.allNotes.get(uuid).checklist.length > 0) {
            for (let i = 0; i < state.allNotes.get(uuid).checklist.length; i++) {
              if (state.allNotes.get(uuid).checklist[i].includes(state.search)) {
                return state.searchSet.add(uuid);
              }
            }
          }
        }
      }
      console.log(state.searchSet);
    }
  },
  actions: {},
  modules: {},
  getters: {
    getAllNotes: state => state.allNotes,
    getManageState: state => state.manageState,
    getManagingUUID: state => state.managingUUID, 
    getManagingNote: state => state.managingNote,
    getLocation: state => state.location,
    getName: state => state.name,
    getManagingLocation: state => state.managingLocation,
    getSearching: state => state.searching,
    getSearch: state => state.search,
    getSearchSet: state => state.searchSet,
    getLoggedIn: state => state.loggedIn,
  }
});
