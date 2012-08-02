var definitions = {

    // -------- Question preconditions --------

    seniorsAge: "$age >= 64.75",
    livingAlonePartnerInCare: "!$liveTogether && ($partnerLives == 'Rest home' || $partnerLives == 'Private hospital' || $partnerLives == 'Other')",
    relationshipSituation: "$relationshipStatusSingle == 'Separated from Civil Union Partner' || $relationshipStatusSingle == 'Separated from Defacto Partner' || $relationshipStatusSingle == 'Separated from Spouse' || $relationshipStatusSingle == 'Divorced' || $relationshipStatusSingle == 'Civil Union Dissolved' || $relationshipStatusSingle == 'Single' || $relationshipStatusPartner == 'Defacto - Partner in prison' || $relationshipStatusPartner == 'Civil Union - Partner in prison' || $relationshipStatusPartner == 'Married - Partner in prison'",
    under20: "$age < 20",
    age16to17: "$age >= 16 && $age < 18",
    age18to19: "$age >= 18 && $age < 20",
    age20to24: "$age >= 20 && $age < 25",
    age25Plus:"$age >= 25",
    youth: "$age >= 16 && ($age < 18 || ($age < 19 && $dependentChildren > 0))",
    parent: "$dependentChildren > 0",
    youngParent: "$age16to17 && $parent",
    oscarAgedChild: "$childAged513",
    partnerResident:"$partnerNZ && ($partnerResidency == 'NZ Citizen (by birth)' || $partnerResidency == 'NZ Citizen (Other)' || $partnerResidency == 'Permanent Resident' || $partnerResidency == 'Refugee - Quota' || $partnerResidency == 'Australian')",
    
    

    // -------- Shortcuts for questions --------

    seniorOk: "$seniorsAge && $tenYears && $fiveYears",
    residencyResident: "$residency == 'NZ Citizen (by birth)' || $residency == 'NZ Citizen (Other)' || $residency == 'Permanent Resident' || $residency == 'Refugee - Quota' || $residency == 'Australian' || $residencyRefugeePermanent",
    residencyRefugeePermanent: "$residency == 'Refugee - Other with Permanent Residence'",

    deceasedPartner: "$relationshipStatusSingle=='Widowed' || $relationshipStatusSingle =='Defacto Partner Deceased' || $relationshipStatusSingle=='Civil Union Partner Deceased'",

    // -------- Benefit definitions --------

    resident: "$stayingInNz && $twoYears && $residencyResident",
    refugeeOtherWithPermanentResidence: "$stayingInNz && $twoYears && $residencyRefugeePermanent",
    workingAge: "($age == 18 && $dependentChildren == 0) || ($age >= 19 && $age < 65)",
    age50to64: "($age >= 50 && $age <= 64)",
    single: "!$partner", // spreadsheet also lists all values of relationshipStatusSingle; not sure why

    youthLivingCircs : "!$livingAtHome && !$parentSupport && " +
    		"(" +
    		"	$reasonNotLivingAtHome == 'relationshipBreakdown' || " +
    		"	$reasonNotLivingAtHome == 'absent' || " +
    		"	$reasonNotLivingAtHome == 'other' || " +
    		"	$reasonNotLivingAtHome == 'noLongerCyf' " +
    		")",
    

	single18to19uBSBAtHomeIncomeLimit:"$single && $age18to19 && $livingAtHome && ($familyTotalGrossWeeklyIncome<$ubSingle1819AtHomeGWILimit)",
		
	single18to19uBSBAwayFromHomeIncomeLimit:"$single && $age18to19 && !$livingAtHome && ($familyTotalGrossWeeklyIncome<$ubSingle1819AwayGWILimit)",

	single20to24uBSBIncomeLimit:"$single && $age20to24 && ($familyTotalGrossWeeklyIncome<$ubSingle2024GWILimit)",
	
	single25uBSBIncomeLimit:"$single && $age25Plus && ($familyTotalGrossWeeklyIncome<$ubSingle25GWILimit)",

    		
    		
    // -- Limits -- //
    
    widowsSoleParentGWILimit : 570,
    dpbCsiSoleParentGWILimit : 570,
    ibSingle18GWILimit : 300,
    ibSoleParentGWILimit : 300,
    ibRelationshipGWILimit : 300,
    yppSingleGWILimit : 300,
    yppRelationshipGWILimit:300,
    ubSingle1819AtHomeGWILimit:272,
    ubSingle1819AwayGWILimit:320,
    ubSingle2024GWILimit:320,
    ubSingle25GWILimit:368,
    nonQualifiedPartnerIncludedLimit:860,
    
    daGWILimits: {
        "$workingAge && !$partner && $dependentChildren == 0": 575.48,
        "$workingAge && !$partner && $dependentChildren == 1": 693.45,
        "$workingAge && !$partner && $dependentChildren > 1": 730.60,
        "$workingAge && $partner": 851.83,
        "$youth && !$partner && $dependentChildren == 0": 497.27,
        "$youth && $partner && $dependentChildren == 0": 851.83,
        "$youngParent && !$partner": 497.27,
        "$youngParent && $partner && $partnerAge >= 18": 851.83, // TODO what about young parents with partners under 18?
        "$seniorsAge && !$partner && $dependentChildren == 0": 575.58,
        "$seniorsAge && !$partner && $dependentChildren == 1": 693.45,
        "$seniorsAge && !$partner && $dependentChildren > 1": 730.60,
        "$seniorsAge && $partner": 851.83
    },
    daGWILimit: "engine.evalMap(definitions.daGWILimits, 'daGWILimits')",
    
    
    // -- Rates -- //
    
    dpbSoleParentAmount : 400, //TODO NOT THE RIGHT AMOUNT!
    
    // Accommodation supplement maximums - each has a rate for each area
    accSuppSingle: [145, 100, 65, 45],
    accSuppCouple: [160, 125, 75, 55],
    accSuppCoupleWithChildren: [225, 165, 120, 75],
    accSuppSoleParent1Child: [160, 125, 75, 55],
    accSuppSoleParent2OrMoreChildren: [225, 165, 120, 75],
    accSuppMax: "calculator.calculateAccSuppMax()",
    
    ratesUB : { 
    	"$age<20 && $age>=18 && $livingAtHome": 136.64, 
    	"$age<20 && $age>=18 && !$livingAtHome": 170.80,
    	"$age<25 && $age>19 && $single": 170.80,
    	"$partner && $dependentChildren == 0": 170.80,
    	"$partner && $dependentChildren > 0": 170.80,
    	"!$partner && $dependentChildren > 0": 293.58,
    	"$age>=25": 204.96
    	
    },
    	
    ubRate: "engine.evalMap(definitions.ratesUB, 'ratesUB')",
    

    // -------- Calculations --------
    totalFamilyGrossWeeklyWage: "$applicantGrossWeeklyWage + $partnerGrossWeeklyWage",
    totalOtherIncomeCalculation: "calculator.calculateTotalOtherIncome()",
    familyTotalGrossWeeklyIncome: "$totalFamilyGrossWeeklyWage + $totalOtherIncomeCalculation",


    // -------- Main benefit eligibility --------

    potentialWidowsBenefit: "(($resident || $refugeeOtherWithPermanentResidence) && " +
    		"$gender == 'Female' && $deceasedPartner) && " +
    		"(	" +
    		"	($workingAge && " +
    		"	($familyTotalGrossWeeklyIncome < $windowsSoleParentGWILimit) " +
    		"		|| " +
    		"	($age50to64 && $dependentChildren == 0 && ($familyTotalGrossWeeklyIncome < $windowsSoleParentGWILimit)))" +
    		")",
    
    potentialDPBSoleParent: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$workingAge && " +
    		"	$single && " +
    		"	$dependentChildren >= 1 && " +
    		"	$familyTotalGrossWeeklyIncome < $dpbCsiSoleParentGWILimit && " +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialWidowsBenefit",
    		
    potentialInvalidsBenefit: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	($totallyBlind)",  //TODO blindRelationship && blindSoleparent ..??
    		
    potentialDPBCareOrSickOrInfirm: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	($caringFullTime && $carerRelationship != 'Partner')  && " +
    		"	$workingAge && " +
    		"	$single && " +
    		"	$dependentChildren <= 1 && " +
    		"	($familyTotalGrossWeeklyIncome < $dpbCsiSoleParentGWILimit)",    
    		
    potentialDPBWomanAlone: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$gender == 'Female' && " +
    		"	$age50to64 && " +
    		"   $dependentChildren == 0 && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialDPBSoleParent && " +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialWidowsBenefit && " +
    		"	(" +
    		"		$noSpouseSupport " +
    		"	|| " +
    		"		$stoppedCaring " +
    		"	|| " +
    		"		$lastChildNoLongerDependent " +
    		" 	" +
    		"	) " 
    		,
    		
    potentialHealthRelatedBenefit: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$healthDisabilityAffectsWork && " +
    		"	( " +
    		"		!$haveWorked " +
    		"			|| " +
    		"		($haveWorked && !$stillWorking) " +
    		"			|| " +
    		"		($stillWorking && $weeklyHours <30 )" +
    		"	) && " +
    		"	(" +
    		"		(" +
	    	"			$single && " +
	    	"			$dependentChildren == 0 &&" +
	    	"			$familyTotalGrossWeeklyIncome < $ibSingle18GWILimit" +
	    	"	" +
	    	"		) || " +
	    	"		(" +
	    	"			$single && " +
	    	"			$dependentChildren >= 1 && " +
	    	"			$familyTotalGrossWeeklyIncome < $ibSoleParentGWILimit " +
	    	"		) || " +
	    	"		!$single && $familyTotalGrossWeeklyIncome < $ibRelationshipGWILimit" +
	    	"	) &&" +
	    	"	!$potentialInvalidsBenefit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialWidowsBenefit && " +
    		"	!$potentialDPBSoleParent && " +
    		"	!$potentialDPBWomanAlone" ,
    
    
    potentialYouthPayment:
    		"	$resident && " +
    		"	$youth  &&" +// +
    		"	(	" +
    		"		(" +
    		"			$single  && $youthLivingCircs &&" + //&& $
    		"			($familyTotalGrossWeeklyIncome < $yppSingleGWILimit) " +
    		"		) " +
    		"		||	" +
    		"		(" +
    		"			!$single && ($partnerAge<=17 && $partnerAge>=16) &&" +
    		"			($familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit)" +
    		"		)	" +
    		"	) && " +
    		"	$dependentChildren == 0 && !$potentialInvalidsBenefit ", //
    
    
    potentialYoungParentPayment:
    	"	$resident && $youngParent && !$potentialInvalidsBenefit && " +
    	"		(" +
    	"			$single && $youthLivingCircs && " +
    	"			($familyTotalGrossWeeklyIncome < $yppSingleGWILimit)" +
    	"		) " +
    	"			|| " +
		"		(" +
		"			!$single && ($partnerAge<=17 && $partnerAge>=16) &&" +
		"			($familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit)" +
		"		)	" ,
    	
    	
    potentialUnemploymentBenefitTraining:"($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$workingAge && " +
    		"	$topCourse && " +
    		" ( " +
    		"		!$haveWorked " +
    		"			|| " +
    		"		($haveWorked && !$stillWorking) " +
    		"			|| " +
    		"		($stillWorking && $weeklyHours <30 )" +
    		" ) && " +
    		//"	($single18to19uBSBAtHomeIncomeLimit ||  ) &&" +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialWidowsBenefit && " +
    		"	!$potentialDPBSoleParent && " +
    		"	!$potentialDPBWomanAlone &&" +
    		"	!$potentialHealthRelatedBenefit",
    
    
    potentialUnemploymentBenefit:"($resident || $refugeeOtherWithPermanentResidence) && " +
			"	$workingAge && " +
			" ( " +
			"		!$haveWorked " +
			"			|| " +
			"		($haveWorked && !$stillWorking) " +
			"			|| " +
			"		($stillWorking && $weeklyHours <30 )" +
			" ) && " +
			//"	($single18to19uBSBAtHomeIncomeLimit ||  ) &&" +
			"	!$potentialInvalidsBenefit && " +
			"	!$potentialDPBCareOrSickOrInfirm && " +
			"	!$potentialWidowsBenefit && " +
			"	!$potentialDPBSoleParent && " +
			"	!$potentialDPBWomanAlone &&" +
			"	!$potentialUnemploymentBenefitTraining &&" +
			"	!$potentialHealthRelatedBenefit",
	
	
    potentialNewZealandSuperannuationSingle:"$seniorsAge && $resident && $single ", //ACC stuff not required
    
    
    potentialNewZealandSuperannuationNonQualifiedSpouse:"$seniorsAge && $resident && !$single && " +
    		"			$includePartnerInNZS && !$partnerReceivingNZS && " +
    		"			$familyTotalGrossWeeklyIncome < $nonQualifiedPartnerIncludedLimit && " +
    		"			$partnerAge >= 16 && $partnerResident",
    		
    		
    potentialNewZealandSupperannuationPartnerNotIncluded:"$seniorsAge && $resident && !$single && " +
    "			((!$includePartnerInNZS || $partnerReceivingNZS) || " + //i don't think this is right.
	"			($includePartnerInNZS  && !$partnerReceivingNZS)) && " +
    		"	!$potentialNewZealandSuperannuationNonQualifiedSpouse " , 
    
    // TODO what are these?
    undeterminedYouthPayment: false,
    undeterminedYoungParentPayment: false,
    
    potentialBenefit: "$potentialInvalidsBenefit || $potentialDPBCareOrSickOrInfirm || $potentialWidowsBenefit || $potentialDPBSoleParent || $potentialDPBWomanAlone || $potentialHealthRelatedBenefit || $potentialUnemploymentBenefitTraining || $potentialUnemploymentBenefit || $potentialExtraHelp",
    potentialYouthPackage: "$potentialYouthPayment || $potentialYoungParentPayment || $undeterminedYouthPayment || $undeterminedYoungParentPayment",
    potentialSuper: "$potentialNewZealandSuperannuationSingle || $potentialNewZealandSuperannuationNonQualifiedSpouse || $potentialNewZealandSupperannuationPartnerNotIncluded",
    
    // -------- Supplements (e.g., not main benefits) ------- //
    
    // Note we're deliberately not testing income and asset thresholds here. The rules are very complicated.
    potentialAccommodationSupplement:
        "   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) &&" +
        "   !($accomodationType == 'Rent' && $housingNz)", // a simpler equivalent of the spreadsheet condition
    
    potentialDisabilityAllowance:
        "   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) &&" +
        "   $disabilityCosts &&" +
        "   $familyTotalGrossWeeklyIncome < $daGWILimit",
    
    potentialChildcareSubsidy:false,
    potentialGuaranteedChildcareAssistancePayment:false,
    potentialOSCARSubsidy:false,
    potentialTemporaryAdditionalSupport:false,
    potentialChildDisabilityAllowance:false,
    
    potentialLivingAlonePayment:false,
    
    potentialExtraHelp:false,
    

    // -------- Pre-Benefit Activities--------
    createCV: "$potentialDPBSoleParent || $potentialUnemploymentBenefit",
    attendPAM: "$potentialUnemploymentBenefit",


    // -------- Obligations --------

    testObligation: "$potentialDPBSoleParent",


    // -------- Other --------

    age: "calculator.calculateAge($dateOfBirth)"
};


var allBenefits = [ /* This is all the variables that we want to be checked as potential benefits */
                    	"potentialDPBSoleParent", 
                    	"potentialInvalidsBenefit", 
                    	"potentialDPBCareOrSickOrInfirm", 
                    	"potentialWidowsBenefit" , 
                    	"potentialDPBWomanAlone",
                    	"potentialHealthRelatedBenefit",
                    	"potentialYouthPayment",
                    	"potentialYoungParentPayment",
                    	"potentialUnemploymentBenefitTraining",
                    	"potentialUnemploymentBenefit",
                    	"potentialNewZealandSuperannuationSingle",
                    	"potentialNewZealandSuperannuationNonQualifiedSpouse",
                    	"potentialNewZealandSupperannuationPartnerNotIncluded",
    
                        "potentialAccommodationSupplement",
                        "potentialDisabilityAllowance",
                        "potentialChildcareSubsidy",
                        "potentialGuaranteedChildcareAssistancePayment",
                        "potentialOSCARSubsidy",
                        "potentialTemporaryAdditionalSupport",
                        "potentialChildDisabilityAllowance",
                        "potentialLivingAlonePayment",
                        "potentialExtraHelp"
                   ];
var allObligations = [  ];

var allPBAs = [ "createCV", "attendPAM" ];
