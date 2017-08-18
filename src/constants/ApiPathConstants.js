let _inv = {
    LOCAL: 'http://localhost:29255/',
    DEV: 'https://f35apidev.azurewebsites.net/',
    QA: '',
    TMP: 'https://f35webapiolddev.azurewebsites.net/',
    PRODUCTION: 'https://f35api.reservations.com/',
    ENVIRONMENT: 'TMP',
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
            case 'TMP':
                return _inv.TMP;
            default:
                return _inv.LOCAL;
        }
    }
};