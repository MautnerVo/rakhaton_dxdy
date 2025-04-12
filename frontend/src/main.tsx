import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

const theme = createTheme({
    fontFamily: 'Inter, sans-serif',
    headings: {fontFamily: 'Inter, sans-serif'}
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider theme={theme}>
            <App />
        </MantineProvider>
    </StrictMode>,
)
