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

let fv;

function validateForm() {
    const formValidationExamples = document.getElementById('formValidationExamples');

    fv = FormValidation.formValidation(formValidationExamples, {
        fields: {
            employeeName: {
                validators: {
                    notEmpty: {
                        message: 'Employee name is required'
                    },
                    stringLength: {
                        min: 3,
                        max: 100,
                        message: 'The name must be more than 3 and less than 100 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z ]+$/,
                        message: 'The name can only consist of alphabetical and space'
                    }
                }
            },
            weekStartDate: {
                validators: {
                    callback: {
                        date: {
                            format: 'DD/MM/YYYY',
                        },
                        message: 'The date range should not exceed 7 days',
                        callback: function (input) {
                            const parseDate = (dateString) => {
                                const parts = dateString.split('/');
                                return new Date(parts[2], parts[1] - 1, parts[0]);
                            };

                            const startDate = parseDate(input.value);
                            const endDateInput = document.getElementById('week-end-date');
                            const endDate = parseDate(endDateInput.value);

                            if (!endDateInput.value) {
                                return true;
                            }

                            startDate.setHours(0, 0, 0, 0);
                            endDate.setHours(0, 0, 0, 0);

                            const diffTime = endDate - startDate;
                            const diffDays = (diffTime / (1000 * 60 * 60 * 24)) + 1;

                            return diffDays >= 1 && diffDays <= 7;
                        }
                    }
                }
            },
            taskDetails: {
                validators: {
                    notEmpty: {
                        message: 'This field is required'
                    },
                    stringLength: {
                        min: 3,
                        max: 500,
                        message: 'The task details must be more than 3 and less than 500 characters long'
                    }
                }
            },
            module: {
                validators: {
                    notEmpty: {
                        message: 'This field is required'
                    },
                    callback: {
                        message: 'This field is required',
                        callback: function (input) {
                            return input.value != -1;
                        }
                    }
                }
            },
            category: {
                notEmpty: {
                    message: 'This field is required'
                },
                validators: {
                    callback: {
                        message: 'This field is required',
                        callback: function (input) {
                            return input.value != -1;
                        }
                    }
                }
            },
            taskStartDate: {
                validators: {
                    notEmpty: {
                        message: 'This field is required'
                    },
                }
            },
            taskFinishDate: {
                validators: {
                    notEmpty: {
                        message: 'This field is required'
                    },
                }
            },
            taskStatus: {
                notEmpty: {
                    message: 'This field is required'
                },
                validators: {
                    callback: {
                        message: 'This field is required',
                        callback: function (input) {
                            return input.value != -1;
                        }
                    }
                }
            }
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: '',
                rowSelector: '.row'
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        },
        init: instance => {
            instance.on('plugins.message.placed', function (e) {
                if (e.element.parentElement.classList.contains('input-group')) {
                    e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                }
                if (e.element.parentElement.parentElement.classList.contains('custom-option')) {
                    e.element.closest('.row').insertAdjacentElement('afterend', e.messageElement);
                }
            });

            setUpRealTimeValidation(instance);
            initializeDatepicker($('.format-dd-mm-yyyy'));
        }
    });
}

function setUpRealTimeValidation(instance) {
    const weekStartDateInput = document.getElementById('week-start-date');
    const weekEndDateInput = document.getElementById('week-end-date');
    const select2Elems = document.querySelectorAll(".select2");
    const inputElems = document.querySelectorAll("input");
    const datepickers = document.querySelectorAll(".format-dd-mm-yyyy");

    const revalidateDateRange = () => {
        instance.revalidateField('weekStartDate');
    };

    weekStartDateInput.addEventListener('change', revalidateDateRange);
    weekEndDateInput.addEventListener('change', revalidateDateRange);
    select2Elems.forEach(elem => {
        $(elem).on("change", () => {

            instance.revalidateField(elem.id);

        });
    });

    inputElems.forEach(elem => {
        elem.addEventListener("change", () => {
            instance.revalidateField(elem.id);
        });
    });

    datepickers.forEach(elem => {
        $(elem).on('changeDate', function (e) {
            instance.revalidateField(elem.id);
        });
    });
}

function initializeDatepicker(elements) {
    elements.each(function () {
        $(this).datepicker({
            todayHighlight: true,
            orientation: isRtl ? 'auto right' : 'auto left',
            format: 'dd/mm/yyyy',
        })
    });
}

function addDynamicFieldValidation() {
    var formRepeater = $('.form-repeater');

    formRepeater.repeater({
        show: function () {
            var fromControl = $(this).find('.form-control, .form-select');
            var formLabel = $(this).find('.form-label');
            var row = $(this).index();

            fromControl.each(function (i) {
                var id = `${fromControl[i].getAttribute("id")}${row}`;
                $(fromControl[i]).attr('id', id);
                $(fromControl[i]).attr('name', id);
                $(formLabel[i]).attr('for', id);

                // Add field to FormValidation
                fv.addField(id, {
                    validators: {
                        notEmpty: {
                            message: 'This field is required'
                        }
                    }
                });


                if (fromControl[i].classList.contains("select2")) {

                    fromControl[i].value = "-1";

                    $(fromControl[i]).select2({
                        allowClear: true
                    });


                    fv.addField(id, {
                        validators: {
                            callback: {
                                message: `This field is required`,
                                callback: function (input) {
                                    return input.value != -1;
                                }
                            }
                        }
                    });
                }

                if (fromControl[i].classList.contains("format-dd-mm-yyyy")) {
                    $(fromControl[i]).datepicker({
                        todayHighlight: true,
                        orientation: isRtl ? 'auto right' : 'auto left',
                        format: 'dd/mm/yyyy',
                    });;
                }
                setUpRealTimeValidation(fv);
                initializeDatepicker($('.format-dd-mm-yyyy'));
            });

            row++;
            $(this).slideDown();
        },
        hide: function (e) {
            var fromControl = $(this).find('.form-control, .form-select');
            fromControl.each(function (i) {
                // Remove field from FormValidation
                fv.removeField(fromControl[i].getAttribute("id"));
            });
            $(this).slideUp(e);
        }
    });

    
}

$(function () {
    

    setDateRange();

    validateForm();
    addDynamicFieldValidation();

    const select2Elems = document.querySelectorAll(".select2");

    select2Elems.forEach(elem => {
        $(elem).select2({
            allowClear: true
        }).on("change", () => {

            if (elem.value === "0") {
                const id = elem.id;

                if (/^module/.test(id)) {
                    $("#addModuleModal").modal('show');
                } else if (/^category/.test(id)) {
                    $("#addCategoryModal").modal('show');
                } else if (/^taskStatus/.test(id)) {
                    $("#addTaskStatusModal").modal('show');
                }

                $(elem).val("-1").trigger("change");
            }

        });
    });

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


    // Validation
    // --------------------------------------------------------------------

    
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
                    fv.validate().then(function (status) {
                        if (status === 'Valid') {
                            verticalStepper.next();
                        }
                    });

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

                //const employeeName = document.querySelector("#employee-name").value;
                //const weekStartDate = document.querySelector("#week-start-date").value;
                //const weekEndDate = document.querySelector("#week-end-date").value;

                //const requestModel = {
                //    employeeName: employeeName,
                //    weekStartDate: weekStartDate,
                //    weekEndDate: weekEndDate
                //};

                //$.ajax({
                //    url: `/TaskReport/GenerateDemoReport`,
                //    method: 'POST',
                //    contentType: 'application/json',
                //    data: JSON.stringify(requestModel),
                //    success: function (data) {

                //        const link = document.createElement('a');
                //        link.href = `/weekly//${data.fileName}`;
                //        link.download = data.fileName;
                //        link.click();

                //    },
                //    error: function (xhr, status, error) {
                //        console.log("Something went wrong", error);
                //    }
                //});

            });
        }
    }

})();

