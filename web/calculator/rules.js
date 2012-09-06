engine.definitions = {

    // -------- Question preconditions --------

    seniorsAge: "$age >= 64.75 && $age < 131",
    livingAlonePartnerInCare: "!$liveTogether && ($partnerLives == 'Rest home' || $partnerLives == 'Private hospital' || $partnerLives == 'Other')",
    relationshipSituation: "$relationshipStatusSingle == 'Separated from Civil Union Partner' || $relationshipStatusSingle == 'Separated from Defacto Partner' || $relationshipStatusSingle == 'Separated from Spouse' || $relationshipStatusSingle == 'Divorced' || $relationshipStatusSingle == 'Civil Union Dissolved' || $relationshipStatusSingle == 'Single' || $relationshipStatusPartner == 'Defacto - Partner in prison' || $relationshipStatusPartner == 'Civil Union - Partner in prison' || $relationshipStatusPartner == 'Married - Partner in prison'",
    relationshipSituationPartner: "$relationshipStatusPartner == 'Living Defacto' || $relationshipStatusPartner == 'Civil Union' || $relationshipStatusPartner == 'Married'",
   
    //under20: "($age>=18 && $age<19 && $dependentChildren == 0) || ($age>=19 && $age<20)", //((age = 18 AND dependentchildren = 0) OR age = 19)?
   
    under20:"$age < 20",
    age18: "$age >= 18 && $age < 19",
    age16to17: "$age >= 16 && $age < 18",
    age16to18: "$age >= 16 && $age < 19",
    age18to19: "$age >= 18 && $age < 20",
    age20to24: "$age >= 20 && $age < 25",
    age25Plus:"$age >= 25",
    
    
    youth: "$age >= 16 && $age < 19 && ($age < 18 || ($age >= 18 && $dependentChildren != 0))", // $age >= 16 && $age < 19 && ($age <= 17 || ($age >= 18 && $dependentChildren != 0))
   
    workingAge: "($age >= 18 && $age < 65 && $dependentChildren == 0) || ($age >= 19 && $age < 65)",
    //workingAge:"true",
    ibYouth: "$age16to17",
    parent: "$dependentChildren >= 1",
    youngParent: "$age16to18 && $parent",
    oscarAgedChild: "$childAged513",
    seniorPartnerResident:"$partnerNZ && ($partnerResidency == 'NZ Citizen (by birth)' || $partnerResidency == 'NZ Citizen (Other)' || $partnerResidency == 'Permanent Resident' || $partnerResidency == 'Refugee - Quota' || $partnerResidency == 'Australian')",

    hasYoungest14Plus:"!$childAged04 && !$childAged5NotAtSchool && !$childAged513 && $childAged1418",
    hasYoungest5to13:"!$childAged04 && !$childAged5NotAtSchool && $childAged513",
    

    // -------- Shortcuts for questions --------

    seniorOk: "$seniorsAge && $tenYears && $fiveYears",
    residencyResident: "$residency == 'NZ Citizen (by birth)' || " +
    		"$residency == 'NZ Citizen (Other)' || " +
    		"$residency == 'Permanent Resident' || " +
    		"$residency == 'Refugee - Quota' || " +
    		"$residency == 'Australian' || " +
    		"$residency == 'Refugee - Other with Permanent Residence'",

    
    unlawfulResident:
    		" $residency == 'Limited Purpose Permit' || " +
    		" $residency == 'Living In Other Countries' || " +
    		" $residency == 'No Current Permit' || " +
    		" $residency == 'Refugee - other without Permanent Residence' || " +
    		" $residency == 'Student Permit' || " +
    		" $residency == 'Temporary Work Permit' || " +
    		" $residency == 'Visitor Permit' || " +
    		" $residency == 'Working Holiday'",
    
    deceasedPartner: "$relationshipStatusSingle=='Widowed' || $relationshipStatusSingle =='Defacto Partner Deceased' || $relationshipStatusSingle=='Civil Union Partner Deceased'",

    // -------- Benefit definitions --------

    resident: "$stayingInNz && $twoYears && $residencyResident",
    refugeeOtherWithPermanentResidence: "$stayingInNz && !$twoYears && $residency == 'Refugee - Other with Permanent Residence'",
    
    seniorResident:"$residencyResident && $tenYears && $fiveYears",
   
    ibWorkingAge: "($age >= 18 && $age < 65)",  
    age50to64: "($age >= 50 && $age < 65)",
    partner16or17: "$partnerAge >= 16 && $partnerAge < 18",
    partner16to18: "$partnerAge >= 16 && $partnerAge < 19",
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

	uBSBrelationshipIncomeLimit:"!$single && ($familyTotalGrossWeeklyIncome < $ubRelationshipGWILimit )",
	uBSBsoleParentIncomeLimit:"!$single && $dependentChildren >= 1 && ($familyTotalGrossWeeklyIncome < $ubSoleParentGWILimit )",
	
	
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
    		"		||" +
    		"	($ibYouth && $totalOtherIncomeCalculation < $ibSingleYouthGWILimit)" +
    		")",
    
    
    blindRelationship:"!$single && $totallyBlind && $blindApplicantTotalIncomeRelationship < $ibRelationshipGWILimit && " +
	" (" +
	"	$ibWorkingAge || $ibYouth" +
	" )",
	
	
    blindSoleParent:"($ibWorkingAge || $ibYouth) && $totallyBlind && $single && $dependentChildren > 0 &&" +
    		"$totalOtherIncomeCalculation < $ibSoleParentGWILimit",
    
    
    // -- Limits -- //

    widowsSoleParentGWILimit : 577,//Widows Sole Parent GWI Limit
    widowsSingleGWILimit : 463,//Widows Sole Parent GWI Limit
    dpbSoleParentGWILimit : 577,//DPB Sole Parent GWI Limit
    dpbCsiSoleParentGWILimit : 638,//DPB CSI Sole Parent GWI Limit
    dpbWomanAloneGWILimit : 463,//DPB Woman Alone GWI Limit

    ibSingle18GWILimit : 524,//IB Single 18+ GWI Limit
    ibSingleYouthGWILimit : 454,//IB Single Youth GWI Limit
    ibSoleParentGWILimit : 638,//IB Sole Parent GWI Limit
    ibRelationshipGWILimit : 768,//IB Relationship GWI Limit

    yppSingleGWILimit : 257,//YPP single GWI Limit
    yppRelationshipGWILimit:307,//YPP Relationship GWI Limit
    yppParentalIncomeGWILimit:2652,//YPP Parental Income GWI Limit

    ubSingle1819AtHomeGWILimit:276, //UB Single 18-19 at home GWI Limit
    ubSingle1819AwayGWILimit:324, //UB Single 18-19 away from home GWI Limit
    ubSingle2024GWILimit:324, //UB Single 20-24 GWI Limit
    ubSingle25GWILimit:373, //UB Single 25+ GWI Limit
    ubSoleParentGWILimit:500, //UB Sole Parent Limit
    ubRelationshipGWILimit:568, //UB Relationship Limit
    
    csiSingleYouthLimit:454.00,
    csiSingle18Limit:524.00,
    csiHalfRelLimit:768.00,
    csiSoleParentLimit:638.00,
    
    ccs1ChildLimit: 1400,//CCS 1 Child GWI Limit
    ccs2ChildrenLimit: 1600,//CCS 2 Children GWI Limit 
    ccs3ChildrenLimit: 1800,//CCS 3 or more Children GWI Limit

    OSCAR1ChildLimit:1400.00,//OSCAR 1 Child GWI Limit 
    OSCAR2ChildrenLimit:1600.00,//OSCAR 2 Children GWI Limit
    OSCAR3ChildrenLimit:1800.00,//OSCAR 3 or more Children GWI Limit

    TASSingleCashAssetLimit:1025.11, //TAS Single Cash Asset Limit
    TASRelationshipCashAssetLimit:1708.10,//TAS Relationship Cash Asset Limit
    TASSoleParent1ChildCashAssetLimit:1346,//TAS Sole Parent 1 Child Cash Asset Limit
    TASanyotherSoleParentCashAssetLimit:1445.89,//TAS any other Sole Parent Cash Asset Limit

    nonQualifiedPartnerIncludedLimit:860,//Non-qualified partner included

    daGWILimits: {
        "$workingAge && $single && $dependentChildren == 0": 585.67, // DA Single Working Age GWI Limit
        "$workingAge && $single && $dependentChildren == 1": 705.72, // DA Sole Parent 1 Child GWI Limit
        "$workingAge && $single && $dependentChildren > 1": 743.53,  // DA Sole Parent 2+ Children GWI Limit
        "$workingAge && $partner": 866.91, // DA Relationship GWI Limit
        "$youth && $single && $dependentChildren == 0": 506.01, // DA Single Youth GWI Limit
        "$youth && $partner && $dependentChildren == 0": 866.91, // DA Relationship GWI Limit
        "$youngParent && $single": 506.01, // DA Single Youth GWI Limit
        "$youngParent && $partner && $partnerAge < 18": 866.91, // DA Relationship GWI Limit
        "$seniorsAge && $single && $dependentChildren == 0": 585.67, // NZS DA Siingle 18+ years
        "$seniorsAge && $single && $dependentChildren == 1": 705.72, // NZS DA Sole Parent 1 child
        "$seniorsAge && $single && $dependentChildren > 1": 743.53,  // NZS DA Sole Parent 2+ children
        "$seniorsAge && $partner": 866.91, // NZS DA Married, civil union or defacto couple (with or without children)
        
        // Default to no eligibility
        "true": 0
    },
    daGWILimit: "engine.evalMap(engine.definitions.daGWILimits, 'daGWILimits')",
    
    
    extraHelpGWILimits: {
        "($workingAge || $youth) && $single && $dependentChildren == 0": 953.00, // ASUP Single Working Age GWI Limit Area 1
        "($workingAge || $youth) && $single && $dependentChildren == 1": 1140.00, // ASUP Sole Parent 1 Child GWI Limit Area 1
        "($workingAge || $youth) && $single && $dependentChildren > 1": 1400.00, // ASUP Sole Parent 2 Child GWI Limit Area 1
        "($workingAge || $youth) && !$single && $dependentChildren == 0": 1208.00, // ASUP Relationship Without Children GWI Limit Area 1
        "($workingAge || $youth) && !$single && $dependentChildren > 0": 1468.00, // ASUP Relationship With Children GWI Limit Area 1
        "true": -1 // disallow by default
    },
    extraHelpGWILimit: "engine.evalMap(engine.definitions.extraHelpGWILimits, 'extraHelpGWILimits')",


    // -- Rates -- //

    ratesUB : {
    	"$single && $age<20 && $age>=18 && $livingAtHome": "136.64",
    	"$single && $age<20 && $age>=18 && !$livingAtHome": "170.80",
    	"$single && $age<25 && $age>19": "170.80",
    	"$single && $age>=25": "204.96",
    	"$partner && $dependentChildren == 0 && ((!$partnerWorked || !$partnerStillWorking) || ($partnerStillWorking && $totalFamilyGrossWeeklyWage<$ubRelationshipGWILimit))": "170.80 (each - you and your partner)",
    	"$partner && $dependentChildren > 0": "170.80 (each - you and your partner)",
    	"$single && $dependentChildren > 0": "293.58"
    	
    },

    ratesIB : {
    	"$single && $dependentChildren > 0":"336.55",
    	"$single && ($age>=16 && $age<18)":"207.32",
    	"$single && $age>=18":"256.19",
    	"$partner && $dependentChildren == 0":"213.49 (each - you and your partner)",
    	"$partner && $dependentChildren > 0":"213.49 (each - you and your partner)"
    	
    },

    ratesDPB : {
    	"($potentialWidowsBenefitAny || $potentialDPBWomanAlone) && $dependentChildren == 0":"213.49",
    	"($potentialWidowsBenefitAny || $potentialDPBSoleParentAny) && $dependentChildren >= 1":"293.58",
    	"$potentialDPBCareOrSickOrInfirm && $single && $age>=18 && $dependentChildren == 0 ":"256.19",
    	"$potentialDPBCareOrSickOrInfirm && $single && $age>=18 && $dependentChildren >= 1 ":"336.55",
    	"$potentialDPBCareOrSickOrInfirm && !$single && $age>=18 && $dependentChildren >= 1 ":"213.49"
    },

    
	  ubRate: "engine.evalMap(engine.definitions.ratesUB)",
	  ibRate: "engine.evalMap(engine.definitions.ratesIB)",
	  dpbRate : "engine.evalMap(engine.definitions.ratesDPB)",


    // -------- Calculations --------
    totalFamilyGrossWeeklyWage: "$applicantGrossWeeklyWage + $partnerGrossWeeklyWage",
    totalOtherIncomeCalculation: "calculator.calculateTotalOtherIncome()",
    familyTotalGrossWeeklyIncome: "$totalFamilyGrossWeeklyWage + $totalOtherIncomeCalculation",
    blindApplicantTotalIncomeRelationship:"$totalOtherIncomeCalculation + $partnerGrossWeeklyWage",


    // -------- Main benefit eligibility --------

    potentialWidowsBenefitAny: "(($resident || $refugeeOtherWithPermanentResidence) && " +
    		"$gender == 'Female' && $deceasedPartner) && " +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialHealthRelatedBenefit && " +
    		"(	" +
    		"	($workingAge && " +
	    		"	($dependentChildren >= 1 && $familyTotalGrossWeeklyIncome < $widowsSoleParentGWILimit) " +
	    		"		|| " +
	    		"	($dependentChildren == 0 && $age50to64 && $familyTotalGrossWeeklyIncome < $widowsSingleGWILimit)" +
	    		")" +
    		")",
    		
    		
    potentialWidowsBenefitPBA: "$potentialWidowsBenefitAny && ($dependentChildren == 0 || $hasYoungest14Plus || $hasYoungest5to13)",		
    		
    potentialWidowsBenefitNoPBA : "$potentialWidowsBenefitAny && ($dependentChildren != 0 && ($childAged04 || $childAged5NotAtSchool))",		

    potentialDPBSoleParentAny: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$workingAge && " +
    		"	$single && " +
    		"	$dependentChildren >= 1 && " +
    		"	$familyTotalGrossWeeklyIncome < $dpbSoleParentGWILimit && " +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialHealthRelatedBenefit && " +
    		"	!$potentialWidowsBenefitAny",
    		
    		
    potentialDPBSoleParentPBAWithTeen:"$potentialDPBSoleParentAny && ($dependentChildren != 0 && $hasYoungest14Plus)",		
    potentialDPBSoleParentPBAWithYoungChild:"$potentialDPBSoleParentAny && ($dependentChildren != 0 && $hasYoungest5to13)",
    
    potentialDPBSoleParentNoPBA:"$potentialDPBSoleParentAny && ($dependentChildren != 0 & ($childAged04 || $childAged5NotAtSchool))",		
    
    

    potentialInvalidsBenefit: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	($healthDisability && $totallyBlind) && ($blindSingle || $blindRelationship || $blindSoleParent) ",

    potentialDPBCareOrSickOrInfirm: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	($caringFullTime && $carerRelationship != 'Partner')  && " +
    		"	$workingAge && (" +
    		
    		"	(" +
    		"		$single && " +
    		"		$dependentChildren == 0 && " +
    		"		$familyTotalGrossWeeklyIncome < $csiSingle18Limit" +
    		"	) ||" +
    		"	(" +
    		"		$single && " +
    		"		$dependentChildren >= 1 && " +
    		"		$familyTotalGrossWeeklyIncome < $csiSoleParentLimit" +
    		"	)||" +
    		"	(" +
    		"		!$single && " +
    		"		$familyTotalGrossWeeklyIncome < $csiHalfRelLimit" +
    		"	))" ,
    		
    		
    		

    potentialDPBWomanAlone: "($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$gender == 'Female' && " +
    		"	$age50to64 && " +
    		"   $dependentChildren == 0 && " +
            "   $familyTotalGrossWeeklyIncome < $dpbWomanAloneGWILimit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialWidowsBenefitAny && " +//potentialHealthRelatedBenefit
    		"	!$potentialDPBSoleParentAny && " +
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialHealthRelatedBenefit && " +
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
    		"	$workingAge && " +
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
    		"	!$potentialDPBCareOrSickOrInfirm" ,
    		//"	!$potentialWidowsBenefitAny && " +
    		//"	!$potentialDPBSoleParentAny && " +
    		//"	!$potentialDPBWomanAlone" ,


    potentialYouthPayment:
    		"   $resident && " +
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
    		"	$dependentChildren == 0 && " +
    		"	!$potentialInvalidsBenefit ",


    potentialYoungParentPayment:
    	"   $resident && " +
    	"	$youngParent && " +
    	"	!$potentialInvalidsBenefit && " +
    	"	(" +
    	"		(	" +
    	"			$single && " +
    	"			$familyTotalGrossWeeklyIncome < $yppSingleGWILimit && " +
    	"			($youthLivingCircs || ($livingAtHome && ($age18 || $parentsIncome <  $yppParentalIncomeGWILimit)))" +
    	"		) " +
    	"			|| " +
		"		(" +
		"			!$single && " +
		"			($partnerAge<=18 && $partnerAge>=16) &&" +
		"			$familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit" +
		"		)" +
		"	)	",


    potentialUnemploymentBenefitTraining:"($resident || $refugeeOtherWithPermanentResidence) && " +
    		"	$workingAge && " +
    		"	$foundationCourse && " +
    		" ( " +
    		"		!$haveWorked " +
    		"			|| " +
    		"		($haveWorked && !$stillWorking) " +
    		"			|| " +
    		"		($stillWorking && $weeklyHours <30 )" +
    		" ) && " +
			"   ( $single18to19uBSBAtHomeIncomeLimit || " +
			"	  $single18to19uBSBAwayFromHomeIncomeLimit ||" +
			"	  $single20to24uBSBIncomeLimit ||" +
			"	  $single25uBSBIncomeLimit ||" +
			"	  $uBSBrelationshipIncomeLimit ||" +
			"	  $uBSBsoleParentIncomeLimit" +
			"	) && " + 	
    		"	!$potentialInvalidsBenefit && " +
    		"	!$potentialDPBCareOrSickOrInfirm && " +
    		"	!$potentialWidowsBenefitAny && " +
    		"	!$potentialDPBSoleParentAny && " +
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
			"   ( $single18to19uBSBAtHomeIncomeLimit || " +
			"	  $single18to19uBSBAwayFromHomeIncomeLimit ||" +
			"	  $single20to24uBSBIncomeLimit ||" +
			"	  $single25uBSBIncomeLimit ||" +
			"	  $uBSBrelationshipIncomeLimit ||" +
			"	  $uBSBsoleParentIncomeLimit" +
			"	) && " +
			"	!$potentialInvalidsBenefit && " +
			"	!$potentialDPBCareOrSickOrInfirm && " +
			"	!$potentialWidowsBenefitAny && " +
			"	!$potentialDPBSoleParentAny && " +
			"	!$potentialDPBWomanAlone &&" +
			"	!$potentialUnemploymentBenefitTraining &&" +
			"	!$potentialHealthRelatedBenefit",

			
	
			

    potentialNewZealandSuperannuationSingle:"$seniorsAge && $seniorResident && $single ", //ACC stuff not required


    potentialNewZealandSuperannuationNonQualifiedSpouse:"$seniorsAge && $seniorResident && !$single && !$acc && " +
    		"			$includePartnerInNZS && !$partnerReceivingNZS && " +
    		"			$familyTotalGrossWeeklyIncome < $nonQualifiedPartnerIncludedLimit && " +
    		"			$partnerAge >= 16 && $seniorPartnerResident",


    potentialNewZealandSuperannuationPartnerNotIncluded:"$seniorsAge && $seniorResident && !$single && !$acc && " +
    		"			!$potentialNewZealandSuperannuationNonQualifiedSpouse && " +
    		"			((!$includePartnerInNZS || $partnerReceivingNZS) || " +
    		"			($includePartnerInNZS  && !$partnerReceivingNZS)) && " +
    		"			!$potentialNewZealandSuperannuationNonQualifiedSpouse " ,


   potentialUndeterminedWorkingAgeFinancialAssistance:
	   "	($workingAge || $seniorsAge ) && " +
	   "	!$potentialBenefit && " +
	   "	!$potentialWidowsBenefitAny && " +
	   "	!$potentialSuper",



    potentialUndeterminedYouthPayment:
    		"	!$potentialInvalidsBenefit && " +
    		"	$youthResidentLessThan2YearsResidence && " +
    		"	$dependentChildren == 0 && " +
    		"	(" +
    		"			($single && $youthLivingCircs && ($familyTotalGrossWeeklyIncome < $yppSingleGWILimit)) " +
    		"					|| " +
    		"			(!$single && $partner16or17 && ($familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit))" +
    		"	) ",




    potentialUndeterminedYoungParentPayment:
		"	$youthResidentLessThan2YearsResidence &&" +
    	"	$youngParent &&" +
		"	(" +
		"			($single && $familyTotalGrossWeeklyIncome < $yppSingleGWILimit && ($youthLivingCircs || ($livingAtHome && ($age18 || $parentsIncome <  $yppParentalIncomeGWILimit)))) " +
		"					|| " +
		"			(!$single && $partner16to18 && $familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit)" +
		"	) && " +
    	"	!$potentialInvalidsBenefit",


	potentialSupportedYouth:"$youth && (" +
			"	($single && $livingAtHome && $dependentChildren==0)" +
			"		||" +
				"	( " +
				"		(!$single && $partnerAge>=18 && $partnerAge<19 && $dependentChildren==0)" +
				"			||" +
				"		(!$single && $partnerAge>=19 && $dependentChildren>=1) " +
				"	)" +
			"	)",



    potentialBenefit: "$potentialInvalidsBenefit || $potentialDPBCareOrSickOrInfirm || $potentialWidowsBenefitAny || $potentialDPBSoleParentAny ||$potentialDPBWomanAlone || $potentialHealthRelatedBenefit || $potentialUnemploymentBenefitTraining || $potentialUnemploymentBenefit || $potentialExtraHelp",
    potentialYouthPackage: "$potentialYouthPayment || $potentialYoungParentPayment || $potentialUndeterminedYouthPayment || $potentialUndeterminedYoungParentPayment",
    potentialSuper: "$potentialNewZealandSuperannuationSingle || $potentialNewZealandSuperannuationNonQualifiedSpouse || $potentialNewZealandSuperannuationPartnerNotIncluded",

    // -------- Supplements (e.g., not main benefits) ------- //

    // Note we're deliberately not testing income and asset thresholds here. The rules are very complicated.
    potentialAccommodationSupplement:
        "   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
        "   && ($accommodationCosts) && " +
        "	!($accommodationType == 'Rent' && $housingNz)" // a simpler equivalent of the spreadsheet condition
    ,


    potentialDisabilityAllowance:
    	"   ($potentialBenefit || $potentialYouthPackage || $potentialSuper) " +
    	"	&& $disabilityCosts " +
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
    		"	&& ($childAged04 || $childAged513 || $childAged1418 || $childAged5NotAtSchool)" +
    		"	&& $childStayingInNz " +
    		"	&& ($childLivingSituation=='Living at home' || ($childLivingSituation=='Residential Home or Hostel' && $supportChildInHostel))" ,
    
    


    potentialLivingAlonePayment:
            "$potentialSuper && " +
            "($singleLivingAlone || $singleNotLivingAlone || $relationshipLivingAlone || $relationshipNotLivingAlone || $relationshipPartnerInPublicHospital)",


    potentialExtraHelp:
            "$stayingInNz && " +
            "$residencyResident && " +
            "!$potentialInvalidsBenefit && " +
            "!$potentialDPBCareOrSickOrInfirm && " +
            "!$potentialWidowsBenefitAny && " +
            "!$potentialDPBSoleParentAny && " +
            "!$potentialDPBWomanAlone && " +
            "!$potentialHealthRelatedBenefit && " +
            "!$potentialYouthPayment && " +
            "!$potentialYoungParentPayment && " +
            "!$potentialUndeterminedYouthPayment && " +
            "!$potentialSupportedYouth && " +
            "!$potentialUndeterminedYoungParentPayment && " +
            "!$potentialUnemploymentBenefitTraining && " +
            "!$potentialUnemploymentBenefit && "+
            "$familyTotalGrossWeeklyIncome < $extraHelpGWILimit" ,

    hasObligations: 
        "$potentialWidowsBenefitPBA || " +
        "$potentialDPBSoleParentPBAWithTeen || " +
        "$potentialDPBSoleParentPBAWithYoungChild || " +
        "$potentialDPBWomanAlone || " +
        "$potentialUnemploymentBenefitTraining || " +
        "$potentialUnemploymentBenefit",
    

    age: "calculator.calculateAge($dateOfBirth)"
    
    
};


/* All the variables that we want to be checked as potential main benefits */
var allMainBenefits = [ 
                    	"potentialNewZealandSuperannuationSingle",
                    	"potentialNewZealandSuperannuationNonQualifiedSpouse",
                    	"potentialNewZealandSuperannuationPartnerNotIncluded",
                    	"potentialUndeterminedWorkingAgeFinancialAssistance",
                    	"potentialDPBSoleParentNoPBA",
                    	"potentialDPBSoleParentPBAWithTeen",
                    	"potentialDPBSoleParentPBAWithYoungChild",
                    	"potentialInvalidsBenefit",
                    	"potentialDPBCareOrSickOrInfirm",
                    	"potentialWidowsBenefitPBA" ,
                    	"potentialWidowsBenefitNoPBA" ,
                    	"potentialDPBWomanAlone",
                    	"potentialHealthRelatedBenefit",
                    	"potentialYouthPayment",
                    	"potentialYoungParentPayment",
                    	"potentialUnemploymentBenefitTraining",
                    	"potentialUnemploymentBenefit",
                        "potentialUndeterminedYouthPayment",
                        "potentialUndeterminedYoungParentPayment",
                        "potentialExtraHelp"
];
/* All the variables that we want to be checked as potential supplementary benefits */
var allSupplementaryBenefits = [
                        "potentialAccommodationSupplement",
                        "potentialChildDisabilityAllowance",
                        "potentialChildcareSubsidy",
                        "potentialDisabilityAllowance",
                        "potentialGuaranteedChildcareAssistancePayment",
                        "potentialLivingAlonePayment",
                        "potentialOSCARSubsidy",
                        "potentialTemporaryAdditionalSupport"
                   ];

