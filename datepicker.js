/* global angular */
/* global jQuery */
/* global moment */

var mod = angular.module('datepicker', []);

mod.directive('datepicker', function() {
    'use strict';

    var template = "<div class='input-group date'><input type='text' class='form-control'><span class='input-group-addon add-on'><i data-time-icon='fa fa-clock-o' data-date-icon='fa fa-calendar' class='fa fa-calendar'></i></span></div>";

    return {
        restrict: 'E',
        scope: {
            minimum: "&?minimum",
            maximum: "&?maximum"
        },
        template: template,
        require: 'ngModel',
        link: function(scope, iElement, iAttrs, ngModelCtrl) {
            scope.format = iAttrs.format || "YYYY-MM-DD";

            ngModelCtrl.$formatters.push(function(modelValue) {
                return modelValue.format(scope.format);
            });

            ngModelCtrl.$parsers.push(function(viewValue) {
                return moment(viewValue, scope.format, true);
            });

            ngModelCtrl.$validators.validDate = function(val) {
                return val.isValid();
            };

            ngModelCtrl.$validators.laterThanStart = function(val) {
                return !scope.minimum() || val.isAfter(scope.minimum()) || val.isSame(scope.minimum());
            };

            ngModelCtrl.$validators.earlierThanEnd = function(val) {
                return !scope.maximum() || val.isBefore(scope.maximum()) || val.isSame(scope.maximum());
            };


            var inputField = iElement.find(":input");

            ngModelCtrl.$render = function() {
                inputField.val(ngModelCtrl.$viewValue);
            };


            var onChange = function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(inputField.val());
                });
            };

            jQuery(function() {
                var picker = iElement.children(":first").datetimepicker({
                    format: scope.format,
                    useStrict: true,
                    keepInvalid: true
                });

                picker.data("DateTimePicker").keyBinds({});

                if(scope.minimum()) {
                    picker.data("DateTimePicker").minDate(scope.minimum());
                }

                if(scope.maximum()) {
                    picker.data("DateTimePicker").maxDate(scope.maximum());
                }

                inputField.on('input paste blur propertyChange', onChange);

                scope.$watch(function() {
                    return scope.minimum();
                }, function(newVal, oldVal) {
                    if(newVal != oldVal) {
                        picker.data("DateTimePicker").minDate(scope.minimum());
                        ngModelCtrl.$validate();
                    }
                });

                scope.$watch(function() {
                    return scope.maximum();
                }, function(newVal, oldVal) {
                    if(newVal != oldVal) {
                        picker.data("DateTimePicker").maxDate(scope.maximum());
                        ngModelCtrl.$validate();
                    }
                });
            });
        }
    };
});
