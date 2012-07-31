var definitions = {

    // -------- Question preconditions --------

    seniorsAge: "$age >= 64.75",
    livingAlonePartnerInCare: "!$liveTogether && ($partnerLives == 'Rest home' || $partnerLives == 'Private hospital' || $partnerLives == 'Other')",
    relationshipSituation: "$relationshipStatusSingle == 'Separated from Civil Union Partner' || $relationshipStatusSingle == 'Separated from Defacto Partner' || $relationshipStatusSingle == 'Separated from Spouse' || $relationshipStatusSingle == 'Divorced' || $relationshipStatusSingle == 'Civil Union Dissolved' || $relationshipStatusSingle == 'Single' || $relationshipStatusPartner == 'Defacto - Partner in prison' || $relationshipStatusPartner == 'Civil Union - Partner in prison' || $relationshipStatusPartner == 'Married - Partner in prison'",
    under20: "$age < 20",
    youth: "$age >= 16 && ($age < 18 || ($age < 19 && $dependentChildren > 0))",
    oscarAgedChild: "$childAged513",

    // -------- Shortcuts for questions --------

    seniorOk: "$seniorsAge && $tenYears && $fiveYears",
    residencyResident: "$residency == 'NZ Citizen (by birth)' || $residency == 'NZ Citizen (Other)' || $residency == 'Permanent Resident' || $residency == 'Refugee - Quota' || $residency == 'Australian' || $residencyRefugeePermanent",
    residencyRefugeePermanent: "$residency == 'Refugee - Other with Permanent Residence'",


    // -------- Benefit definitions --------

    resident: "$stayingInNz && $twoYears && $residencyResident",
    refugeeOtherWithPermanentResidence: "$stayingInNz && $twoYears && $residencyRefugeePermanent",
    workingAge: "($age == 18 && $dependentChildren == 0) || ($age >= 19 && $age < 65)",
    single: "!$partner", // spreadsheet also lists all values of relationshipStatusSingle; not sure why


    // -------- Calculations --------
    totalFamilyGrossWeeklyWage: "$applicantGrossWeeklyWage + $partnerGrossWeeklyWage",
    totalOtherIncomeCalculation: "calculator.calculateTotalOtherIncome()",
    familyTotalGrossWeeklyIncome: "$totalFamilyGrossWeeklyWage + $totalOtherIncomeCalculation",


    // -------- Main benefit eligibility --------


    // -------- Main benefit eligibility --------

    potentialWidowsBenefit: false,
    potentialDPBSoleParent: "($resident || $refugeeOtherWithPermanentResidence) && $workingAge && $single && $dependentChildren >= 1 && $familyTotalGrossWeeklyIncome < 570 && !$potentialInvalidsBenefit && !$potentialDPBCareOrSickOrInfirm && !$potentialWidowsBenefit",
    potentialInvalidsBenefit: "($resident || $refugeeOtherWithPermanentResidence) && ($totallyBlind)",  //TODO blindRelationship && blindSoleparent ..??
    potentialDPBCareOrSickOrInfirm: "($resident || $refugeeOtherWithPermanentResidence) && ($caringFullTime && $carerRelationship != 'Partner')  && $workingAge && $single && $dependentChildren <= 1 && ($familyTotalGrossWeeklyIncome < 570)",    // TODO
        // TODO
    potentialDPBWomanAlone: false,
    potentialHealthRelatedBenefit:false,
    potentialYouthPayment:false,
    potentialYoungParentPayment:false,
    potentialUnemploymentBenefitTraining:false,
    potentialUnemploymentBenefit:false,
    potentialNewZealandSuperannuationSingle:false,
    potentialNewZealandSuperannuationNonQualifiedSpouse:false,
    potentialNewZealandSupperannuationPartnerNotIncluded:false,
    
    // -------- Supplements (e.g., not main benefits) ------- //
    
    potentialAccomodationSupplement:false,
    potentialDisabilityAllowance:false,
    potentialChildcareSubsidy:false,
    potentialGuaranteedChildcareAssistancePayment:false,
    potentialOSCARSubsidy:false,
    potentialTemporaryAdditionalSupport:false,
    potentialChildDisabilityAllowance:false,
    
    potentialLivingAlonePayment:false,
    
    potentialOtherAssistance:true,
    

    // -------- Main benefit amounts --------

    // benefit rates are complex.  How accurate do we need to be??
    
    dpbSoleParentAmount: 543.21,


    // -------- Obligations --------

    testObligation: "$potentialDPBSoleParent",


    // -------- Other --------

    age: "calculator.calculateAge($dateOfBirth)"
};

var allBenefits = [ "potentialDPBSoleParent", "potentialInvalidsBenefit", "potentialDPBCareOrSickOrInfirm", "potentialWidowsBenefit"];
var allObligations = [ "testObligation" ];