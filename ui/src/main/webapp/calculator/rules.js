var definitions = {

    // -------- Question preconditions --------

    seniorsAge: "$age >= 64.75",
    livingAlonePartnerInCare: "!$liveTogether && ($partnerLives == 'Rest home' || $partnerLives == 'Private hospital' || $partnerLives == 'Other')",
    relationshipSituation: "$relationshipStatusSingle == 'Separated from Civil Union Partner' || $relationshipStatusSingle == 'Separated from Defacto Partner' || $relationshipStatusSingle == 'Separated from Spouse' || $relationshipStatusSingle == 'Divorced' || $relationshipStatusSingle == 'Civil Union Dissolved' || $relationshipStatusSingle == 'Single' || $relationshipStatusPartner == 'Defacto - Partner in prison' || $relationshipStatusPartner == 'Civil Union - Partner in prison' || $relationshipStatusPartner == 'Married - Partner in prison'",
    relationshipSituationPartner: "$relationshipStatusPartner == 'Living Defacto' || $relationshipStatusPartner == 'Civil Union' || $relationshipStatusPartner == 'Married'",
    under20: "$age < 20",
    age16to17: "$age >= 16 && $age < 18",
    age16to18: "$age >= 16 && $age <= 18",
    age18to19: "$age >= 18 && $age < 20",
    age20to24: "$age >= 20 && $age < 25",
    age25Plus:"$age >= 25",
    youth: "$age >= 16 && ($age < 18 || ($age < 19 && $dependentChildren > 0))",
    ibYouth: "$age16to17",
    parent: "$dependentChildren > 0",
    youngParent: "$age16to17 && $parent",
    oscarAgedChild: "$childAged513",
    partnerResident:"$partnerNZ && ($partnerResidency == 'NZ Citizen (by birth)' || $partnerResidency == 'NZ Citizen (Other)' || $partnerResidency == 'Permanent Resident' || $partnerResidency == 'Refugee - Quota' || $partnerResidency == 'Australian')",

    hasYoungest14Plus:"!$childAged04 && !$childAged5NotAtSchool && !$childAged513 && $childAged1418",
    hasYoungest5to13:"!$childAged04 && !$childAged5NotAtSchool && $childAged513",
    

    // -------- Shortcuts for questions --------

    seniorOk: "$seniorsAge && $tenYears && $fiveYears",
    residencyResident: "$residency == 'NZ Citizen (by birth)' || $residency == 'NZ Citizen (Other)' || $residency == 'Permanent Resident' || $residency == 'Refugee - Quota' || $residency == 'Australian' || $residencyRefugeePermanent",
    residencyRefugeePermanent: "$residency == 'Refugee - Other with Permanent Residence'",

    deceasedPartner: "$relationshipStatusSingle=='Widowed' || $relationshipStatusSingle =='Defacto Partner Deceased' || $relationshipStatusSingle=='Civil Union Partner Deceased'",

    // -------- Benefit definitions --------

    resident: "$stayingInNz && $twoYears && $residencyResident",
    refugeeOtherWithPermanentResidence: "$stayingInNz && $twoYears && $residencyRefugeePermanent",
    workingAge: "($age == 18 && $dependentChildren == 0) || ($age >= 19 && $age < 65)",
    ibWorkingAge : "($age >= 18 && $age <= 64)",
    age50to64: "($age >= 50 && $age <= 64)",
    partner16or17: "$partnerAge == 16 || $partnerAge == 17",
    partner16to18: "$partnerAge >= 16 && $partnerAge <= 18",
    single: "!$partner", // spreadsheet also lists all values of relationshipStatusSingle; not sure why

    youthLivingCircs : "!$livingAtHome && !$parentSupport && " +
    		"(" +
    		"	$reasonNotLivingAtHome == 'relationshipBreakdown' || " +
    		"	$reasonNotLivingAtHome == 'absent' || " +
    		"	$reasonNotLivingAtHome == 'other' || " +
    		"	$reasonNotLivingAtHome == 'noLongerCyf' " +
    		")",


	youthResidentLessThan2YearsResidence : "$youth && $stayingInNz && !$twoYears && $residencyResident",



	single18to19uBSBAtHomeIncomeLimit:"$single && $age18to19 && $livingAtHome && ($familyTotalGrossWeeklyIncome<$ubSingle1819AtHomeGWILimit)",

	single18to19uBSBAwayFromHomeIncomeLimit:"$single && $age18to19 && !$livingAtHome && ($familyTotalGrossWeeklyIncome<$ubSingle1819AwayGWILimit)",

	single20to24uBSBIncomeLimit:"$single && $age20to24 && ($familyTotalGrossWeeklyIncome<$ubSingle2024GWILimit)",

	single25uBSBIncomeLimit:"$single && $age25Plus && ($familyTotalGrossWeeklyIncome<$ubSingle25GWILimit)",

    singleLivingAlone: "$single && $liveAlone && !$visitorStaying",
    singleNotLivingAlone:
            "$single && !$liveAlone && !$visitorStaying && " +
            "(!$liveWithAdult || ($liveWithAdult && !$liveWithNonDependent))",
    relationshipLivingAlone:
            "$partner && $liveAlone && " +
            "($partnerLives == 'Rest home' || $partnerLives == 'Private hospital' || $partnerLives == 'Other') && " +
            "!$visitorStaying && " +
            "(!$liveWithAdult || ($liveWithAdult && !$liveWithNonDependent))",
    relationshipNotLivingAlone:
            "$partner && !$liveAlone && " +
            "($partnerLives == 'Rest home' || $partnerLives == 'Private hospital' || $partnerLives == 'Other') && " +
            "!$visitorStaying && " +
            "(!$liveWithAdult || ($liveWithAdult && !$liveWithNonDependent))",
    relationshipPartnerInPublicHospital: "$partner && $partnerLives == 'Public hospital'",


    blindSingle:"$single && $totallyBlind && $dependentChildren == 0 && " +
    		" (" +
    		"	($ibWorkingAge && $totalOtherIncomeCalculation < $ibSingle18GWILimit)" +
    		"	||" +
    		"	($ibYouth && $totalOtherIncomeCalculation < $ibSingleYouthGWILimit)" +
    		")",
    
    
    blindRelationship:"!$single && $totallyBlind && $totalOtherIncomeCalculation < $ibRelationshipGWILimit" +
	" (" +
	"	$ibWorkingAge || $ibYouth" +
	" )",
	
	
    blindSoleParent:"($ibWorkingAge || $ibYouth) && $totallyBlind && $single && $dependentChildren > 0 &&" +
    		"$totalOtherIncomeCalculation < $ibSoleParentGWILimit",
    
    
    // -- Limits -- //

    widowsSoleParentGWILimit : 577,//Widows Sole Parent GWI Limit
    dpbCsiSoleParentGWILimit : 577,//DPB Sole Parent GWI Limit

    ibSingle18GWILimit : 524,//IB Single 18+ GWI Limit
    ibSingleYouthGWILimit : 454,//IB Single Youth GWI Limit
    ibSoleParentGWILimit : 638,//IB Sole Parent GWI Limit
    ibRelationshipGWILimit : 768,//IB Relationship GWI Limit

    yppSingleGWILimit : 307,//YPP single GWI Limit
    yppRelationshipGWILimit:534,//YPP Relationship GWI Limit
    yppParentalIncomeGWILimit:1000,//YPP Parental Income GWI Limit

    ubSingle1819AtHomeGWILimit:276, //UB Single 18-19 at home GWI Limit
    ubSingle1819AwayGWILimit:324, //UB Single 18-19 away from home GWI Limit
    ubSingle2024GWILimit:324, //UB Single 20-24 GWI Limit
    ubSingle25GWILimit:373, //UB Single 25+ GWI Limit

    ccs1ChildLimit: 1400,//CCS 1 Child GWI Limit
    ccs2ChildrenLimit: 1600,//CCS 2 Children GWI Limit 
    ccs3ChildrenLimit: 1800,//CCS 3 or more Children GWI Limit

    OSCAR1ChildLimit:1400.00,//OSCAR 1 Child GWI Limit 
    OSCAR2ChildrenLimit:1600.00,//OSCAR 2 Children GWI Limit
    OSCAR3ChildrenLimit:1800.00,//OSCAR 3 or more Children GWI Limit

    TASSingleCashAssetLimit:1025.11, //TAS Single Cash Asset Limit
    TASRelationshipCashAssetLimit:1708.10,//TAS Relationship Cash Asset Limit
    TASSoleParent1ChildCashAssetLimit:1346.00,//TAS Sole Parent 1 Child Cash Asset Limit
    TASanyotherSoleParentCashAssetLimit:1445.89,//TAS any other Sole Parent Cash Asset Limit

    nonQualifiedPartnerIncludedLimit:918,//Non-qualified partner included

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

    // Accommodation supplement maximums - each has a rate for each area
    accSuppSingle: [145, 100, 65, 45], //UB SB YP Single Working Age 
    accSuppCouple: [160, 125, 75, 55], //UB SB YP relationship without children
    accSuppCoupleWithChildren: [225, 165, 120, 75], //UB SB YPP - relationship with children
    accSuppSoleParent1Child: [160, 125, 75, 55], //Sole Parent with one child
    accSuppSoleParent2OrMoreChildren: [225, 165, 120, 75], //Sole Parent with two or more children
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

    ratesIB : {
    	"$single && ($age==16 || $age==17)":207.32,
    	"$single && $age>=18":256.19,
    	"$partner && $dependentChildren == 0":213.49,
    	"$partner && $dependentChildren >= 0":213.49,
    	"$single && $dependentChildren > 0":336.55
    },

    ratesDPB : {
    	"($potentialWidowsBenefit || $potentialWidowsBenefitPBA || $potentialDPBWomanAlone) && $single && $dependentChildren == 0":213.49,
    	"($potentialWidowsBenefit || $potentialWidowsBenefitPBA) && $single && $dependentChildren >=1 ":293.58,
    	"$potentialDPBCareOrSickOrInfirm && $single && $age>=18 && $dependentChildren == 0 ":256.19,
    	"$potentialDPBCareOrSickOrInfirm && $single && $dependentChildren >=1  ":336.55,
    	"$potentialDPBSoleParent || $potentialDPBSoleParentPBAWithTeen || $potentialDPBSoleParentPBAWithYoungChild":336.55
    },

    ubRate: "engine.evalMap(definitions.ratesUB)",
    ibRate: "engine.evalMap(definitions.ratesIB)",
    dpbRate : "engine.evalMap(definitions.ratesDPB)",


    // -------- Calculations --------
    totalFamilyGrossWeeklyWage: "$applicantGrossWeeklyWage + $partnerGrossWeeklyWage",
    totalOtherIncomeCalculation: "calculator.calculateTotalOtherIncome()",
    familyTotalGrossWeeklyIncome: "$totalFamilyGrossWeeklyWage + $totalOtherIncomeCalculation",


    // -------- Main benefit eligibility --------

    potentialWidows: "(($resident || $refugeeOtherWithPermanentResidence) && " +
    		"$gender == 'Female' && $deceasedPartner) && " +
    		"(	" +
    		"	($workingAge && " +
    		"	($familyTotalGrossWeeklyIncome < $widowsSoleParentGWILimit) " +
    		"		|| " +
    		"	($age50to64 && $dependentChildren == 0 && ($familyTotalGrossWeeklyIncome < $widowsSoleParentGWILimit)))" +
    		")",
    		
    		
    //TODO here		
    potentialWidowsBenefitPBA: "$potentialWidows && ($dependentChildren == 0 || $hasYoungest14Plus)",		
    		
    potentialWidowsBenefit : "$potentialWidows && ($dependentChildren != 0 & ($childAged04 || $childAged5NotAtSchool))",		

    potentialDPBSoleParentCalc: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$workingAge && " +
    		"	$single && " +
    		"	$dependentChildren >= 1 && " +
    		"	$familyTotalGrossWeeklyIncome < $dpbCsiSoleParentGWILimit && " +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialWidowsBenefitPBA && " +
    		"	!$potentialWidowsBenefit",
    		
    		
    potentialDPBSoleParentPBAWithTeen:"$potentialDPBSoleParentCalc && ($dependentChildren != 0 && $hasYoungest14Plus)",		
    potentialDPBSoleParentPBAWithYoungChild:"$potentialDPBSoleParentCalc && ($dependentChildren != 0 && $hasYoungest5to13)",
    
    potentialDPBSoleParent:"$potentialDPBSoleParentCalc && ($dependentChildren != 0 & ($childAged04 || $childAged5NotAtSchool))",		
    
    

    potentialInvalidsBenefit: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	($totallyBlind) & ($blindSingle || $blindRelationship || $blindSoleParent) ",

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
    		"	!$potentialDPBSoleParentPBAWithTeen && " +
    		"	!$potentialDPBSoleParentPBAWithYoungChild && " +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialWidowsBenefit && " +
    		"	!$potentialWidowsBenefitPBA && " +
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
    		"	!$potentialWidowsBenefitPBA && " +
    		"	!$potentialDPBSoleParent && " +
    		"	!$potentialDPBSoleParentPBAWithTeen && " +
    		"	!$potentialDPBSoleParentPBAWithYoungChild && " +
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
    		"	$dependentChildren == 0 && !$potentialInvalidsBenefit ",


    potentialYoungParentPayment:
    	"	$resident && " +
    	"	$youngParent && " +
    	"	!$potentialInvalidsBenefit && " +
    	"		(" +
    	"			$single && " +
    	"			$youthLivingCircs && " +
    	"			($familyTotalGrossWeeklyIncome < $yppSingleGWILimit)" +
    	"		) " +
    	"			|| " +
		"		(" +
		"			!$single && " +
		"			($partnerAge==17 || $partnerAge==16) &&" +
		"			$familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit" +
		"		)	",


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
    		"	!$potentialWidowsBenefitPBA && " +
    		"	!$potentialDPBSoleParent && " +
    		"	!$potentialDPBSoleParentPBAWithTeen && " +
    		"	!$potentialDPBSoleParentPBAWithYoungChild && " +
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
			"	!$potentialWidowsBenefitPBA && " +
			"	!$potentialDPBSoleParent && " +
			"	!$potentialDPBSoleParentPBAWithTeen && " +
    		"	!$potentialDPBSoleParentPBAWithYoungChild && " +
			"	!$potentialDPBWomanAlone &&" +
			"	!$potentialUnemploymentBenefitTraining &&" +
			"	!$potentialHealthRelatedBenefit",


    potentialNewZealandSuperannuationSingle:"$seniorsAge && $resident && $single ", //ACC stuff not required


    potentialNewZealandSuperannuationNonQualifiedSpouse:"$seniorsAge && $resident && !$single && " +
    		"			$includePartnerInNZS && !$partnerReceivingNZS && " +
    		"			$familyTotalGrossWeeklyIncome < $nonQualifiedPartnerIncludedLimit && " +
    		"			$partnerAge >= 16 && $partnerResident",


    potentialNewZealandSupperannuationPartnerNotIncluded:"$seniorsAge && $resident && !$single && " +
    		"			((!$includePartnerInNZS || $partnerReceivingNZS) || " +
    		"			($includePartnerInNZS  && !$partnerReceivingNZS)) && " +
    		"			!$potentialNewZealandSuperannuationNonQualifiedSpouse " ,


   //potentialUndeterminedWorkingAgeFinancialAssistance:false,
   potentialUndeterminedWorkingAgeFinancialAssistance:
	   "	($workingAge || $seniorsAge ) && " +
	   "	!$potentialBenefit && " +
	   "	!$potentialWidowsBenefitPBA && " +
	   "	!$potentialWidowsBenefit && " +
	   "	!$potentialSuper",


//	  potentialUndeterminedYouthPayment:true,
    potentialUndeterminedYouthPayment:
    		"	!$potentialInvalidsBenefit && " +
    		"	$youthResidentLessThan2YearsResidence &&" +
    		"	$dependentChildren == 0 && " +
    		"	(" +
    		"			($single && $youthLivingCircs && ($familyTotalGrossWeeklyIncome < $yppSingleGWILimit)) " +
    		"					|| " +
    		"			(!$single && $partner16or17 && ($familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit))" +
    		"	) ",




    potentialUndeterminedYoungParentPayment:
    	"	$youngParent &&" +
    	"	!$potentialInvalidsBenefit && " +
		"	$youthResidentLessThan2YearsResidence &&" +
		"	(" +
		"			($single && ($youthLivingCircs || ($livingAtHome && ($familyTotalGrossWeeklyIncome < $yppParentalIncomeGWILimit)))) " +
		"					|| " +
		"			(!$single && $partner16to18 && ($familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit))" +
		"	) ",



    potentialBenefit: "$potentialInvalidsBenefit || $potentialDPBCareOrSickOrInfirm || $potentialWidowsBenefit ||  $potentialWidowsBenefitPBA || $potentialDPBSoleParent || $potentialDPBSoleParentPBAWithTeen || $potentialDPBSoleParentPBAWithYoungChild ||$potentialDPBWomanAlone || $potentialHealthRelatedBenefit || $potentialUnemploymentBenefitTraining || $potentialUnemploymentBenefit || $potentialExtraHelp",
    potentialYouthPackage: "$potentialYouthPayment || $potentialYoungParentPayment || $potentialUndeterminedYouthPayment || $potentialUndeterminedYoungParentPayment",
    potentialSuper: "$potentialNewZealandSuperannuationSingle || $potentialNewZealandSuperannuationNonQualifiedSpouse || $potentialNewZealandSupperannuationPartnerNotIncluded",

    // -------- Supplements (e.g., not main benefits) ------- //

    // Note we're deliberately not testing income and asset thresholds here. The rules are very complicated.
    potentialAccommodationSupplement:
        "   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
        "   && " +
        "	!($accomodationType == 'Rent' && $housingNz)" // a simpler equivalent of the spreadsheet condition
    ,

    potentialDisabilityAllowance:
    	"   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
    	"	&& $disabilityCosts " +
    	"	&& $workingAge " +
    	"	&& $familyTotalGrossWeeklyIncome < $daGWILimit" ,



    potentialChildcareSubsidy:
    	"   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
    	"	&& ($childAged04 || $childAged5NotAtSchool)" +
    	"	&& $oscar " +
    	"	&& (" +
    	"		($dependentChildren == 1 && $familyTotalGrossWeeklyIncome < $ccs1ChildLimit) || " +
    	"		($dependentChildren == 2 && $familyTotalGrossWeeklyIncome < $ccs2ChildrenLimit) || " +
    	"		($dependentChildren >= 3 && $familyTotalGrossWeeklyIncome < $ccs3ChildrenLimit) " +
    	"		)" ,

    	//the rules for this dion't match the description - we don't refer to education or training in the rules..?
    potentialGuaranteedChildcareAssistancePayment:
    	"	   ($partner16to18 || $age16to18) " +
    	"	&& ($childAged04 || $childAged5NotAtSchool) " +
    	"	&& $oscar" ,

    potentialOSCARSubsidy:"   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
    		"&& (($childAged513 || ($childAged1418 && $childDisabilityAllowance)))" +
    		"&& $oscar" +
    		"&& ($single || (!$single && !$partnerProvideChildcare))" +
    		"&& (" +
	    	"		($dependentChildren == 1 && $familyTotalGrossWeeklyIncome < $OSCAR1ChildLimit) || " +
	    	"		($dependentChildren == 2 && $familyTotalGrossWeeklyIncome < $OSCAR2ChildrenLimit) || " +
	    	"		($dependentChildren >= 3 && $familyTotalGrossWeeklyIncome < $OSCAR3ChildrenLimit) " +
	    	"		)" ,


    potentialTemporaryAdditionalSupport:"   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
    		"&& $notMeetingLivingCosts " +
    		"&& (" +
    		"	($single && $dependentChildren == 0 && $cashAssets < $TASSingleCashAssetLimit)" +
    		"	||" +
    		"	($single && $dependentChildren == 1 && $cashAssets < $TASSoleParent1ChildCashAssetLimit)" +
    		"	||" +
    		"	($single && $dependentChildren >= 2 && $cashAssets < $TASanyotherSoleParentCashAssetLimit)" +
    		"	||" +
    		"	(!$single && $cashAssets < $TASRelationshipCashAssetLimit)" +
    		"	)" ,
    
    potentialChildDisabilityAllowance:
    		"   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
    		"	&& ($youth || $workingAge || $seniorsAge)	" +
    		"	&& $caringForChild " +
    		"	&& ($childAged04 || $childAged513 || $childAged1418 )" +
    		"	&& $childStayingInNz " +
    		"	&& ($childLivingSituation=='Living at home' || ($childLivingSituation=='Residential Home or Hostel' && $supportChildInHostel))" ,
    
    


    potentialLivingAlonePayment:
            "$potentialSuper && " +
            "($singleLivingAlone || $singleNotLivingAlone || $relationshipLivingAlone || $relationshipNotLivingAlone || $relationshipPartnerInPublicHospital)",


    potentialExtraHelp:false,

    
    

    age: "calculator.calculateAge($dateOfBirth)"
};


var allBenefits = [ /* This is all the variables that we want to be checked as potential benefits */
                    	"potentialDPBSoleParent",
                    	"potentialDPBSoleParentPBAWithTeen",
                    	"potentialDPBSoleParentPBAWithYoungChild",
                    	"potentialInvalidsBenefit",
                    	"potentialDPBCareOrSickOrInfirm",
                    	"potentialWidowsBenefitPBA" ,
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
                    	"potentialUndeterminedWorkingAgeFinancialAssistance",
                        "potentialUndeterminedYouthPayment"
];
var allOtherBenefits = [   //these are actually supplements but we treat them the same way.
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

