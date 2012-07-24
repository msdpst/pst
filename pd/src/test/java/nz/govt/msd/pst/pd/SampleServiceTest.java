package nz.govt.msd.pst.pd;

import junit.framework.Assert;
import nz.govt.msd.pst.BaseTest;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class SampleServiceTest extends BaseTest {
    @Autowired SampleService sampleService;
    private Logger logger = LoggerFactory.getLogger(getClass());
    
    @Test
    public void test() {
        String result = sampleService.hello();
        logger.info("result = " + result);
        Assert.assertNotNull(result);
    }
}
