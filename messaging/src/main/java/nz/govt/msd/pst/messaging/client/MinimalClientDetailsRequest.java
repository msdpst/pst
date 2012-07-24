
package nz.govt.msd.pst.messaging.client;

import java.util.ArrayList;
import java.util.List;
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
 *         &lt;element name="swn" type="{http://msd.govt.nz/common}swn" maxOccurs="unbounded"/>
 *         &lt;element name="invokingUser" type="{http://msd.govt.nz/common}modifiedByUser"/>
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
    "swn",
    "invokingUser"
})
@XmlRootElement(name = "minimalClientDetailsRequest")
public class MinimalClientDetailsRequest {

    @XmlElement(required = true)
    protected List<String> swn;
    @XmlElement(required = true)
    protected String invokingUser;

    /**
     * Gets the value of the swn property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the swn property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSwn().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getSwn() {
        if (swn == null) {
            swn = new ArrayList<String>();
        }
        return this.swn;
    }

    /**
     * Gets the value of the invokingUser property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInvokingUser() {
        return invokingUser;
    }

    /**
     * Sets the value of the invokingUser property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInvokingUser(String value) {
        this.invokingUser = value;
    }

}
