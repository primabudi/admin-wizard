import { type JSX } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  globalCss: {
    'html': {
      colorScheme: 'light',
    },
  },
});

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ChakraProvider>
  );
}

function customRender(
  ui: JSX.Element,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
