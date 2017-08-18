let _inv = {
    LOCAL: 'http://localhost:29255/',
    DEV: 'dev api path',
    QA: 'QA api path',
    PRODUCTION: '',
};

module.exports = {
    getApiPath: () => {
        switch(_inv.ENVIRONMENT){
            case 'LOCAL':
                return _inv.LOCAL;
            case 'DEV':
                return _inv.DEV;
            case 'QA':
                return _inv.QA;
            case 'PRODUCTION':
                return _inv.PRODUCTION;
            default:
                return _inv.LOCAL;
        }
    }
};