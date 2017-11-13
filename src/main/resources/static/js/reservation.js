/**
 * Script to handle placing reservations.
 */

"use strict";

(function () {

  function collectFormInput() {
    var reservationFormValues = {};

    $.each($('#reservationForm').serializeArray(), function (i, field) {
      reservationFormValues[field.name] = field.value;
    });

    return reservationFormValues;
  }


  $(document).ready(function () {

    function setupValidation() {
      $('#reservationForm').validate({
        rules: {
          "resourceId": {
            required: true
          },
          "fromDate": {
            required: true
          },
          "toDate": {
            required: true
          },
          "owner": {
            required: true
          }
        },
        messages: {
          "resourceId": {
            required: "Resource ID cannot be empty!"
          },
          "fromDate": {
            required: "Beginning date cannot be empty!"
          },
          "toDate": {
            required: "End date cannot be empty!"
          },
          "owner": {
            required: "Reserved by field cannot be empty!"
          }
        },
        onfocusout: function (element) {
          this.element(element);
        },
        errorElement: 'label',
        submitHandler: function (form) {
          onSubmitReservationForm();
          return false;
        }
      });
    }

    function makeRequestUrl() {
      var reservationRequest = collectFormInput();
      var reservationUrl =
        '/api/reservations/' + encodeURIComponent(reservationRequest.resourceId)
        + '/from-' + encodeURIComponent(reservationRequest.fromDate)
        + '/to-' + encodeURIComponent(reservationRequest.toDate)
        + '/?owner=' + encodeURIComponent(reservationRequest.owner);
      return reservationUrl;
    }

    function initializeDatePickers() {
      var datePickerOptions = {
        changeYear: true,
        dateFormat: 'yy-mm-dd'
      };

      $("#fromDate").datepicker(datePickerOptions);
      $("#toDate").datepicker(datePickerOptions);
    }


    function onSubmitReservationForm() {
      $('.message').hide();
      var newReservationUrl = makeRequestUrl();

      $.ajax({
        url: newReservationUrl,
        method: 'POST',
        async: true,
        cache: false,
        timeout: 5000,

        data: {},

        success: function (data, statusText, response) {
          var reservationId = response.getResponseHeader('reservation-id');
          swal(
            'Success!',
            'Your reservation has been successfully processed. Your reservation id is: ' + reservationId,
            'success'
          ).then(function(value) {
            window.location.href = '/reservations';
          });
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("reservation request failed ... HTTP status code: " + XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
          var errorMessage = '';
          switch (XMLHttpRequest.status) {
            case 400:
            case 405:
              errorMessage = 'Reservation failed - please check your input for completeness.';
              break;
            case 409:
              errorMessage = 'The room is already reserved for this period, please choose a different period.';
              break;
            case 500:
              errorMessage = 'Reservation failed - please try again later.';
              break;
            default:
              errorMessage = 'Reservation failed - please try again later.'; 
          }

          swal(
            'Oops...',
            errorMessage,
            'error'
          );
        }
      });
    }

    initializeDatePickers();
    setupValidation();
  });


})();