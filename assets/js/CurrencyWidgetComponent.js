var CurrencyWidget = function( from, to ) {

    var self = this;

    this._from = from || 'USD';
    this._to = to || 'HUF';

    this._tpl = undefined;
    this._difference = 0;
    this._refreshNeeded = true;
    this._isLoading = false;

    this.getFrom = function() {
        return this._refreshNeeded === false
            ? this._from
            : ''
        ;
    };

    this.getTo = function() {
        return this._to;
    };

    this._events = function() {
        this._tpl.find( '.currency-widget__list' ).change( this._selectChange.bind( this ) );
        this._tpl.find( '.currency-widget__change' ).click( this.loadCurrency.bind( this ) );
    };

    this._selectChange = function( e ) {
        this._from = e.target.value;
        this._refreshNeeded = true;
    };

    this.getDifference = function() {
        return this._difference;
    };

    this.loadCurrency = function( e ) {

        if ( this._refreshNeeded === true && this._isLoading === false ) {

            this._isLoading = true;
            this._tpl.append( '<i class="currency-widget__spinner fa fa-spinner fa-2x fa-pulse fa-fw"></i>' );

            CurrencyAPI.setFrom( this._from );
            CurrencyAPI.setDest( this._to );

            CurrencyAPI.getDifference(function( data ) {
                self._difference = data;
                self._tpl.find( '.currency-widget__spinner' ).remove();
                self._tpl.find( '.currency-widget__exchange-rate' ).html( data );
                self._refreshNeeded = false;
                self._isLoading = false;
            }, function() {
                console.log( 'Error occured while downloading currency.' );
                self._tpl.find( '.currency-widget__spinner' ).remove();
                self._isLoading = false;
            });
        }
    };

    this.getWidget = function() {

        var select = '<select class="currency-widget__list">';
        var currencies = CurrencyAPI.getCurrencies();

        for ( var i = 0; i < currencies.length; ++i ) {
            select += '<option value="' + currencies[ i ] + '">' + currencies[ i ] + '</option>';
        }

        select += '</select>';

        var tpl = $(
            '<div class="currency-widget">' +
                select +
                ' is ' +
                '<span class="currency-widget__exchange-rate"></span>' +
                '<span class="currency-widget__to">HUF</span>' +
                '<button class="btn btn-primary currency-widget__change">' +
                    '<span class="glyphicon glyphicon-refresh"></span>' +
                    ' Download' +
                '</button>' +
            '</div>'
        );

        this._tpl = tpl;

        this._events();

        return tpl;
    };
}
