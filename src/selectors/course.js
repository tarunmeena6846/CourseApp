import { selector } from "recoil";
import { courseState } from "../atoms/course";

export const isCourseLoading = selector({
  key: "isCourseLoading",
  get: ({ get }) => {
    const state = get(courseState);
    return state.isLoading;
  },
});
export const courseDetails = selector({
  key: "courseDetails",
  get: ({ get }) => {
    const state = get(courseState);
    console.log(state);
    if (state) {
      return state.course;
    }
    return "";
  },
});

export const courseTitle = selector({
  key: "courseTitle",
  get: ({ get }) => {
    const state = get(courseState);
    console.log(state);

    if (state && state.course) {
      return state.course.title;
    }
    return "";
  },
});

export const coursePrice = selector({
  key: "coursePrice",
  get: ({ get }) => {
    const state = get(courseState);
    console.log(state);

    if (state && state.course) {
      return state.course.price;
    }
    return "";
  },
});

export const courseImage = selector({
  key: "courseImage",
  get: ({ get }) => {
    const state = get(courseState);
    console.log(state);

    if (state && state.course) {
      return state.course.imageLink;
    }
    return "";
  },
});
