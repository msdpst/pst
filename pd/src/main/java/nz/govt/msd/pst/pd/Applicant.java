package nz.govt.msd.pst.pd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Configurable
public class Applicant {
    @Min(0) @Max(120) private Integer age;
    @Autowired private SampleService sampleService;
    private Logger logger = LoggerFactory.getLogger(getClass());
    
    public String getTestStatus() {
        return sampleService != null ? "Working" : "Broken";
    }
    
    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
