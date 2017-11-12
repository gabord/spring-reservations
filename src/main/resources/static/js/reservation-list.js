/**
 * Script to display and cancel reservations.
 */

"use strict";

(function () {

  $(document).ready(function () {
    var table = null;


    function deleteWithAlert(id) {
      swal({
        title: "Are you sure?",
        text: "Are you 100% sure to delete this reservation?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            deleteReservationAjax(id);
          } 
        });
    }
    
    
    function deleteReservationAjax(id) {
      $.ajax({
        url: '/api/reservations/' + encodeURIComponent(id),
        method: 'DELETE',
        async: true,
        cache: false,
        timeout: 5000,
    
        data: {},
    
        success: function (data, statusText, response) {
          swal("The reservation is successfully deleted.", {
            icon: "success",
          });
          table.ajax.reload();
        },
    
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("reservation request failed ... HTTP status code: " + XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
          swal(
            'Oops...',
            'Error deleting this reservation. (' + XMLHttpRequest.status + ' - ' + XMLHttpRequest.responseText + ')',
            'error'
          )
          $('#action-error').fadeIn();
        }
      });
    }

    function loadAndDisplayListOfReservations() {
      table = $('#reservation_table').DataTable({
        "responsive": true,
        "scrollX": true,        
        "ajax": {
          "url": "/api/reservations/",
          "dataSrc": "content"
        },
        "columns": [
          { "data": "id" },
          { "data": "resourceId" },
          { "data": "startDate" },
          { "data": "endDate" },
          { "data": "owner" },
          {
            "data": "action", searchable: false, sortable: false,
            render: function (data, type, row) {
              return '<a href="#" class="delete-reservation" title="Delete this reservation"><i class="fa fa-trash-o"></i></a>'
            }
          }
        ],
        "columnDefs": [
          { "className": "dt-center", "targets": "_all" }
        ],
      });

      $('.message').hide();
    }

    function addTableEventHandlers() {
      $('#reservation_table tbody').on('click', 'a.delete-reservation', function () {
        var data = table.row( $(this).parents('tr') ).data();
        console.log(table.row( $(this).parents('tr') ).data());
        deleteWithAlert(data['id']);
      });
    }

    loadAndDisplayListOfReservations();
    addTableEventHandlers();
  });


})();