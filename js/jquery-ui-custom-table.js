$(function() {
  $.widget( 'custom.table', {
    defaultElement: "<table>",
    // default options
    options: {
      scrollX: false,
      scrollY: false,
      display: true,
      cellBorder: true,
      hover: true,

      columns: [],
      selectable: true,
      source: null,

      // callback
      selectChange: null
    },

    _create: function() {
      this.wrapper = $('<div>')
        .addClass("custom-table")
        .insertAfter(this.element)

      this._createDataTable();

      this._initSource();
    },

    _createDataTable: function () {
      var me = this;

      //display cell-border hover
      if ( this.options.display ) {
        $(this.element).addClass('display');
      }

      if ( this.options.cellBorder ) {
        $(this.element).addClass('cell-border');
      }

      if ( this.options.hover ) {
        $(this.element).addClass('hover');
      }

      var table = $(this.element).DataTable({
          scrollX: this.options.scrollX,
          scrollY: this.options.scrollY,
          data: [],
          columns: this.options.columns
      });

      if (this.options.selectable) {

      $(this.element).find('tbody').on('click', 'tr', function() {
          me._click(this);
          });

      }

    },

    _click: function(element) {
      var table = $(this.element).DataTable();

      if ( $(element).hasClass('selected') ) {
          $(element).removeClass('selected');

          this._trigger('selectChange', null, { data: {}, before: element });
      } else {
          var before = table.$('tr.selected').removeClass('selected');
          $(element).addClass('selected');

          var data = table.row( element ).data();
         // console.log( data );
          this._trigger('selectChange', null, { data: data, before: before, after: element });
      }
    },

    _initSource: function() {
        if (typeof this.options.source === "string") {
          this.source = function (request, response) {
            url = this.options.source;

            $.ajax({
                url: url,
                data: request,
                dataType: 'json'
            })
            .done(function(data, status, jqXHR) {
                response(data);
            })
            .fail(function(jqXHR, status, e) {
                response([])
            });
          }
        } else {
          this.source = this.options.source;
        }
    },

    reload: function (params) {
      return this._reload(params);
    },

    _reload: function (params) {
      this.source( params, this._response());
      this._trigger('selectChange', null, { data: {}});
    },

    _response: function() {
       return $.proxy( function(content) {
           this.__response(content);
           }, this );
    },

    __response: function (content) {
        var table = $(this.element).DataTable();

        table.clear();
        table.rows.add(content).draw();
    },

    clear: function () {
         var table = $(this.element).DataTable();

         table.clear().draw();
    }

  });
});
