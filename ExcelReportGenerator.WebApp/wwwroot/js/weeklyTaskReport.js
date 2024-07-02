/**
 *  Form Wizard
 */

'use strict';

$(function () {
    const select2 = $('.select2'),
        selectPicker = $('.selectpicker');

    // Bootstrap select
    if (selectPicker.length) {
        selectPicker.selectpicker();
    }

    // select2
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            $this.wrap('<div class="position-relative"></div>');
            $this.select2({
                placeholder: 'Select value',
                dropdownParent: $this.parent()
            });
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
                alert('Submitted..!!');
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
        var col = 1;
        formRepeater.on('submit', function (e) {
            e.preventDefault();
        });
        formRepeater.repeater({
            show: function () {
                var fromControl = $(this).find('.form-control, .form-select');
                var formLabel = $(this).find('.form-label');

                fromControl.each(function (i) {
                    var id = 'form-repeater-' + row + '-' + col;
                    $(fromControl[i]).attr('id', id);
                    $(formLabel[i]).attr('for', id);
                    col++;
                });

                row++;

                $(this).slideDown();
            },
            hide: function (e) {
                confirm('Are you sure you want to delete this element?') && $(this).slideUp(e);
            }
        });
    }
});
