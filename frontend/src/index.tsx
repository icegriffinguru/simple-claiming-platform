import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './assets/sass/theme.scss';

declare global {
    // tslint:disable-next-line
    interface Window {
        web3: any;
        ethereum: any;
        Web3Modal: any;
        Box: any;
        box: any;
        space: any;
        chrome: any;
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
