
package nz.govt.msd.pst.messaging.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element ref="{http://msd.govt.nz/client}minimalClientDetailsRequest"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "minimalClientDetailsRequest"
})
@XmlRootElement(name = "minimalDetails")
public class MinimalDetails {

    @XmlElement(required = true)
    protected MinimalClientDetailsRequest minimalClientDetailsRequest;

    /**
     * Gets the value of the minimalClientDetailsRequest property.
     * 
     * @return
     *     possible object is
     *     {@link MinimalClientDetailsRequest }
     *     
     */
    public MinimalClientDetailsRequest getMinimalClientDetailsRequest() {
        return minimalClientDetailsRequest;
    }

    /**
     * Sets the value of the minimalClientDetailsRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link MinimalClientDetailsRequest }
     *     
     */
    public void setMinimalClientDetailsRequest(MinimalClientDetailsRequest value) {
        this.minimalClientDetailsRequest = value;
    }

}
