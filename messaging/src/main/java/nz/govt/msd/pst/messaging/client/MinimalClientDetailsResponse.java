
package nz.govt.msd.pst.messaging.client;

import javax.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;


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
 *         &lt;element name="client" type="{http://msd.govt.nz/client}minimumClientDetails" maxOccurs="unbounded"/>
 *         &lt;element name="unmatchedSwns">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="swn" type="{http://msd.govt.nz/common}swn" maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
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
    "client",
    "unmatchedSwns"
})
@XmlRootElement(name = "minimalClientDetailsResponse")
public class MinimalClientDetailsResponse {

    @XmlElement(required = true)
    protected List<MinimumClientDetails> client;
    @XmlElement(required = true)
    protected MinimalClientDetailsResponse.UnmatchedSwns unmatchedSwns;

    /**
     * Gets the value of the client property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the client property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getClient().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link MinimumClientDetails }
     * 
     * 
     */
    public List<MinimumClientDetails> getClient() {
        if (client == null) {
            client = new ArrayList<MinimumClientDetails>();
        }
        return this.client;
    }

    /**
     * Gets the value of the unmatchedSwns property.
     * 
     * @return
     *     possible object is
     *     {@link MinimalClientDetailsResponse.UnmatchedSwns }
     *     
     */
    public MinimalClientDetailsResponse.UnmatchedSwns getUnmatchedSwns() {
        return unmatchedSwns;
    }

    /**
     * Sets the value of the unmatchedSwns property.
     * 
     * @param value
     *     allowed object is
     *     {@link MinimalClientDetailsResponse.UnmatchedSwns }
     *     
     */
    public void setUnmatchedSwns(MinimalClientDetailsResponse.UnmatchedSwns value) {
        this.unmatchedSwns = value;
    }


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
        "swn"
    })
    public static class UnmatchedSwns {

        @XmlElement(required = true)
        protected List<String> swn;

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

    }

}
