import { PREDEFINED_SPLITS } from '../src/constants/predefinedSplits';

describe('Repshade App Polish & Settings Validation', () => {
  it('should have predefined splits (ppl, upper_lower, full_body)', () => {
    expect(PREDEFINED_SPLITS.ppl).toBeDefined();
    expect(PREDEFINED_SPLITS.upper_lower).toBeDefined();
    expect(PREDEFINED_SPLITS.full_body).toBeDefined();
  });

  it('should verify PPL default split has 3 workouts', () => {
    expect(PREDEFINED_SPLITS.ppl.workouts.length).toBe(3);
    expect(PREDEFINED_SPLITS.ppl.workouts[0].name).toBe('Push Day A');
    expect(PREDEFINED_SPLITS.ppl.workouts[1].name).toBe('Pull Day A');
    expect(PREDEFINED_SPLITS.ppl.workouts[2].name).toBe('Legs Day A');
  });

  it('should verify Upper/Lower split has 2 workouts', () => {
    expect(PREDEFINED_SPLITS.upper_lower.workouts.length).toBe(2);
    expect(PREDEFINED_SPLITS.upper_lower.workouts[0].name).toBe('Upper Body A');
    expect(PREDEFINED_SPLITS.upper_lower.workouts[1].name).toBe('Lower Body A');
  });

  it('should have 12 avatar profiles with 6 Male and 6 Female presets', async () => {
    const { AVATAR_PROFILES, MALE_AVATARS, FEMALE_AVATARS } = await import('../src/constants/avatars');
    expect(AVATAR_PROFILES.length).toBe(12);
    expect(MALE_AVATARS.length).toBe(6);
    expect(FEMALE_AVATARS.length).toBe(6);

    for (const avatar of AVATAR_PROFILES) {
      expect(avatar.url).toMatch(/^https:\/\/lh3\.googleusercontent\.com\/d\//);
      expect(avatar.name).toBeDefined();
    }
  });
});
