/**
 *  Form Wizard
 */

'use strict';

$(function () {
    // Bootstrap Datepicker
    // --------------------------------------------------------------------
    var bsDatepickerRange = $('#bs-datepicker-daterange');

    // Range
    if (bsDatepickerRange.length) {
        bsDatepickerRange.datepicker({
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
