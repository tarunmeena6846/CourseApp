import { selector } from "recoil";
import { userState } from "../atoms/user";

export const emailState = selector({
  key: "userEmailState",
  get: ({ get }) => {
    const state = get(userState);
    return state.userEmail;
  },
});
