export interface AvatarItem {
  id: string;
  name: string;
  category: 'male' | 'female';
  url: string;
}

export const AVATAR_PROFILES: AvatarItem[] = [
  // MALE AVATARS (6)
  {
    id: 'm1',
    name: 'Male 1',
    category: 'male',
    url: 'https://lh3.googleusercontent.com/d/17WJYRSBaN5DdzpKe0CuGsNlVo8u4xDlz',
  },
  {
    id: 'm2',
    name: 'Male 2',
    category: 'male',
    url: 'https://lh3.googleusercontent.com/d/1aa22aYjhgXURYUxYqo9HQaXs_uQFfav1',
  },
  {
    id: 'm3',
    name: 'Male 3',
    category: 'male',
    url: 'https://lh3.googleusercontent.com/d/1t-SkmVUyKmeK5JJdEfg1CrVo6xuzD4XZ',
  },
  {
    id: 'm4',
    name: 'Male 4',
    category: 'male',
    url: 'https://lh3.googleusercontent.com/d/1ZpMIn8VoaGe5-DdH_p-BYi0wwQ9XG1yF',
  },
  {
    id: 'm5',
    name: 'Male 5',
    category: 'male',
    url: 'https://lh3.googleusercontent.com/d/1H5yExP_AiaVLY8qDc5O6KAOvj90G1Wcy',
  },
  {
    id: 'm6',
    name: 'Male 6',
    category: 'male',
    url: 'https://lh3.googleusercontent.com/d/1kbRezKen3aFaSZsMXp0p-JBbsoyA0tdK',
  },

  // FEMALE AVATARS (6)
  {
    id: 'f1',
    name: 'Female 1',
    category: 'female',
    url: 'https://lh3.googleusercontent.com/d/1SDWWcgDc6xsj0Z7EnT8wvzkaeq_HzEhS',
  },
  {
    id: 'f2',
    name: 'Female 2',
    category: 'female',
    url: 'https://lh3.googleusercontent.com/d/1SCrZukqyv73yV3LBw3oJ8pX7L5TNF_Af',
  },
  {
    id: 'f3',
    name: 'Female 3',
    category: 'female',
    url: 'https://lh3.googleusercontent.com/d/1kVwJ--Aou8vi7ksud0iIygrSjVhb0yOx',
  },
  {
    id: 'f4',
    name: 'Female 4',
    category: 'female',
    url: 'https://lh3.googleusercontent.com/d/11lfUzCQ0QujtQTAoFXfi7DIBzSUxBvqE',
  },
  {
    id: 'f5',
    name: 'Female 5',
    category: 'female',
    url: 'https://lh3.googleusercontent.com/d/1neoIterZX_rDEOjFLe73AaLEkxVxS5Iz',
  },
  {
    id: 'f6',
    name: 'Female 6',
    category: 'female',
    url: 'https://lh3.googleusercontent.com/d/1VoBacm0cwibibv85B2VTCe8Qlb8IN587',
  },
];

export const MALE_AVATARS = AVATAR_PROFILES.filter((a) => a.category === 'male');
export const FEMALE_AVATARS = AVATAR_PROFILES.filter((a) => a.category === 'female');
