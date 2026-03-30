import { create } from 'zustand'

const useStore = create((set) => ({
  /* ===== AUTHENTICATION ===== */
  userId: null,
  authToken: null,
  username: null,
  isAuthenticated: false,
  
  setAuth: (token, userId, username) =>
    set({
      authToken: token,
      userId,
      username,
      isAuthenticated: true,
    }),
  
  logout: () =>
    set({
      authToken: null,
      userId: null,
      username: null,
      isAuthenticated: false,
      conversations: [],
      messages: {},
      activeConversationId: null,
    }),

  /* ===== SIDEBAR ===== */
  sidebarExpanded: true,
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

  /* ===== CONVERSATIONS ===== */
  conversations: [],
  activeConversationId: null,
  setConversations: (convs) => set({ conversations: convs }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  addConversation: (conv) =>
    set((state) => ({ conversations: [conv, ...state.conversations] })),
  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  /* ===== MESSAGES ===== */
  messages: {}, // { [conversationId]: Message[] }
  addMessage: (convId, msg) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [convId]: [...(state.messages[convId] || []), msg],
      },
    })),
  setMessages: (convId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [convId]: msgs },
    })),

  /* ===== AI STATE ===== */
  isTyping: false,
  setTyping: (v) => set({ isTyping: v }),

  /* ===== CUSTOMIZATION ===== */
  theme: 'void-dark',
  bubbleStyle: 'soft',
  fontStyle: 'literary',
  backgroundMode: 'living',
  soundEnabled: true,
  soundVolume: 0.5,
  
  setTheme: (t) => set({ theme: t }),
  setBubbleStyle: (s) => set({ bubbleStyle: s }),
  setFontStyle: (s) => set({ fontStyle: s }),
  setBackgroundMode: (m) => set({ backgroundMode: m }),
  setSoundEnabled: (v) => set({ soundEnabled: v }),
  setSoundVolume: (v) => set({ soundVolume: v }),

  /* ===== PERSONALITY ===== */
  personality: {
    empathy: 78,
    chaos: 32,
    formality: 45,
    intensity: 65,
  },
  setPersonality: (updates) =>
    set((state) => ({
      personality: { ...state.personality, ...updates },
    })),

  /* ===== STREAK ===== */
  streakDays: 4,
  lastActiveDate: null,
  incrementStreak: () =>
    set((state) => ({
      streakDays: state.streakDays + 1,
      lastActiveDate: new Date().toISOString(),
    })),

  /* ===== UI STATE ===== */
  settingsOpen: false,
  setSettingsOpen: (v) => set({ settingsOpen: v }),

  personalitySliderOpen: false,
  setPersonalitySliderOpen: (v) => set({ personalitySliderOpen: v }),

  scrolledUp: false,
  setScrolledUp: (v) => set({ scrolledUp: v }),

  newMessageCount: 0,
  setNewMessageCount: (v) => set({ newMessageCount: v }),
}))

export default useStore
