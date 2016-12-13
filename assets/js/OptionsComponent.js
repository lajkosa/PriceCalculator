// Contains destination informations
//
// data should looks like this
// data = {
//     currency String, -- default USD
//     location String,
//     activity: String, -- optional
//     options [
//         {name String, price Float, link String optional, currency String optional},
//         {name String, price Float, link String optional, currency String optional},
//          ...
//     ]
// }
var Options = function( data, onClickCallback ) {

    this._data = data;

    this._uniqueId = null;

    this._defaultCurrency = 'USD';

    // returns an ID of component
    this.getUniqueId = function() {

        if ( this._uniqueId === null ) {
            this._uniqueId = 'option-' + parseInt( Math.random() * 100000 ) + 100000;
        }

        return this._uniqueId;
    };

    this._selectedOptionIndex = 0;

    this.getCurrency = function() {

        return ( typeof( this._data.options[ this._selectedOptionIndex ].currency ) !== 'undefined' )
            ? this._data.options[ this._selectedOptionIndex ].currency
            : ( typeof( this._data.currency ) !== 'undefined' )
                ? this._data.currency
                : this._defaultCurrency
        ;
    };

    // the name of the city or region
    this.getLocation = function() {
        return this._data.location;
    };

    this.getActivityName = function() {
        return ( this._data.activity )
            ? this._data.activity
            : '-- no information --'
        ;
    };

    // returns the name of the selected activity
    this.getName = function() {
        return this._data.options[ this._selectedOptionIndex ].name;
    };

    // returns the price of the selected activity
    this.getPrice = function() {
        return this._data.options[ this._selectedOptionIndex ].price;
    };

    // returns an url for detailed information
    this.getLink = function() {
        return this._data.options[ this._selectedOptionIndex ].link;
    };

    // appends the view
    this.append = function( selector ) {
        $( selector ).append( this._buildTemplate.bind( this ) );
    };

    // it is invoked by dropdown click event
    // @var e Event object
    // @var data {link String, price Int}
    // @var id an ID of options DOM
//    this.dropDownChange = function( e, data, id ) {};
    this.dropDownChange = onClickCallback;

    // generate a dropdown menu from options if necessary
    this._generateDropdown = function() {

        var tpl;

        var currency = ( typeof( this._data.currency ) !== 'undefined' )
            ? this._data.currency
            : 'USD'
        ;

        if ( this._data.options.length > 1 ) {

            var li = '';
            var actualCurrency;

            for ( var i = 0; i < this._data.options.length; ++i ) {

                actualCurrency = ( typeof( this._data.options[ i ].currency ) !== 'undefined'  )
                    ? this._data.options[ i ].currency
                    : currency
                ;

                li += '<li data-id="' + i + '">' +
                          '<a>' +
                                this._data.options[ i ].name +
                              ' <span class="dropdown--price">' +
                                    this._data.options[ i ].price + ' ' + actualCurrency +
                              ' </span>' +
                          '</a>' +
                      '</li>'
            }

            tpl = $(
                '<div' +
                    ' id="' + this.getUniqueId() + '"' +
                    ' class="dropdown">' +
                    '<button' +
                        ' class="btn btn-default dropdown-toggle dropdown-btn"' +
                        ' type="button"' +
                        //' id="dropdownMenu1"' +
                        ' data-toggle="dropdown"' +
                        ' aria-haspopup="true"' +
                        ' aria-expanded="true">' +
                        this._data.options[ 0 ].name +
                        '<span class="caret"></span>' +
                    '</button>' +
                    '<ul' +
                        ' class="dropdown-menu">' +
                        //' aria-labelledby="dropdownMenu1">' +
                        li +
                    '</ul>' +
                '</div>'
            );

            var that = this;

            // add click event for dropdown
            tpl.find( 'li' ).click(function( e ) {
                that._selectedOptionIndex = $( this ).attr( 'data-id' );
                tpl.find( 'button' ).html(
                    that._data.options[ that._selectedOptionIndex ].name +
                    '<span class="caret"></span>'
                );

                //that.dropDownChange();

                that.dropDownChange({
                    link: that.getLink(),
                    price: that.getPrice()
                });

            });

        } else {
            tpl = $(
                '<div' +
                    ' id="' + this.getUniqueId() + '"' +
                    ' class="fake-dropdown">' +
                    '<button' +
                        ' class="btn btn-default dropdown-btn"' +
                        ' type="button">' +
                        this._data.options[ this._selectedOptionIndex ].name +
                    '</button>' +
                '</div>'
            );
        }

        return tpl;
    };

    this._buildTemplate = function() {
        return this._generateDropdown();
    };
};
