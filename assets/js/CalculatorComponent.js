var Calculator = (function( $, program ) {

    var _currencyWidget = new CurrencyWidget();

    var USD, EUR;

    var _programObjects = [];

    var _appendRows = function( selector ) {

        for ( var i = 0; i < program.length; ++i ) {

            _programObjects[ i ] = new TableRow( program[ i ] );
            _programObjects[ i ].append( selector + ' .table' );
        }
    };

    var _createTable = function() {
        return $(
            '<table' +
                ' class="table table-bordered">' +
                '<tr class="info">' +
                    '<th>#</th>' +
                    '<th>Location or region</th>' +
                    '<th>Activity name</th>' +
                    '<th>Activity offer</th>' +
                    '<th>Details</th>' +
                    '<th>Price</th>' +
                '</tr>' +
            '</table>'
        );
    };

    var _calculate = function() {

        if ( USD === undefined || EUR === undefined ) {

            throw {
                title: 'No informations about USD and EUR currencies!'
            }

            /*
            var total = 0;
            var currency = undefined;

            for ( var i = 0; i < _programObjects.length; ++i ) {

                if ( _programObjects[ i ].isSelected() === false ) {
                    continue ;
                }

                if ( currency !== undefined && currency !== _programObjects[ i ].getCurrency() ) {
                    throw {
                        title: 'Comparison error!',
                        message: 'Currency missmatch <b>' + currency + ' and ' + _programObjects[ i ].getCurrency() + '</b>'
                    };
                }

                total += _programObjects[ i ].getPrice();
                currency = _programObjects[ i ].getCurrency();
            }

            return total;
            */
        }

        var total = {
            EUR: 0,
            USD: 0
        }

        for ( var i = 0; i < _programObjects.length; ++i ) {

            if ( _programObjects[ i ].isSelected() === false ) {
                continue ;
            }

            if ( _programObjects[ i ].getCurrency() === 'USD' || _programObjects[ i ].getCurrency() === 'EUR' ) {

                total[ _programObjects[ i ].getCurrency() ] += _programObjects[ i ].getPrice();

            } else {
                throw {
                    title: 'Comparison error!',
                    message: 'Currency missmatch <b>' + currency + ' and ' + _programObjects[ i ].getCurrency() + '</b>'
                };
            }
        }

        return Math.round( total.EUR * EUR ) + Math.round( total.USD * USD );
    };

    var _createAlertWidget = function( title, message ) {

        var text = '';

        if ( !title && !message ) {
            text = 'An error occured!';
        }

        if ( title ) {
            text += '<span class="alert__title">' + title + '</span>';
        }

        if ( message ) {
            text += '<span class="alert__message">' + message + '</span>';
        }

        return $(
            '<div class="alert alert-danger">' +
                text +
            '</div>'
        );
    };

    var _createControls = function() {

        var controls = $( '<div class="control text-center">' );

        controls
            .append( _currencyWidget.getWidget() )
            .append( '<div class="row"><div class="text-center control__value col-sm-6 col-sm-offset-3"></div></div>' )
            .append( '<button class="control__button btn btn-success btn-large">Calculate</button>' )
            .find( '.control__button' ).click(function( e ) {
                try {

                    var total = _calculate();

                    $( '.control .control__value' ).html(
                        '<div class="control__success">' +
                            'Total cost: <span class="control__result">' + total.toLocaleString( 'hu-HU' ) + ' HUF</span>' +
                        '</div>'
                    );

                    controls.find( '.control__success' ).fadeIn( 600 );

                } catch ( exception ) {
                    $( '.control .control__value' ).html( _createAlertWidget( exception.title, exception.message ) );
                }
        });

        return controls;
    };

    var _downloadCurrencies = function() {

        CurrencyAPI.setFrom( 'USD' );
        CurrencyAPI.setDest( 'HUF' );

        // download USD
        CurrencyAPI.getDifference(function( data ) {
            USD = data;
        }, function() {
            USD = undefined;
        });

        CurrencyAPI.setFrom( 'EUR' );

        // download EUR
        CurrencyAPI.getDifference(function( data ) {
            EUR = data;
        }, function() {
            EUR = undefined;
        });
    };

    var _show = function( selector ) {

        // set currencies
        _downloadCurrencies();

        $( selector ).html( '' );
        $( selector ).append( _createTable );
        _appendRows( selector );

        $( selector ).append( _createControls );
        _currencyWidget.loadCurrency();

        // init bootstrap dropdown menu
        $( '.dropdown-toggle' ).dropdown();
    };

    return {
        render: _show
    }

})( jQuery, program );