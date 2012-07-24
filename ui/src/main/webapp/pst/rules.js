var definitions = {
    wrk4uRequired: "!($benefit == 'DPB' && $youngestChildAge != 'over13')",
    cvRequired: "!($benefit == 'DPB' && $youngestChildAge == 'upTo4')",
    jobSearchProfileRequired: "!($benefit == 'DPB' && $youngestChildAge == 'upTo4')",
    jobSearchEvidenceRequired: "!($benefit == 'DPB' && $youngestChildAge == 'upTo4')",
    pamRequired: true
};