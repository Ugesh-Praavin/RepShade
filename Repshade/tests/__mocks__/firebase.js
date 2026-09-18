module.exports = {
  initializeApp: jest.fn().mockReturnValue({}),
  getApps: jest.fn().mockReturnValue([]),
  getApp: jest.fn().mockReturnValue({}),
  getAuth: jest.fn().mockReturnValue({ currentUser: null }),
  getFirestore: jest.fn().mockReturnValue({}),
  doc: jest.fn().mockReturnValue({}),
  setDoc: jest.fn().mockResolvedValue(undefined),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test_uid', email: 'test@example.com', displayName: 'Athlete', photoURL: null },
  }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test_uid', email: 'test@example.com', displayName: 'Athlete', photoURL: null },
  }),
  signOut: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  onAuthStateChanged: jest.fn().mockImplementation((auth, callback) => {
    callback(null);
    return jest.fn(); // Unsubscribe function
  }),
};
