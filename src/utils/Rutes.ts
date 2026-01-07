export const API_URL = `${import.meta.env.VITE_TEST_MODE == '0' ? import.meta.env.VITE_SERVER_TESTNET : import.meta.env.VITE_SERVER_MAINNET}`;

export const RUTE_PLAY_GAME = 'chips/play/game';

export const RUTE_GET_MINERS_HARDWARE_DATA = 'stats/miners';

export const RUTE_GET_MINING_POOLS_DATA = 'stats/mining-pools';

export const RUTE_USER_CHIPS = 'chips/bitcoin/';

export const RUTE_LEDGER_PENDING = 'ledger/get/pending/';

export const RUTE_METADATA_INFO = 'metadata/get/info';

export const RUTE_MP_GET_APP_ID = 'api/v1/app/key/get';
export const RUTE_MP_ADD_MINER = 'api/v1/app/keys';
export const RUTE_BITCOIN_ADDRESS = 'bitcoin/address/user/email/';
export const RUTE_BITCOIN_SEND_PAY = 'bitcoin/send/pay/';

// Liquidity
export const RUTE_LIQUIDITY_ADD = 'liquidity/add/';
export const RUTE_LIQUIDITY_GET = 'liquidity/get/';
export const RUTE_LIQUIDITY_YIELD = 'liquidity/yield/';
export const RUTE_LIQUIDITY_CHART = 'liquidity/chart/';
export const RUTE_LIQUIDITY_CHART_PIE = 'liquidity/pie/';
export const RUTE_LIQUIDITY_CHART_ALL = 'liquidity/all/';

// Login with email
export const RUTE_LOGIN_EMAIL = 'user/login/email';
export const RUTE_REGISTER_EMAIL = 'user/email';
export const RUTE_LOGIN_VALID_CODE = 'user/valid/code';

export const RUTE_USER_INFO_GAMES = 'user/info/games';
export const RUTE_USER_CHIPS_CHART = 'chips/chart';

// Users payments history
export const RUTE_PAYMENTS_USER = 'payment/get';

// Ask for withdraw in Bitcoin
export const RUTE_BITCOIN_WITHDRAW = 'bitcoin/pay/email';

//Energy
// Request energy to miner trough API
export const RUTE_REQUEST_ENERGY = 'api/v1/mining/new';

// Entropy endpoints
export const RUTE_ENTROPY_LOW = 'api/v1/mining/energy';
export const RUTE_ENTROPY_HIGH = 'api/v1/mining/energy/high';

export const RUTE_REQUEST_NEW_GAME = 'game/new';

export const RUTE_ENERGY_REPORT_GAME = 'ledger/energy/user';

//User stand
export const RUTE_BLACKJACK_STAND = 'game/bj/stand';
// User double
export const RUTE_BLACKJACK_DOUBLE = 'game/bj/double';

// Activation of Insurance
export const RUTE_BLACKJACK_INSURANCE = 'game/bj/insurance';

export const RUTE_BLACKJACK_DIVIDE = 'game/bj/divide';
