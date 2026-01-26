import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.itomcovertor.app',
    appName: 'ItoMcovertor',
    webDir: 'www',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        StatusBar: {
            style: 'dark',
            backgroundColor: '#0891b2'
        },
        Keyboard: {
            resize: 'body',
            resizeOnFullScreen: true
        }
    },
    ios: {
        contentInset: 'automatic'
    },
    android: {
        allowMixedContent: false
    }
};

export default config;
