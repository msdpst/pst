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

    youthLivingCircs : "!$livingAtHome && !$parentSupport && " +
    		"(" +
    		"	$reasonNotLivingAtHome == 'Relationship breakdown with parents' || " +
    		"	$reasonNotLivingAtHome == 'Parents are absent' || " +
    		"	$reasonNotLivingAtHome == 'Other good and sufficient reason' || " +
    		"	$reasonNotLivingAtHome == 'No longer in Child, Youth and Family care' " +
    		")",
    
    
    // -- Values -- //
    
    widowsSoleParentGWILimit : 570,
    dpbCsiSoleParentGWILimit : 570,
    ibSingle18GWILimit : 300,
    ibSoleParentGWILimit : 300,
    ibRelationshipGWILimit : 300,
    yppSingleGWILimit : 300,
    yppRelationshipGWILimit:300,
    

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
    		"	$youth && " +
    		"	$single && " +
    		"	(	(" +
    		"			$youthLivingCircs && ($familyTotalGrossWeeklyIncome < $yppSingleGWILimit) " +
    		"		) " +
    		"		||	" +
    		"		(" +
    		"			!$single && ($partnerAge<=17 && $partnerAge>=16)" +
    		"			" +
    		"		)	" +
    		"	) && $familyTotalGrossWeeklyIncome < $yppRelationshipGWILimit &&" +
    		"	$dependentChildren == 0 && " +
    		"	!$potentialInvalidsBenefit ",
    
    
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


    // -------- Pre-Benefit Activities--------
    createCV: "$potentialDPBSoleParent",



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
                    	"potentialYouthPayment"
                   ];
var allObligations = [  ];

var allPBAs = [ "createCV" ];
