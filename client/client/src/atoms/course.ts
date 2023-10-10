import { atom } from "recoil";
export type CourseData = {
  title: string;
  description: string;
  price: number;
  // published: boolean;
  imageLink: string;
};

export type CourseType = {
  isLoading: boolean;
  course: CourseData | null; // You can specify the type for the course field here
};
export const courseState = atom<CourseType>({
  key: "courseState",
  default: {
    isLoading: true,
    course: null,
  },
});
