import { Stack } from 'expo-router';
import { FacialAuthProvider } from '../contexts/FacialAuthContext';
import { ProductProvider } from '../contexts/ProductContext';

export default function RootLayout() {
  return (
    <FacialAuthProvider>
      <ProductProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen />
        </Stack>
      </ProductProvider>
    </FacialAuthProvider>
  )
}
