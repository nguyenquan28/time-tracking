const initialState = ["ngueyn quoc cuong"];

export default home = (state = initialState, action) => {
  switch (action.type) {
    case action.type === "add":
      console.log("add");
    case action.type === "del":
      console.log("delete");
    default:
      return state;
  }
};
