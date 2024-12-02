import { create } from 'zustand';

const useStore = create((set) => ({
  currentUser: '',
  setCurrentUser: (user) => set(() => ({currentUser: user})),
}));

export default useStore;