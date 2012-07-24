package nz.govt.msd.pst.pd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SampleService {
    private Logger logger = LoggerFactory.getLogger(getClass());
    
    public String hello() {
        logger.info("returning hello");
        return "hello";
    }
    
    public Applicant getApplicant() {
        return new Applicant();
    }
}
