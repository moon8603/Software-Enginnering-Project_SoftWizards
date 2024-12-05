import { create } from 'zustand';

const useStore = create((set) => ({
  //일반 사용자 상태
  currentUser: '',
  setCurrentUser: (user) => set(() => ({currentUser: user})),
}));

export default useStore;