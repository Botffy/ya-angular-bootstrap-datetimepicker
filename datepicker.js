/* global angular */
/* global jQuery */
/* global moment */

var mod = angular.module('datepicker', []);

mod.directive('datepicker', function() {
    'use strict';

    var template = "<div class='input-group date'><input type='text' class='form-control'><span class='input-group-addon add-on'><i data-time-icon='fa fa-clock-o' data-date-icon='fa fa-calendar' class='fa fa-calendar'></i></span></div>";

    return {
        restrict: 'E',
        scope: {},
        template: template,
        require: '?ngModel',
        link: function(scope, iElement, iAttrs, ngModelCtrl) {
            scope.format = iAttrs.format || "YYYY-MM-DD";

            ngModelCtrl.$formatters.push(function(modelValue) {
                return modelValue.format(scope.format);
            });

            ngModelCtrl.$parsers.push(function(viewValue) {
                return moment(viewValue, scope.format, true);
            });

            ngModelCtrl.$validators.validDate = function(val) {
                console.log(val);
                return val.isValid();
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
                    keepInvalid: true,
                });

                inputField.on('input paste blur propertyChange', onChange);
            });
        }
    };
});
