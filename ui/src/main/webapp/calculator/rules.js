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

    deceasedPartner: "$relationshipStatusSingle=='Widowed' || relationshipStatusSingle=='Defacto Partner Deceased' || relationshipStatusSingle=='Civil Union Partner Deceased'",

    // -------- Benefit definitions --------

    resident: "$stayingInNz && $twoYears && $residencyResident",
    refugeeOtherWithPermanentResidence: "$stayingInNz && $twoYears && $residencyRefugeePermanent",
    workingAge: "($age == 18 && $dependentChildren == 0) || ($age >= 19 && $age < 65)",
    age50to64: "($age >= 50 && $age <= 64)",
    single: "!$partner", // spreadsheet also lists all values of relationshipStatusSingle; not sure why

    
    // -- Values -- //
    
    widowsSoleParentGWILimit : 570,
    dpbCsiSoleParentGWILimit : 570,
    ibSingle18GWILimit : 300,
    ibSoleParentGWILimit : 300,
    ibRelationshipGWILimit : 300,
    

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

    // 
    /**
     * probably won't need these:
     * 
    ubsbSingle18to19LivingAtHome:136.64,
    ubsbSingle18to19LivingAwayFromHome:170.80,
    ubsbSingle20to24:170.80,
    ubsbOver25:204.96,
    ubsbRelationshipWithoutChildren:341.60,
    ubsbRelationshipWithoutChildrenEach:170.80,
    
    dpbWomanAloneSingleWithChildren:213.49,
    dpbWidowSoleParent:293.58,
    dpbCsiSingle18:256.19,
    dpbSoleParent:336.55,
    dpbHalfMarriedRate:213.49,
    
    ibSingle16to17:207.32,
    ibSingleOver18:256.19,
    ibRelationshipNoChildren:426.98,
    ibRelationshipNoChildrenEach:213.49,
    ibSoleParent:338.55,
    ibRelationshipWithChildren:426.98,
    ibRelationshipWithChildrenEach:213.49,
    
    
    UB SB - single 18-19 living at home
    UB SB - single 18-19 living away from home
    UB SB - single 20-24
    UB SB over 25 
    UB SB - relationship without children
    UB SB - relationship without children (each) 
    UB SB Sole Parent
    UB SB - relationship withchildren
    UB SB - relationship with children (each)
    Youth Payment
    Youth Payment - relationship without children
    Young Parent Payment - Sole Parent
    Young Parent Payment - relationship with children
    DPB Widows Woman Alone - Single no children
    DPB Widows  - Sole Parent
    DPBCSI - Single 18 and over
    DPBCSI - Sole Parent
    DPBCSI - Half Married rate
    IB Single 16-17
    IB Single over 18
    IB Relationship without children
    IB Relationship without children (each)
    IB Sole Parent 
    IB Relationship with children
    IB Relationship with children (each)*/

    
    // -- pre-benefit activities 
    
    
    

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
                    	"potentialHealthRelatedBenefit"
                   ];

var allObligations = [ "testObligation" ];