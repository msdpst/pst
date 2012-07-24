package nz.govt.msd.spring;

import org.springframework.beans.PropertyEditorRegistrar;
import org.springframework.beans.PropertyEditorRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.web.bind.support.ConfigurableWebBindingInitializer;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

/**
 * Enables trimming leading and trailing whitespace from all form fields that are
 * bound to string values.
 * <p/>
 * This affects all such fields anywhere in the web application.
 * <p/>
 * To use, just create as a Spring bean. (Requires Spring 3.1+)
 */
public class StringTrimmerEnabler {
    private boolean convertEmptyToNull;

    /**
     * @param convertEmptyToNull - if true, blank strings will be converted to nulls
     */
    public StringTrimmerEnabler(boolean convertEmptyToNull) {
        this.convertEmptyToNull = convertEmptyToNull;
    }

    @Autowired
    public void setup(RequestMappingHandlerAdapter adapter) {
        ConfigurableWebBindingInitializer bindingInitializer = (ConfigurableWebBindingInitializer) adapter
                .getWebBindingInitializer();

        bindingInitializer.setPropertyEditorRegistrar(new PropertyEditorRegistrar() {
            public void registerCustomEditors(PropertyEditorRegistry registry) {
                registry.registerCustomEditor(String.class, new StringTrimmerEditor(convertEmptyToNull));
            }
        });
    }
}
