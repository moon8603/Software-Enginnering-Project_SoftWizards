import { create } from 'zustand';

const useStore = create((set) => ({
  //일반 사용자 상태
  // currentUser: '',
  // setCurrentUser: (user) => set(() => ({currentUser: user})),

  //임의의 관리자 상태(게시판의 어드민뷰 구현 용), 이 후에 api연동할 때 바꿀 예정
  isAdmin: false,
  setAdmin: (value) => set(() => ({ isAdmin: value })),
}));

export default useStore;