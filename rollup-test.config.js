import typescript from 'typescript';
import rollupTypescript from 'rollup-plugin-typescript';

export default {
    input: './src/Channels.ts',

    output: {
        name: 'Channels',
        file: 'dist/bundle-test.js',
        format: 'cjs'
    },

    plugins: [
        rollupTypescript({typescript})
    ]
}
