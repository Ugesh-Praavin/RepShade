import { useAuthStore } from '../src/stores/authStore';

describe('Repshade Authentication State & Store', () => {
  it('should have initial signed-out state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should clear error state on clearError action', () => {
    useAuthStore.setState({ error: 'Test error message' });
    expect(useAuthStore.getState().error).toBe('Test error message');

    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
