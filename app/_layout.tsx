import { Stack } from 'expo-router';
import { ProductProvider } from '../contexts/ProductContext';

export default function RootLayout() {
  return (
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
  )
}
