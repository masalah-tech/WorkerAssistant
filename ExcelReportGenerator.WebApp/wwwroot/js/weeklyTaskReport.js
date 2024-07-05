/**
 *  Form Wizard
 */

'use strict';

function getFormattedDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based
    let year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
}

function setDateRange() {
    let today = new Date();
    let currentDay = today.getDay(); // Sunday - Saturday : 0 - 6
    let startDate, endDate;

    if (currentDay >= 0 && currentDay <= 4) { // Sunday to Thursday
        startDate = new Date(today);
        startDate.setDate(today.getDate() - currentDay);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 4);
    } else { // Friday and Saturday
        startDate = new Date(today);
        startDate.setDate(today.getDate() + (7 - currentDay));
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 4);
    }

    document.getElementById('week-start-date').value = getFormattedDate(startDate);
    document.getElementById('week-end-date').value = getFormattedDate(endDate);
}

$(function () {
    setDateRange();

    // Bootstrap Datepicker
    // --------------------------------------------------------------------
    var bsDatepickerRange = $('#bs-datepicker-daterange');
    var formtDDMM = $('.format-dd-mm-yyyy');

    if (bsDatepickerRange.length) {
        bsDatepickerRange.datepicker({
            todayHighlight: true,
            orientation: isRtl ? 'auto right' : 'auto left',
            format: 'dd/mm/yyyy',
        });
    }

    // Format DD/MM/YYYY
    if (formtDDMM.length) {
        formtDDMM.datepicker({
            todayHighlight: true,
            orientation: isRtl ? 'auto right' : 'auto left',
            format: 'dd/mm/yyyy',
        });
    }
});
(function () {

    // Vertical Wizard
    // --------------------------------------------------------------------
    const wizardVertical = document.querySelector('.wizard-vertical'),
        wizardVerticalBtnNextList = [].slice.call(wizardVertical.querySelectorAll('.btn-next')),
        wizardVerticalBtnPrevList = [].slice.call(wizardVertical.querySelectorAll('.btn-prev')),
        wizardVerticalBtnSubmit = wizardVertical.querySelector('.btn-submit');

    if (typeof wizardVertical !== undefined && wizardVertical !== null) {
        const verticalStepper = new Stepper(wizardVertical, {
            linear: false
        });
        if (wizardVerticalBtnNextList) {
            wizardVerticalBtnNextList.forEach(wizardVerticalBtnNext => {
                wizardVerticalBtnNext.addEventListener('click', event => {
                    verticalStepper.next();
                });
            });
        }
        if (wizardVerticalBtnPrevList) {
            wizardVerticalBtnPrevList.forEach(wizardVerticalBtnPrev => {
                wizardVerticalBtnPrev.addEventListener('click', event => {
                    verticalStepper.previous();
                });
            });
        }

        if (wizardVerticalBtnSubmit) {
            wizardVerticalBtnSubmit.addEventListener('click', event => {


                const employeeName = document.querySelector("#employee-name").value;
                const weekStartDate = document.querySelector("#week-start-date").value;
                const weekEndDate = document.querySelector("#week-end-date").value;

                const requestModel = {
                    employeeName: employeeName,
                    weekStartDate: weekStartDate,
                    weekEndDate: weekEndDate
                };

                $.ajax({
                    url: `/TaskReport/GenerateDemoReport`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(requestModel),
                    success: function (data) {

                        const link = document.createElement('a');
                        link.href = `/weekly//${data.fileName}`;
                        link.download = data.fileName;
                        link.click();

                    },
                    error: function (xhr, status, error) {
                        console.log("Something went wrong", error);
                    }
                });

            });
        }
    }

})();

// bootstrap-maxlength & repeater (jquery)
$(function () {
    var maxlengthInput = $('.bootstrap-maxlength-example'),
        formRepeater = $('.form-repeater');

    // Bootstrap Max Length
    // --------------------------------------------------------------------
    if (maxlengthInput.length) {
        maxlengthInput.each(function () {
            $(this).maxlength({
                warningClass: 'label label-success bg-success text-white',
                limitReachedClass: 'label label-danger',
                separator: ' out of ',
                preText: 'You typed ',
                postText: ' chars available.',
                validate: true,
                threshold: +this.getAttribute('maxlength')
            });
        });
    }

    // Form Repeater
    // ! Using jQuery each loop to add dynamic id and class for inputs. You may need to improve it based on form fields.
    // -----------------------------------------------------------------------------------------------------------------

    if (formRepeater.length) {
        var row = 2;
        formRepeater.on('submit', function (e) {
            e.preventDefault();
        });
        formRepeater.repeater({
            show: function () {
                var fromControl = $(this).find('.form-control, .form-select');
                var formLabel = $(this).find('.form-label');

                fromControl.each(function (i) {
                    var id = `${fromControl[i].getAttribute("id")}-` + row;
                    $(fromControl[i]).attr('id', id);
                    $(formLabel[i]).attr('for', id);

                    if ($(fromControl[i])[0].classList.contains("select2")) {
                        $(fromControl[i]).select2({
                            allowClear: true
                        });
                    }
                });

                row++;

                $(this).slideDown();
            },
            hide: function (e) {
                $(this).slideUp(e);
            }
        });

        $('.select2').select2({
            allowClear: true
        });
    }
});
