
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
 *         &lt;element ref="{http://msd.govt.nz/client/notes}createBasicNoteRequest"/>
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
    "createBasicNoteRequest"
})
@XmlRootElement(name = "createNote")
public class CreateNote {

    @XmlElement(namespace = "http://msd.govt.nz/client/notes", required = true)
    protected CreateBasicNoteRequest createBasicNoteRequest;

    /**
     * Gets the value of the createBasicNoteRequest property.
     * 
     * @return
     *     possible object is
     *     {@link CreateBasicNoteRequest }
     *     
     */
    public CreateBasicNoteRequest getCreateBasicNoteRequest() {
        return createBasicNoteRequest;
    }

    /**
     * Sets the value of the createBasicNoteRequest property.
     * 
     * @param value
     *     allowed object is
     *     {@link CreateBasicNoteRequest }
     *     
     */
    public void setCreateBasicNoteRequest(CreateBasicNoteRequest value) {
        this.createBasicNoteRequest = value;
    }

}
