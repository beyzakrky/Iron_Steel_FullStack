import { createNavigationContainerRef } from '@react-navigation/native';

// api.ts gibi React component OLMAYAN dosyalardan navigation.reset()
// çağırabilmek için (token süresi dolunca otomatik Login'e atmak gibi).
export const navigationRef = createNavigationContainerRef();

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: 'LoginScreen' as never }] });
  }
}