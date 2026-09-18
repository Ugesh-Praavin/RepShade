import { useAuthStore } from '../src/stores/authStore';

describe('Repshade Authentication State & Store', () => {
  it('should have initial signed-out / guest state with user and guest@gmail.com', () => {
    const state = useAuthStore.getState();
    expect(state.user).toEqual({
      uid: 'local_user',
      email: 'guest@gmail.com',
      displayName: 'user',
      photoURL: null,
    });
    expect(state.isAuthenticated).toBe(false);
  });

  it('should reset to default guest user when continueAsGuest is called', () => {
    useAuthStore.getState().continueAsGuest();
    const state = useAuthStore.getState();
    expect(state.user?.displayName).toBe('user');
    expect(state.user?.email).toBe('guest@gmail.com');
    expect(state.isAuthenticated).toBe(false);
  });

  it('should clear error state on clearError action', () => {
    useAuthStore.setState({ error: 'Test error message' });
    expect(useAuthStore.getState().error).toBe('Test error message');

    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
