
package nz.govt.msd.pst.messaging.client;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for coreSystem.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="coreSystem">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="abt"/>
 *     &lt;enumeration value="global"/>
 *     &lt;enumeration value="sal"/>
 *     &lt;enumeration value="solo"/>
 *     &lt;enumeration value="swiftt"/>
 *     &lt;enumeration value="trace"/>
 *     &lt;enumeration value="ucvii"/>
 *     &lt;enumeration value="wam"/>
 *     &lt;enumeration value="cms"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "coreSystem", namespace = "http://msd.govt.nz/common")
@XmlEnum
public enum CoreSystem {

    @XmlEnumValue("abt")
    ABT("abt"),
    @XmlEnumValue("global")
    GLOBAL("global"),
    @XmlEnumValue("sal")
    SAL("sal"),
    @XmlEnumValue("solo")
    SOLO("solo"),
    @XmlEnumValue("swiftt")
    SWIFTT("swiftt"),
    @XmlEnumValue("trace")
    TRACE("trace"),
    @XmlEnumValue("ucvii")
    UCVII("ucvii"),
    @XmlEnumValue("wam")
    WAM("wam"),
    @XmlEnumValue("cms")
    CMS("cms");
    private final String value;

    CoreSystem(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static CoreSystem fromValue(String v) {
        for (CoreSystem c: CoreSystem.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
