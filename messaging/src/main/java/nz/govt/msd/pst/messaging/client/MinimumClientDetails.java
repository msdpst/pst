
package nz.govt.msd.pst.messaging.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for minimumClientDetails complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="minimumClientDetails">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="swn" type="{http://msd.govt.nz/common}swn"/>
 *         &lt;element name="name">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="title" type="{http://msd.govt.nz/client}title" minOccurs="0"/>
 *                   &lt;element name="givenName" type="{http://msd.govt.nz/client}givenName" minOccurs="0"/>
 *                   &lt;element name="otherGivenName" type="{http://msd.govt.nz/client}otherGivenName" minOccurs="0"/>
 *                   &lt;element name="familyName" type="{http://msd.govt.nz/client}familyName" minOccurs="0"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="address">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="addressLine1" type="{http://msd.govt.nz/client}addressLine1" minOccurs="0"/>
 *                   &lt;element name="suburbName" type="{http://msd.govt.nz/client}suburbName" minOccurs="0"/>
 *                   &lt;element name="cityName" type="{http://msd.govt.nz/client}cityName" minOccurs="0"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="secure" type="{http://msd.govt.nz/client}secure"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "minimumClientDetails", propOrder = {
    "swn",
    "name",
    "address",
    "secure"
})
public class MinimumClientDetails {

    @XmlElement(required = true)
    protected String swn;
    @XmlElement(required = true)
    protected MinimumClientDetails.Name name;
    @XmlElement(required = true)
    protected MinimumClientDetails.Address address;
    protected boolean secure;

    /**
     * Gets the value of the swn property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSwn() {
        return swn;
    }

    /**
     * Sets the value of the swn property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSwn(String value) {
        this.swn = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link MinimumClientDetails.Name }
     *     
     */
    public MinimumClientDetails.Name getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link MinimumClientDetails.Name }
     *     
     */
    public void setName(MinimumClientDetails.Name value) {
        this.name = value;
    }

    /**
     * Gets the value of the address property.
     * 
     * @return
     *     possible object is
     *     {@link MinimumClientDetails.Address }
     *     
     */
    public MinimumClientDetails.Address getAddress() {
        return address;
    }

    /**
     * Sets the value of the address property.
     * 
     * @param value
     *     allowed object is
     *     {@link MinimumClientDetails.Address }
     *     
     */
    public void setAddress(MinimumClientDetails.Address value) {
        this.address = value;
    }

    /**
     * Gets the value of the secure property.
     * 
     */
    public boolean isSecure() {
        return secure;
    }

    /**
     * Sets the value of the secure property.
     * 
     */
    public void setSecure(boolean value) {
        this.secure = value;
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
     *         &lt;element name="addressLine1" type="{http://msd.govt.nz/client}addressLine1" minOccurs="0"/>
     *         &lt;element name="suburbName" type="{http://msd.govt.nz/client}suburbName" minOccurs="0"/>
     *         &lt;element name="cityName" type="{http://msd.govt.nz/client}cityName" minOccurs="0"/>
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
        "addressLine1",
        "suburbName",
        "cityName"
    })
    public static class Address {

        protected String addressLine1;
        protected String suburbName;
        protected String cityName;

        /**
         * Gets the value of the addressLine1 property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getAddressLine1() {
            return addressLine1;
        }

        /**
         * Sets the value of the addressLine1 property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setAddressLine1(String value) {
            this.addressLine1 = value;
        }

        /**
         * Gets the value of the suburbName property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getSuburbName() {
            return suburbName;
        }

        /**
         * Sets the value of the suburbName property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setSuburbName(String value) {
            this.suburbName = value;
        }

        /**
         * Gets the value of the cityName property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getCityName() {
            return cityName;
        }

        /**
         * Sets the value of the cityName property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setCityName(String value) {
            this.cityName = value;
        }

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
     *         &lt;element name="title" type="{http://msd.govt.nz/client}title" minOccurs="0"/>
     *         &lt;element name="givenName" type="{http://msd.govt.nz/client}givenName" minOccurs="0"/>
     *         &lt;element name="otherGivenName" type="{http://msd.govt.nz/client}otherGivenName" minOccurs="0"/>
     *         &lt;element name="familyName" type="{http://msd.govt.nz/client}familyName" minOccurs="0"/>
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
        "title",
        "givenName",
        "otherGivenName",
        "familyName"
    })
    public static class Name {

        protected String title;
        protected String givenName;
        protected String otherGivenName;
        protected String familyName;

        /**
         * Gets the value of the title property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getTitle() {
            return title;
        }

        /**
         * Sets the value of the title property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setTitle(String value) {
            this.title = value;
        }

        /**
         * Gets the value of the givenName property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getGivenName() {
            return givenName;
        }

        /**
         * Sets the value of the givenName property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setGivenName(String value) {
            this.givenName = value;
        }

        /**
         * Gets the value of the otherGivenName property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getOtherGivenName() {
            return otherGivenName;
        }

        /**
         * Sets the value of the otherGivenName property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setOtherGivenName(String value) {
            this.otherGivenName = value;
        }

        /**
         * Gets the value of the familyName property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getFamilyName() {
            return familyName;
        }

        /**
         * Sets the value of the familyName property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setFamilyName(String value) {
            this.familyName = value;
        }

    }

}
