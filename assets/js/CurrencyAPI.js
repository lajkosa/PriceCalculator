var CurrencyAPI = (function( $ ) {

    var _url = 'http://api.fixer.io/latest';

    var _availableCurrencies = [
        'USD', 'EUR', 'GBP'
    ];

    var _fromCurrency = _availableCurrencies[ 0 ];
    var _destCurrency = 'HUF'

    var _getCurrencies = function() {
        return _availableCurrencies;
    };

    var _setFrom = function( currency ) {
        _fromCurrency = currency;
    };

    var _setDest = function( currency ) {
        _destCurrency = currency;
    };

    var _getDifference = function( success, fail ) {

        //var url = _url + '?base=' + _fromCurrency + '&symbols=' + _destCurrency;

        $.getJSON(
            _url, {
                base: _fromCurrency,
                symbols: _destCurrency
            }
        )
        .done(function( data ) {
            success( data.rates[ _destCurrency ] );
        })
        .fail(function( data ) {
            fail( data );
        });
    };

    var _getAll = function( success, fail ) {

        $.getJSON(
            _url, {
                base: _fromCurrency,
                symbols: _availableCurrencies.join()
            }
        )
        .done(function( data ) {
            success( data.rates );
        })
        .fail(function( data ) {
            fail( data );
        });
    };

    return {
        getCurrencies: _getCurrencies,
        setFrom: _setFrom,
        setDest: _setDest,
        getDifference: _getDifference,
        getAll: _getAll
    };

})( jQuery );
