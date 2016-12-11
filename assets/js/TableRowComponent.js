var TableRow = function( data ) {

    var self = this;

    this._rowId = 'row-' + parseInt( Math.random() * 100000 ) + 100000;

    // Each TableRow instance also contains an Options instance
    // instantiate an Options with the click event callback
    this._options = new Options( data, function( data ) {

        var linkSelector = '#' + self._rowId + ' .row__details-link';
        var priceSelector = '#' + self._rowId + ' .row__price';

        $( priceSelector ).html( data.price );

        if ( data.link ) {

            $( linkSelector ).attr({
                'href': data.link
            })
            .text( data.link )
            .removeClass( 'hidden' );

        } else {
            $( linkSelector ).addClass( 'hidden' );
        }
    });

    this._selected = true;

    // tells if the set of activity is selected as possible program
    this.isSelected = function() {
        return this._selected;
    };

    this._events = function() {
        $( '#' + this._rowId + ' .row__checkbox' ).on( 'change', this._selectedEvent.bind( this ) );
    };

    this._selectedEvent = function( e ) {
        this._selected = !this._selected;
        $( '#' + this._rowId ).toggleClass( 'inactive' );
    };

    this.append = function( selector ) {
        $( selector ).append( this._generateRow.bind( this ) );
        this._events();
    };

    // returns the price of the selected activity
    this.getPrice = function() {
        return this._selected
            ? this._options.getPrice()
            : 0
        ;
    };

    this.getCurrency = function() {
        return this._options.getCurrency();
    };

    this._generateRow = function() {

        var rowId = this._rowId;

        var tr = $(
            '<tr id="' + rowId + '">' +
                '<td>' +
                    '<input' +
                        ' type="checkbox"' +
                        ' class="row__checkbox"' +
                        ' ' + ( this._selected ? 'checked' : '' ) +
                        '>' +
                '</td>' +
                '<td>' +
                    this._options.getLocation() +
                '</td>' +
                '<td>' +
                    this._options.getActivityName() +
                '</td>' +
                '<td class="dropdown-place">' +
                '</td>' +
                '<td>' +
                    '<a' +
                        ' href="' + this._options.getLink() + '"' +
                        ' target="_blank"' +
                        ' class="row__details-link' + ( this._options.getLink() === undefined ? ' hidden' : '' ) + '">' +
                        ( this._options.getLink() === undefined ? '' : this._options.getLink() )+
                    '</a>' +
                '</td>' +
                '<td>' +
                    '<span class="row__price">' +
                        this._options.getPrice() +
                    '</span>' +
                    this._options.getCurrency() +
                '</td>' +
            '</tr>'
        );

        tr.find( '.dropdown-place' ).append( this._options._generateDropdown() );

        return tr;
    };
}
