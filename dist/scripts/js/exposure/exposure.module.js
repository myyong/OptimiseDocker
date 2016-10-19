/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 24/01/2015
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */

var interventionModule = angular.module('Optimise.exposure', ['Optimise.view', 'Optimise.record']);

interventionModule.factory('Exposure', function () {
    return function (USUBJID, extrt) {
        var Exposure = {
            USUBJID : USUBJID,
            STUDYID : 'OPTIMISE',
            DOMAIN:'EX',
            EXSEQ :'',
            EXTRT:extrt,
            EXDOSE:'',
            EXDOSU:'',
            EXDOSFRM:'',
            EXDOSFRQ:'',
            EXSTDTC: new Date(),
            EXENDTC: '',
            EXADJ: '',
            displayLabel:'',
            displayDate:''
        }
        return Exposure;
    }
});

interventionModule.factory('DrugFactory', function () {

    var drugs = [
            {name: 'Interferon beta-1a',cat: 'Disease Modifying',
                posology:[{dose:'22.00', unit:'mcg', form:'SC', frequency:'3 /Week'},
                    {dose:'44.00', unit:'mcg', form:'SC', frequency:'3 /Week'}]},
            {name: 'Azathioprine', cat: 'Disease Modifying',
                posology:[{dose:'00.00', unit:'MIU', form:'00.00', frequency:'00.00'}]},
            {name: 'Interferon beta-1b', cat: 'Disease Modifying',
                posology:[{dose:'8.00', unit:'MIU', form:'SC', frequency:'/ 2 Days'}]},
            {name: 'Glatiramer acetate', cat: 'Disease Modifying',
                posology:[{dose:'20.00', unit:'mg',  form:'Injection', frequency:'/ Day'},
                          {dose:'40.00', unit:'mg',  form:'Injection', frequency:'3 / Week'}]},
            {name: 'Cyclophosphamide', cat: 'Disease Modifying',
                posology:[{dose:'00.00', unit:'MIU', form:'00.00', frequency:'00.00'}]},
            {name: 'Fingolimod', cat: 'Disease Modifying',
                posology:[{dose:'0.50', unit:'mg', form:'Oral', frequency:'/ Day'}]},
            {name: 'Rituximab', cat: 'Disease Modifying',
                posology:[{dose:'0.0', unit:'00.00', form:'IV', frequency:'/ Day'}]},
            {name: 'Methotrexate', cat: 'Disease Modifying',
                posology:[{dose:'00.00', unit:'00.00', form:'00.00', frequency:'00.00'}]},
            {name: 'Mitoxantrone', cat: 'Disease Modifying',
                posology:[{dose:'12.00', unit:'mcg', form:'IV', frequency:'3 / Month'}]},
            {name: 'Natalizumab', cat: 'Disease Modifying',
                posology:[{dose:'300.00', unit:'mg', form:'IV', frequency:'/ Month'}]},
            {name: 'Dimethyl fumarate', cat: 'Disease Modifying',
                posology:[{dose:'120.00', unit:'mg', form:'Oral', frequency:'2 / Day'}]},
            //{name: 'Other', cat: 'Disease Modifying',
            //    posology:[{dose:'', unit:'', form:'', frequency:''}]},

            {name: '4-aminopyridine', cat: 'Symptomatic',
                posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
            {name: 'Corticosteroids', cat: 'Symptomatic',
                posology:[{dose:'', unit:'', form:'', frequency:''}]},
            {name: 'Prednisone', cat: 'Symptomatic',
                posology:[{dose:'', unit:'', form:'', frequency:''}]},
            {name: 'Amantadine', cat: 'Symptomatic',
                posology:[{dose:'200.00', unit:'mg', form:'IV', frequency:'/ Day'}]},
            {name: 'Baclofen', cat: 'Symptomatic',
                posology:[{dose:'30.00', unit:'mg', form:'IV', frequency:'/ Day'}]},
            {name: 'IV Methyl-prednisolone', cat: 'Symptomatic',
                posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
            {name: 'IVIG', cat: 'Symptomatic',
                posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
            {name: 'Plasma Exchange', cat: 'Symptomatic',
                posology:[{dose:'10.00', unit:'mg', form:'IV', frequency:'2/ Day'}]},
            {name: 'Mycophenolic Acid', cat: 'Symptomatic',
                posology:[{dose:'500', unit:'mg', form:'IV', frequency:'1/ Day'},
                    {dose:'1000', unit:'mg', form:'IV', frequency:'1/ Day'}]},

            {name: 'Neuropsych. Training', cat: 'Others',
                posology:[{dose:'', unit:'', form:'', frequency:''}]},
            {name: 'Physiotherapy', cat: 'Others',
                posology:[{dose:'', unit:'', form:'', frequency:''}]},
            {name: 'Cognitive Therapy', cat: 'Others',
                posology:[{dose:'', unit:'', form:'', frequency:''}]}


        ];

    drugs.isKnown = function (EXTRT) {
        for (var n = 0; n < drugs.length; n++) {
            if (EXTRT==drugs[n].name) {
                return true;
            }
        }
        return false;
    }

    drugs.names = function (EXCAT) {
        var names = [];
        for (var n = 0; n < drugs.length; n++) {
            if (drugs[n].cat == EXCAT)
                names.push(drugs[n].name);
        }
        return names;
    }

    drugs.category = function (EXTRT) {
        for (var n = 0; n < drugs.length; n++) {
            if (EXTRT==drugs[n].name) {
                return drugs[n].cat;
            }
        }
        return "";
    }

    drugs.posology = function (EXTRT) {
        for (var n = 0; n < drugs.length; n++) {
            if (EXTRT==drugs[n].name) {
                return drugs[n].posology;
            }
        }
        return "";
    }

    return drugs;
});

interventionModule.service('exposures', function (Exposure, records, viewService) {
    var exposures = [];
    var currentExposure = null;
    var interuptions = [];
    var today = new Date();

    var deleteExposures = function () {
        exposures = [];
        //exposures.splice(0);
        interuptions = [];
        currentExposure = null;
        //console.log("length:"+exposures.length);
    }

    var populateExposures = function (RecordItems) {
        var newEvent = new Exposure();
        for (var i = 0; i < RecordItems.length; i++){

            switch (RecordItems[i].fieldName) {
                case 'STUDYID':{
                    newEvent.STUDYID = RecordItems[i].value;
                    break;
                }
                case 'DOMAIN':{
                    newEvent.DOMAIN = RecordItems[i].value;
                    break;
                }
                case 'USUBJID':{
                    newEvent.USUBJID = RecordItems[i].value;
                    break;
                }
                case 'EXSEQ':{
                    newEvent.EXSEQ = parseInt(RecordItems[i].value);
                    break;
                }
                case 'EXADJ':{
                    newEvent.EXADJ = RecordItems[i].value;
                    //console.log(newEvent.EXADJ);
                    break;
                }
                case 'EXSTDTC':{
                    newEvent.EXSTDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'EXTRT':{
                    newEvent.EXTRT = RecordItems[i].value;
                    break;
                }
                case 'EXDOSE':{
                    newEvent.EXDOSE = RecordItems[i].value;
                    break;
                }
                case 'EXDOSU':{
                    newEvent.EXDOSU = RecordItems[i].value;
                    break;
                }
                case 'EXDOSFRM':{
                    newEvent.EXDOSFRM = RecordItems[i].value;
                    break;
                }
                case 'EXDOSFRQ':{
                    newEvent.EXDOSFRQ = RecordItems[i].value;
                    break;
                }
                case 'EXENDTC':{
                    newEvent.EXENDTC = records.formatStringToDate(RecordItems[i].value);
                    break;
                }
                case 'displayLabel':{
                    newEvent.displayLabel = RecordItems[i].value;
                    break;
                }
                case 'displayDate':{
                    newEvent.displayDate = RecordItems[i].value;
                    break;
                }
                case 'EXCAT':{
                    newEvent.EXCAT = RecordItems[i].value;
                    break;
                }

            }
        }
        exposures.push(newEvent);
        //console.log(exposures);
    }

    var addExposure = function (EX){
        EX.EXSEQ = generateEXSEQ();
        exposures.push(EX);
        //console.log(exposures);
        if (!viewService.workOffline())
            records.saveRecord(EX);
    }

    var compileExposureSeq = function () {
        var seq = [];
        for (var e = 0; e < exposures.length; e++) {
            seq.push(exposures[e].EXSEQ);
        }
        return seq;
    }

    var generateEXSEQ = function () {
        var EXSEQs = compileExposureSeq();
        if (EXSEQs.length > 0) {
            EXSEQs.sort();
            return (EXSEQs[EXSEQs.length-1]+1);
        }
        else {
            return 0;
        }
    }

    var editExposure = function(exposure, resName, resValue) {
        if (!viewService.workOffline())
        {
            var USUBJID = {fieldName: "USUBJID", value: exposure.USUBJID};
            var SEQ = {fieldName:"EXSEQ", value: exposure.EXSEQ};
            var RESTOCHANGE = {fieldName:resName, value: resValue};
            //console.log(RESTOCHANGE);

            var idRecord = [USUBJID, SEQ];
            var valueRecord = [RESTOCHANGE];
            records.editRecord(idRecord, valueRecord);
        }
    };

    var setCurrentExposure = function (ex) {
        currentExposure = ex;
    }

    var deleteExposure = function (EX){
        console.log(EX);
        var index = exposures.indexOf(EX);
        if (index > -1) {
            exposures.splice(index, 1);
        }
        if (!viewService.workOffline())
            records.deleteRecord(EX);
    }

    var getExposure = function (EXTRT) {
        var exposureToTreatment = [];
        //console.log(exposures);
        for (var e = 0; e < exposures.length; e++)
        {
            if (exposures[e].EXTRT == EXTRT){
                exposureToTreatment.push(exposures[e]);
                //console.log("Pused:" +exposures[e].EXSEQ);
            }
        }
        //console.log(exposureToTreatment);
        return exposureToTreatment;
    }

    var getExposuresAscending = function (EXTRT) {
        var exposures = getExposure(EXTRT);
        var STDTCs = compileExposureStartDates(exposures);
        STDTCs.sort(sortAscending);
        var sortedExposures = [];
        for (var d = 0; d < STDTCs.length; d++) {
            sortedExposures.push(getExposureByDate(EXTRT, STDTCs[d]))
        }
        return exposures;
    }

    var sortAscending = function (date1, date2) {
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
    }

    var compileExposureStartDates = function (exposures) {
        var startDates = [];
        for (var e = 0; e < exposures.length; e++) {
            startDates.push(exposures[e].EXSTDTC);
        }
        return startDates;
    }

    var getExposureByDate = function (EXTRT, EXSTDTC) {
        //var exposuresMeetingCriteria = [];
        for (var e = 0; e < exposures.length; e++)
        {
            if (exposures[e].EXTRT == EXTRT){
                if (exposures[e].EXSTDTC.toDateString() == EXSTDTC.toDateString())
                {
                    return exposures[e];
                }
            }
        }
        return null;
    }

    var getExposureByDisplay = function (displayLabel, EXTRT) {
        var exposuresMeetingCriteria = [];
        if (displayLabel.indexOf('Dose Change') > -1) // if a dose change is to be deleted
        {
            for (var e = 0; e < exposures.length; e++)
            {
                if (exposures[e].displayLabel==displayLabel)
                    exposuresMeetingCriteria.push(exposures[e]);
            }
        }
        else {
            for (var e = 0; e < exposures.length; e++)
            {
                if (exposures[e].EXTRT == EXTRT){
                    exposuresMeetingCriteria.push(exposures[e]);
                }
            }
        }

        return exposuresMeetingCriteria;
    }

    var clearExposure = function () {
        currentExposure=null;
    }

    var getCurrentExposure = function () {
        return currentExposure;
    }

    var getUniqueExposures = function () {
        var uniqueExposures = [];
        for (var d = 0; d < exposures.length; d++){   // select events that happened on different days
            if (!exposureExists(uniqueExposures, exposures[d].EXTRT)){
                uniqueExposures.push(exposures[d]);
            }
        }
        return uniqueExposures;
    }

    var exposureExists = function (uniqueExposures, EXTRT){
        for (var d = 0; d < uniqueExposures.length; d++) {
            if (uniqueExposures[d].EXTRT == EXTRT) {
                return true;
            }
        }
        return false;
    }


    var getExposuresForTimeLine = function () {
        //var today = new Date();
        /*
        var exposuresForTimeline = [];
        exposuresForTimeline = exposures.slice();
        for (var e = 0; e < exposuresForTimeline.length; e++){
            if ((exposuresForTimeline[e].EXENDTC == null)||(exposuresForTimeline[e].EXENDTC == '')){
                exposuresForTimeline[e].EXENDTC = new Date();
            }
        }
        console.log(exposuresForTimeline);
        console.log(exposures);
        return exposuresForTimeline;  */
        return today;
    }

    var getExposures = function() {
        //console.log(exposures);
        return exposures;
    }

    var populateInteruptions = function() {
        var uniqueEXTRTs = getUniqueExposures();
        for (var e = 0; e < uniqueEXTRTs.length; e++) { // for every drug
            var sortedExposures = getExposuresAscending(uniqueEXTRTs[e].EXTRT);
            for (var se = 0; se < sortedExposures.length-1; se++) {
                var endOfFirst = sortedExposures[se];
                var startOfSecond = sortedExposures[se+1];

                var interuptionsForEXTRT = getInteruptionsForDrug(uniqueEXTRTs[e].EXTRT);
                if (interuptionsForEXTRT == null) {
                    var interuption = {drug:uniqueEXTRTs[e].EXTRT,
                        dates:[{   endOfFirst: endOfFirst,
                            startOfSecond: startOfSecond}]};
                    addInteruption(interuption);
                }
                else {
                    addInteruptionDate(uniqueEXTRTs[e].EXTRT, endOfFirst, startOfSecond);
                }
            }
        }
    }

    var deleteInteruptions = function(EXTRT) {
        var interuptionsForEXTRT = getInteruptionsForDrug(EXTRT);
        var index = interuptions.indexOf(interuptionsForEXTRT);
        if (index > -1) {
            interuptions.splice(index, 1);
        }
        //console.log(interuptions);
    }

    var getInteruptions = function() {
        return interuptions;
    }

    var addInteruptionDate = function(EXTRT, EX1End, EX2Start) {
        getInteruptionsForDrug(EXTRT).dates.push({endOfFirst: EX1End,
            startOfSecond: EX2Start});
    }

    var addInteruption = function(newInteruption) {
        interuptions.push(newInteruption);
    }

    var getInteruptionDatesForDrug = function(EXTRT) {
        for (var i = 0; i < interuptions.length; i++) {
            if (interuptions[i].drug == EXTRT) {
                return interuptions[i].dates;
            }
        }
        return [];
    }

    var getInteruptionsForDrug = function(EXTRT) {
        for (var i = 0; i < interuptions.length; i++) {
            if (interuptions[i].drug == EXTRT) {
                return interuptions[i];
            }
        }
        return null;
    }

    /*
    var addInteruptionDate = function(EXTRT, newDates) {
        for (var i = 0; i < interuptions.length; i++) {
            if (interuptions[i].drug == EXTRT) {
                interuptions[i].dates.push(newDates);
            }
        }
    }*/

    return {
        editExposure: editExposure,
        addExposure: addExposure,
        deleteExposure: deleteExposure,
        getExposure: getExposure,
        getExposureByDate: getExposureByDate,
        getExposureByDisplay: getExposureByDisplay,
        clearExposure: clearExposure,
        getCurrentExposure: getCurrentExposure,
        setCurrentExposure: setCurrentExposure,
        getUniqueExposures: getUniqueExposures,
        populateExposures:populateExposures,
        getExposuresForTimeLine: getExposuresForTimeLine,
        getExposures: getExposures,
        getExposuresAscending:getExposuresAscending,
        getInteruptions: getInteruptions,
        addInteruption: addInteruption,
        addInteruptionDate: addInteruptionDate,
        getInteruptionDatesForDrug:getInteruptionDatesForDrug,
        getInteruptionsForDrug: getInteruptionsForDrug,
        populateInteruptions: populateInteruptions,
        deleteInteruptions: deleteInteruptions,
        deleteExposures:deleteExposures
    }
});

interventionModule.controller('exposureInfoCtrl', function($scope,
                                                               $rootScope,
                                                               viewService,
                                                               Exposure, exposures,
                                                                DrugFactory) {
    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Exposure') {
            return true;
        }
        else
            return false;
    }

    var currentDate = new Date();
    var extrtRecorded = false;

    var dayMonthYear = angular.element(document.querySelectorAll('.DTC_DayMonthYear'));
    dayMonthYear.datepicker({
        format: "dd/mm/yyyy",
        endDate: currentDate.getFullYear().toString(),
        startView: 1,
        orientation: "auto",
        autoclose: true,
        todayHighlight: true
    });

    $rootScope.setNewExposureStartDate = function(display, EXSTDTC) {
        $scope.EXSTDTC_displayDate = display;
        $scope.EXSTDTC = EXSTDTC;
        //$scope.EXSTDTC = new Date($scope.EXSTDTC_displayDate.substr(6), parseInt($scope.EXSTDTC_displayDate.substr(3,2))-1, $scope.EXSTDTC_displayDate.substr(0,2));
        //console.log($scope.EXSTDTC);
        $scope.dateValidated = true;
    }

    $scope.setEXSTDTC_Interuption = function() {
        $scope.EXSTDTC_Interuption = new Date($scope.EXSTDTC_Interuption_display.substr(6), parseInt($scope.EXSTDTC_Interuption_display.substr(3,2))-1, $scope.EXSTDTC_Interuption_display.substr(0,2));
        if (thisIsADate($scope.EXENDTC_Interuption) && (thisIsADate($scope.EXSTDTC_Interuption))) {
            $scope.interuptionDateValidated = true;
        }
    }

    var thisIsADate = function(ddmmyy) {
        if ( Object.prototype.toString.call(ddmmyy) === "[object Date]" ) {
            return true;
        }
        else {
            //console.log("not a date");
            return false;
        }
    }

    $scope.setEXENDTC = function() {
        $scope.EXENDTC = new Date($scope.EXENDTC_displayDate.substr(6),
                            parseInt($scope.EXENDTC_displayDate.substr(3,2))-1,
                            $scope.EXENDTC_displayDate.substr(0,2));
        if (thisIsADate($scope.EXENDTC)) {
            var thisExposure = exposures.getExposuresAscending(exposures.getCurrentExposure().EXTRT);
            if (thisExposure.length > 0) {
                var lastExposure = thisExposure[thisExposure.length -1];
                lastExposure.EXENDTC =  $scope.EXENDTC;
                exposures.editExposure(lastExposure, 'EXENDTC', $scope.EXENDTC);
            }
        }
        //console.log($scope.EXENDTC);
    }

    $scope.setEXENDTC_Interuption = function() {
        $scope.EXENDTC_Interuption = new Date($scope.EXENDTC_Interuption_display.substr(6), parseInt($scope.EXENDTC_Interuption_display.substr(3,2))-1, $scope.EXENDTC_Interuption_display.substr(0,2));
        if (thisIsADate($scope.EXENDTC_Interuption) && (thisIsADate($scope.EXSTDTC_Interuption))) {
            $scope.interuptionDateValidated = true;
        }
    }

    $scope.disableDoseProperty = function() {
        if ($scope.dateValidated == false)
            return true;
        else
            return false;
    }

    $scope.disableInteruptionProperty = function() {
        if ($scope.interuptionDateValidated == false)
            return true;
        else
            return false;
    }

    $scope.disableTreatmentProperty = function() {
        if ($scope.getDisabledFields())
            return true;

        if ($scope.dateValidated == false)
            return true;

        if ($scope.EXCAT == "")
            return true;

        return false;
    }

    $scope.disableDatabaseTreatmentDoseOptions = function() {
        return (($scope.dateValidated==false)||(extrtRecorded == false));
    }

    $scope.getDisabledFields = function() {
        return (viewService.getView().DisableInputFields);
    }

    $scope.USUBJID = '';
    $scope.dateValidated = false;
    $scope.interuptionDateValidated = false;

    $rootScope.setExposureUSUBJID = function(USUBJID) {
        $scope.USUBJID = USUBJID;
    }

    $rootScope.setNewExposureFields = function () {
        exposures.clearExposure();
        $scope.dateValidated = false;
        clearFields();
    }

    var clearFields = function () {
        $scope.EXSTDTC = "";
        $scope.EXSTDTC_displayDate = "";

        $scope.EXADJ_Discontinuation = "";
        $scope.EXENDTC = "";
        $scope.EXENDTC_displayDate = "";

        $scope.EXDOSE = "";
        $scope.EXTRT = "";
        $scope.EXDOSU = "";
        $scope.EXDOSFRM = "";
        $scope.EXDOSFRQ = "";
        $scope.EXCAT = "";

        //clearOtherFields();
        extrtRecorded = false;

        $scope.EXSTDTC_Interuption_display='';
        $scope.EXENDTC_Interuption_display='';
        $scope.EXADJ_Interuption='';
    }


    $rootScope.displayExposure = function() {
        clearFields();

        var exposureForDisplay = exposures.getCurrentExposure();
        var sortedExposures = exposures.getExposuresAscending(exposureForDisplay.EXTRT);

        $scope.dateValidated = true;
        $scope.EXSTDTC = sortedExposures[0].EXSTDTC;
        $scope.EXSTDTC_displayDate = $scope.EXSTDTC.getDate()+"/"+(parseInt($scope.EXSTDTC.getMonth()+1))+"/"+$scope.EXSTDTC.getFullYear();// set date

        $scope.EXTRT = sortedExposures[0].EXTRT;
        $scope.EXDOSE = sortedExposures[0].EXDOSE;
        $scope.EXDOSU = sortedExposures[0].EXDOSU;
        $scope.EXDOSFRM = sortedExposures[0].EXDOSFRM;
        $scope.EXDOSFRQ = sortedExposures[0].EXDOSFRQ;
        $scope.EXCAT = sortedExposures[0].EXCAT;


        $scope.EXENDTC = sortedExposures[sortedExposures.length-1].EXENDTC;
        if (($scope.EXENDTC!= null)&&($scope.EXENDTC!= ''))
            $scope.EXENDTC_displayDate = $scope.EXENDTC.getDate()+"/"+(parseInt($scope.EXENDTC.getMonth()+1))+"/"+$scope.EXENDTC.getFullYear();// set date
        else
            $scope.EXENDTC_displayDate = '';
        $scope.EXADJ_Discontinuation = sortedExposures[sortedExposures.length-1].EXADJ;
    }

    $scope.addDoseProperty = function (propertyName) {

        var exposuresToTrt = exposures.getExposureByDate($scope.EXTRT, $scope.EXSTDTC);

        if (exposuresToTrt != null) {
            switch (propertyName) {
                case 'EXDOSU': {
                    exposuresToTrt.EXDOSU = $scope.EXDOSU;
                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSU);
                    break;
                }
                case 'EXDOSE': {
                    exposuresToTrt.EXDOSE = $scope.EXDOSE;
                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSE);
                    break;
                }
                case 'EXDOSFRM': {
                    exposuresToTrt.EXDOSFRM = $scope.EXDOSFRM;
                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSFRM);

                    break;
                }
                case 'EXDOSFRQ': {
                    exposuresToTrt.EXDOSFRQ = $scope.EXDOSFRQ;
                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSFRQ);
                    break;
                }
                case 'EXCAT': {
                    exposuresToTrt.EXCAT = $scope.EXCAT;
                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXCAT);
                    break;
                }
            }
            console.log(exposuresToTrt);
        }
        else {
            if (propertyName=="EXCAT") {
                $scope.data = {drugs: DrugFactory};
                $scope.drugsFactory = DrugFactory.names($scope.EXCAT);
            }
        }
    }

    $scope.addExposure = function () {
        if ($scope.EXTRT != '') {
            var currentExposure = exposures.getCurrentExposure();
            if (currentExposure != null) { // currently a treatment already
                if (currentExposure.EXTRT != $scope.EXTRT) {    // new name different from current treatment
                    console.log(currentExposure);
                    exposures.deleteExposure(currentExposure); // delete previous treatment
                    $scope.EXDOSE = "";
                    $scope.EXDOSU = "";
                    $scope.EXDOSFRM = "";
                    $scope.EXDOSFRQ = "";
                    //$scope.EXCAT = DrugFactory.category($scope.EXTRT);

                    var newExposure = new Exposure ($scope.USUBJID, $scope.EXTRT);
                    newExposure.EXSTDTC = $scope.EXSTDTC;
                    newExposure.displayDate = newExposure.EXSTDTC.toDateString();
                    newExposure.displayLabel = newExposure.EXTRT;
                    newExposure.EXCAT = $scope.EXCAT;
                    exposures.addExposure(newExposure);
                    exposures.setCurrentExposure(newExposure);
                    extrtRecorded = true;
                }
            }
            else {
                var newExposure = new Exposure ($scope.USUBJID, $scope.EXTRT);
                newExposure.EXSTDTC = $scope.EXSTDTC;
                newExposure.displayDate = newExposure.EXSTDTC.toDateString();
                newExposure.displayLabel = newExposure.EXTRT;

                if (DrugFactory.isKnown($scope.EXTRT)) {
                    var EXCAT = DrugFactory.category($scope.EXTRT);
                    newExposure.EXCAT = EXCAT;
                    $scope.EXCAT = EXCAT;
                }
                else
                    newExposure.EXCAT = $scope.EXCAT;

                exposures.addExposure(newExposure);
                exposures.setCurrentExposure(newExposure);
                extrtRecorded = true;
            }
        }
        else {
            var currentExposure = exposures.getCurrentExposure();
            console.log(currentExposure);
            if ((exposures.getCurrentExposure() != null)) { // changing treatment name
                exposures.deleteExposure(exposures.getCurrentExposure()); // delete previous treatment
                $scope.EXDOSE = "";
                $scope.EXDOSU = "";
                $scope.EXDOSFRM = "";
                $scope.EXDOSFRQ = "";
                $scope.EXCAT = "";
                extrtRecorded = false;
            }
        }
    }


//    $scope.addOtherExposure = function () {
//        if ((exposures.getCurrentExposure() != null) &&
//            (exposures.getCurrentExposure().EXTRT != $scope.Other_EXTRT)) {
//            if ($scope.Other_EXTRT!=''){ // if EXTRT is not empty
//                console.log("editing");
//                exposures.getCurrentExposure().EXTRT = $scope.Other_EXTRT;
//                exposures.getCurrentExposure().displayLabel = $scope.Other_EXTRT;
//                exposures.editExposure(exposures.getCurrentExposure(), 'EXTRT', $scope.Other_EXTRT);
//                console.log(exposures.getCurrentExposure());
//            }
//            else {
//                exposures.deleteExposure(exposures.getCurrentExposure()); // delete previous treatment
//                $scope.EXDOSE = "";
//                $scope.EXDOSU = "";
//                $scope.EXDOSFRM = "";
//                $scope.EXDOSFRQ = "";
//            }
//        }
//        else {
//            console.log("adding");
//            var newExposure = new Exposure ($scope.USUBJID, $scope.Other_EXTRT);
//            newExposure.EXSTDTC = $scope.EXSTDTC;
//            newExposure.displayDate = newExposure.EXSTDTC.toDateString();
//            newExposure.displayLabel = newExposure.EXTRT;
//            newExposure.EXCAT = $scope.EXCAT;
//            exposures.addExposure(newExposure);
//            exposures.setCurrentExposure(newExposure);
//            console.log(exposures.getCurrentExposure());
//        }
//        //console.log(exposures.getExposures());
//    }

//    $scope.addOtherDoseProperty = function(propertyName) {
//
//            var exposuresToTrt = exposures.getExposureByDate($scope.Other_EXTRT, $scope.EXSTDTC);
//
//            switch (propertyName) {
//                case 'EXDOSU': {
//                    exposuresToTrt.EXDOSU = $scope.Other_EXDOSU;
//                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSU);
//                    break;
//                }
//                case 'EXDOSE': {
//                    exposuresToTrt.EXDOSE = $scope.Other_EXDOSE;
//                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSE);
//                    break;
//                }
//                case 'EXDOSFRM': {
//                    exposuresToTrt.EXDOSFRM = $scope.Other_EXDOSFRM;
//                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSFRM);
//
//                    break;
//                }
//                case 'EXDOSFRQ': {
//                    exposuresToTrt.EXDOSFRQ = $scope.Other_EXDOSFRQ;
//                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSFRQ);
//                    break;
//                }
//                case 'EXDOSFRQ': {
//                    exposuresToTrt.EXDOSFRQ = $scope.Other_EXDOSFRQ;
//                    exposures.editExposure(exposuresToTrt, propertyName, $scope.EXDOSFRQ);
//                    break;
//                }
//            }
//        //}
//        console.log(exposuresToTrt);
//    }

    $scope.addEXADJ_Discontinuation = function() {
        if ($scope.EXENDTC_displayDate == null) {
            alert("Date null");
            $scope.EXADJ_Discontinuation = '';
        } else {
            var sortedExposures = exposures.getExposuresAscending(exposures.getCurrentExposure().EXTRT);

            sortedExposures[sortedExposures.length-1].EXENDTC = $scope.EXENDTC;
            exposures.editExposure(sortedExposures[sortedExposures.length-1], "EXENDTC", $scope.EXENDTC);

            sortedExposures[sortedExposures.length-1].EXADJ = $scope.EXADJ_Discontinuation;
            exposures.editExposure(sortedExposures[sortedExposures.length-1], "EXADJ", $scope.EXADJ_Discontinuation);

            console.log(sortedExposures);
        }
    }

    $scope.getInteruptions = function() {
        var currentExposure = exposures.getCurrentExposure();
        if (currentExposure != null)
        {
            //console.log("Finding interuptions for: "+ currentExposure.EXTRT);
            var foo = exposures.getInteruptionDatesForDrug(currentExposure.EXTRT);

            for (var f = 0; f < foo.length; f++)
            {
                var endOfFirst_display = foo[f].endOfFirst.EXENDTC.getDate()+"/"+(parseInt(foo[f].endOfFirst.EXENDTC.getMonth()+1))+"/"+foo[f].endOfFirst.EXENDTC.getFullYear();// set date
                foo[f].endOfFirst.EXENDTC_display = endOfFirst_display;

                var startOfSecond_display = foo[f].startOfSecond.EXSTDTC.getDate()+"/"+(parseInt(foo[f].startOfSecond.EXSTDTC.getMonth()+1))+"/"+foo[f].startOfSecond.EXSTDTC.getFullYear();// set date
                foo[f].startOfSecond.EXSTDTC_display = startOfSecond_display;
            }

            //console.log(foo);
            return foo;
        }
        else {
            return [];
        }
    }

    $scope.addInteruption = function() {
        if (($scope.EXSTDTC_Interuption_display =='')||($scope.EXENDTC_Interuption_display == '')) {
            alert ("Date null?");
            $scope.EXADJ_Interuption = '';
            return;
        }
        else {
            $scope.EXTRT = exposures.getCurrentExposure().EXTRT;
            var sortedExposures = exposures.getExposuresAscending(exposures.getCurrentExposure().EXTRT);
            sortedExposures[sortedExposures.length-1].EXENDTC = $scope.EXENDTC_Interuption;
            sortedExposures[sortedExposures.length-1].EXADJ = $scope.EXADJ_Interuption;
            exposures.editExposure(sortedExposures[sortedExposures.length-1], 'EXENDTC', $scope.EXENDTC_Interuption);
            exposures.editExposure(sortedExposures[sortedExposures.length-1], 'EXADJ', $scope.EXADJ_Interuption);
            console.log(sortedExposures[sortedExposures.length-1]);

            var newExposure = new Exposure ($scope.USUBJID, exposures.getCurrentExposure().EXTRT);
            newExposure.EXSTDTC = new Date($scope.EXSTDTC_Interuption);
            newExposure.EXCAT =  $scope.EXCAT;
            newExposure.displayDate = newExposure.EXSTDTC.toDateString();
            newExposure.displayLabel = newExposure.EXTRT;
            exposures.addExposure(newExposure);


            $scope.EXENDTC_Interuption_display = '';
            $scope.EXSTDTC_Interuption_display = '';
            $scope.EXADJ_Interuption = '';

            var interuptionsForEXTRT = exposures.getInteruptionsForDrug($scope.EXTRT);
            if (interuptionsForEXTRT == null) {
                var interuption = {drug:$scope.EXTRT,
                                    dates:[{   endOfFirst: sortedExposures[sortedExposures.length-1],
                                            startOfSecond: newExposure}]};
                exposures.addInteruption(interuption);
            }
            else {
                exposures.addInteruptionDate($scope.EXTRT, sortedExposures[sortedExposures.length-1], newExposure);
            }
        }
    }

    //$scope.EXCAT = "Disease Modifying";
    $scope.data = {drugs: DrugFactory};
    $scope.drugsFactory = DrugFactory.names($scope.EXCAT);

})

interventionModule.directive('exposureEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: 'scripts/js/exposure/exposure.html'
    };
})