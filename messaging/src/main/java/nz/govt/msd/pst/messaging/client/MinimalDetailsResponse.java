
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
 *         &lt;element ref="{http://msd.govt.nz/client}minimalClientDetailsResponse"/>
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
    "minimalClientDetailsResponse"
})
@XmlRootElement(name = "minimalDetailsResponse")
public class MinimalDetailsResponse {

    @XmlElement(required = true)
    protected MinimalClientDetailsResponse minimalClientDetailsResponse;

    /**
     * Gets the value of the minimalClientDetailsResponse property.
     * 
     * @return
     *     possible object is
     *     {@link MinimalClientDetailsResponse }
     *     
     */
    public MinimalClientDetailsResponse getMinimalClientDetailsResponse() {
        return minimalClientDetailsResponse;
    }

    /**
     * Sets the value of the minimalClientDetailsResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link MinimalClientDetailsResponse }
     *     
     */
    public void setMinimalClientDetailsResponse(MinimalClientDetailsResponse value) {
        this.minimalClientDetailsResponse = value;
    }

}
