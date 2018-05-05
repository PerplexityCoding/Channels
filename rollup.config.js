import typescript from 'typescript';
import rollupTypescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';

export default {
    input: './src/Channels.ts',

    output: {
        name: 'Channels',
        file: 'dist/bundle.js',
        format: 'umd'
    },

    plugins: [
        rollupTypescript({typescript}),
        uglify()
    ]
}
