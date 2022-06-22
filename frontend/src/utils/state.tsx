export interface INotificationConfig {
    message: string;
    type: string;
    insert: string;
    container: string;
    animationIn: string[];
    animationOut: string[];
    dismiss: {
        duration: number;
        onScreen: boolean;
    }
}

export interface IDeployedChainId {
    testnet: number;
}

export interface IDeployedChain {
    testnet: {
        chainName: string;
        chainId: string | number;
        nativeCurrency: {
            name: string;
            decimals: number;
            symbol: string;
        };
        rpcUrls: string[];
    }
}

export interface IUserInfo {
    isRegistered: boolean;
    updatedAt: number;
    stakedAmount: number;
    claimedAmount: number;
}