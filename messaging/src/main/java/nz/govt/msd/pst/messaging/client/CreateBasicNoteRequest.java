
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
 *         &lt;element name="swn" type="{http://msd.govt.nz/common}swn"/>
 *         &lt;element name="subjectTypeId" type="{http://msd.govt.nz/client/notes}subjectTypeId"/>
 *         &lt;element name="shortDescription" type="{http://msd.govt.nz/client/notes}description"/>
 *         &lt;element name="noteText" type="{http://msd.govt.nz/client/notes}noteText"/>
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
    "subjectTypeId",
    "shortDescription",
    "noteText",
    "invokingUser"
})
@XmlRootElement(name = "createBasicNoteRequest", namespace = "http://msd.govt.nz/client/notes")
public class CreateBasicNoteRequest {

    @XmlElement(namespace = "http://msd.govt.nz/client/notes", required = true)
    protected String swn;
    @XmlElement(namespace = "http://msd.govt.nz/client/notes", required = true)
    protected String subjectTypeId;
    @XmlElement(namespace = "http://msd.govt.nz/client/notes", required = true)
    protected String shortDescription;
    @XmlElement(namespace = "http://msd.govt.nz/client/notes", required = true)
    protected String noteText;
    @XmlElement(namespace = "http://msd.govt.nz/client/notes", required = true)
    protected String invokingUser;

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
     * Gets the value of the subjectTypeId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSubjectTypeId() {
        return subjectTypeId;
    }

    /**
     * Sets the value of the subjectTypeId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSubjectTypeId(String value) {
        this.subjectTypeId = value;
    }

    /**
     * Gets the value of the shortDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getShortDescription() {
        return shortDescription;
    }

    /**
     * Sets the value of the shortDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setShortDescription(String value) {
        this.shortDescription = value;
    }

    /**
     * Gets the value of the noteText property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNoteText() {
        return noteText;
    }

    /**
     * Sets the value of the noteText property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNoteText(String value) {
        this.noteText = value;
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
