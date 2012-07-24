package nz.govt.msd.pst.controllers;

import nz.govt.msd.pst.pd.Applicant;
import nz.govt.msd.pst.pd.SampleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;
import java.net.URLEncoder;

@Controller
@RequestMapping("/sample")
public class SampleController {
    @Autowired SampleService sampleService;
    private Logger logger = LoggerFactory.getLogger(getClass());
    
    @ModelAttribute
    public Applicant getApplicant() {
        return sampleService.getApplicant();
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public String show() {
        return "sample";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String save(@ModelAttribute @Valid Applicant applicant, BindingResult result) {
        if (result.hasErrors()) {
            logger.debug("it has errors");
            return show();
        }
        else {
            logger.debug("it has age {}", applicant.getAge());
            return "redirect:http://google.com?q=" + URLEncoder.encode("\"I am " + applicant.getAge() + "\"");
        }
    }
}
